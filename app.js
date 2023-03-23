require('dotenv').config();
const db      = require('./models/index');
const express = require('express');
const port    = process.env.PORT || 3572;
const app     = express();
app.use(express.json());
const root = require('./routes/indexRouter');

const start = async () => {
    try {
        await db.sequelize.authenticate();
        await db.sequelize.sync();
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