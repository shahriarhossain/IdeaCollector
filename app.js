const express = require('express');
const exphbs  = require('express-handlebars');
const routes = require('./routes/api');

const port = 5000;

//setup our express app
const app = express();

//handlebars configuration
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//use the route
app.use(routes);
//app.use('/api', routes); 

app.listen(port, ()=>{
    console.log(`Starting server.... Listening to port ${port}`);
})