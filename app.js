const express = require('express');
const exphbs  = require('express-handlebars');
const routes = require('./routes/api');
const bodyParser = require('body-parser');

const port = 5000;

//setup our express app
const app = express();

//handlebars configuration
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//parse data from a request as JSON
app.use(bodyParser.json());

//use the route
app.use(routes);
//app.use('/api', routes); 

app.listen(port, ()=>{
    console.log(`Starting server.... Listening to port ${port}`);
})