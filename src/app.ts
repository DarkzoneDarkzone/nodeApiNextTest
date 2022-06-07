import express, {  Application } from 'express'
import { serverPort } from './util/config'
import { webRouter } from './routes/webRouter'

const app: Application = express()
/*  -------- converting json -------- */  
app.use(express.urlencoded({extended: true})); 
app.use(express.json())
/* Middleware */
app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*' );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// router
app.use('/api/', webRouter)

app.listen(serverPort)