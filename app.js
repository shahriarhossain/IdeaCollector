const express = require('express');
const exphbs  = require('express-handlebars');

const port = 5000;

const app = express();

//handlebars configuration
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');


//Index page
app.get('/', (req, res)=>{
    res.render("Index");
})

//About page
app.get('/About', (req, res)=>{
    res.render("About");
})

app.listen(port, ()=>{
    console.log(`Starting server.... Listening to port ${port}`);
})