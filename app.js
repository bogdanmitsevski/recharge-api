require('dotenv').config();
const express = require('express');
const port    = process.env.PORT || 3572;
const app     = express();
app.use(express.json());
const root = require('./routes/orderRouter');

const start = async () => {
    try {
        app.use('/', root);
        app.listen(port, ()=>{
            console.log(`Server is working on PORT: ${port}`);
        })
    }
    catch(e) {
        console.log(e);
    }
};

start();