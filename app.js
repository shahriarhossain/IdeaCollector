const express = require('express');

const port = 5000;

const app = express();

//Index page
app.get('/', (req, res)=>{
    res.send("Hello Index");
})

//About page
app.get('/', (req, res)=>{
    res.send("Hello About");
})

app.listen(port, ()=>{
    console.log(`Starting server.... Listening to port ${port}`);
})