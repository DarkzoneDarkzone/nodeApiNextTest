import express, {  Application } from 'express'
import { socketPort, serverPort } from './util/config'
import { webRouter } from './routes/webRouter'

/* test socket */
import { createServer } from "http";
import { Server,Socket } from "socket.io";
import path from 'path';

const app: Application = express()
app.use(express.static(path.join(__dirname, '../../dist/public/')));

/*  -------- converting json -------- */  
app.use(express.urlencoded({extended: true})); 
app.use(express.json())

/* Middleware */
app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*' );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, RefreshToken');
    next();
});

// router
app.use('/api/', webRouter)

app.listen(serverPort)