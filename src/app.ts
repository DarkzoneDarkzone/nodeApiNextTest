import { chatRouter } from './routes/chatRouter';
import express, {  Application } from 'express'
import { socketPort, serverPort } from './util/config'
import { webRouter } from './routes/webRouter'
import path from 'path'
import { SIO } from './util/Sockets'

/** testing */
import _ from 'lodash'
import morgan from 'morgan'
var fs = require('fs')

const app: Application = express()
app.use(express.static(path.join(__dirname, './../dist/public/')))

/*  -------- converting json -------- */  
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// เขียน Log ลงไฟล์ access.log
const pathName = path.join(__dirname, '../dist/public/logfiles/')
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName);
}
var accessLogStream = fs.createWriteStream(pathName, { flags: 'a' })

app.use(morgan('combined', {
    skip: function(req: any, res: any) {
        return res.statusCode < 400
    },
    stream: accessLogStream
}))

app.use('/', (req: any, res: any) => {
    res.send('hello, world!')
})

/** for test lodash */
// let words = [{test: 'sky'}, 'wood', 'forest', 'falcon', 'pear', 'ocean', 'universe'];
// let nums = [1, 3, 4, 5, 6, 7, 8, 9];
// let nums2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// let wordMap = ["sky", "Sun", "blue_island"];

// let furstel = _.first(words); //fist index in array
// let lastel = _.last(words); //last index in array
// let chunk1 = _.chunk(nums, 2); // set array 2 position
// let chunk2 = _.chunk(nums, 3); // set array 3 position
// let slice11 = _.slice(nums2, 2, 6); // limit index array to use
// let slice22 = _.slice(nums2, 0, 8); // limit index array to use
// let word = _.sample(words); // random return data in array
// let arr_shuffle = _.shuffle(words) // random data in array
// let wordCamelCase = _.map(wordMap, _.camelCase); // camelCase is "aaaaaAaaaa"


// let [numsUnder3, numsUpfrom3] = _.partition(nums2, (e: any) => e < 3)   // if condition is true will return array to first
//                                                                         // array else return data to second array 
// let sum = _.reduce(nums, (total: any, next: any) => {
//     return total + next
// })

// let r = _.random(10);

// app.use('/test', (req: any, res: any) => {
    // console.log(sum)
    // console.log(r);
    // console.log(chunk1);
    // console.log(chunk2);
    // console.log(slice11);
    // console.log(slice22);
    // console.log(furstel);
    // console.log(`Last element: ${lastel}`);
    // console.log(word);
    // console.log(arr_shuffle);
    // console.log(numsUnder3)
    // console.log(numsUpfrom3)
    // res.send('ok')
// })

/** test lodash */

// /* Middleware */
app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*' )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

// router
app.use('/api/', webRouter)
app.use(chatRouter)

/* Socket Start */
const server = app.listen(socketPort)
const io = SIO.init(server)

app.listen(serverPort)