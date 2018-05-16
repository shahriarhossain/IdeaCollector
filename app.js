const express = require('express');
const exphbs  = require('express-handlebars');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const expressRequestId = require('express-request-id');

const port = process.env.port || 5000; //you can set environment port from terminal. Type : export PORT =3000

//setup our express app
const app = express();

//setup express request id
const addRequestId = expressRequestId();

//Generate UUID for request and add it to X-Request-Id
app.use(addRequestId);

//Http request logger
morgan.token('id', function getId(req) {
    return req.id //capture request id
});

var loggerFormat = ':id :method :url :status :res[content-length] - :response-time ms'; //specify what we want to log

app.use(morgan(loggerFormat, {
    skip: function (req, res) { return res.statusCode < 400 },  //log only 4xx and 5xx responses
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})   //here flags:'a' stands for append
  }));

//handlebars configuration
//extname configuratin only applies on layout and partials. 
app.engine('handlebars', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'handlebars');

//if you do want to change the extension of regular view check https://github.com/ericf/express-handlebars/issues/188
//Following configuration will look regular file with the extension XXX
// app.engine('XXX', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
// app.set('view engine', 'XXX');


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