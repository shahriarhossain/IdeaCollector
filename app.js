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


/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

//parse data from a request as JSON
app.use(bodyParser.json());

//use the route
app.use(routes);
//app.use('/api', routes); 

app.listen(port, ()=>{
    console.log(`Starting server.... Listening to port ${port}`);
})