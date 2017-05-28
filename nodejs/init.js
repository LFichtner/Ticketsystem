// load local configuration from ./nodejs/node_moduls/local.conf.json
var localConfiguration = require('local.conf.json');

// web framework for http-request
var express = require('express'), app = express();

// the mongodb native drivers
var mongodb = require('mongodb');

// This is a node.js middleware for handling JSON, Raw, Text and URL encoded form data.
var bodyParser = require('body-parser');

// jQuery module
var $ = require('jquery');

// backend-controller
var Controller = require('backend/Controller.js');
var MyController = new Controller(mongodb);

//console.log(Controller);
//console.log(MyController instanceof Controller);
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    console.log('\\\\ entering Preflight-handler ////');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        console.log('callback from preflight');
      res.sendStatus(200);
    }
    else {
      next();
    }
};
// configure Express
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));
//  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));



// a page to proof 
app.get('/', function (req, res) {
    res.send('Nodejs says: Welcome to Taskmanager IHK-Project');
});

// init script for testing backend (is called from backend/tests/backendTestroutine) (have to change hard coded DB_Name in DBAccess before calling)
var TestInitialisation = require('backend/tests/initTestprotokoll');
    var MyTestInitialisation = new TestInitialisation(mongodb);
app.post('/initProjektTesting', function (request, response) {

    console.log('recieved initProjektTesting');/*, request, response*/
    MyTestInitialisation.initDB(request.body, response);
});

app.post('/updateSession', function (request, response) {
    console.log('recieved update Session');/*, request, response*/
    MyController.access(request.body, response, 'session');
});

app.post('/userManager', function (request, response) {
    console.log('recieved access userManager');
    MyController.access(request.body, response, 'user');
});

app.post('/ticketManager', function (request, response) {
    console.log('recieved access ticketManager');
    MyController.access(request.body, response, 'ticket');
});

app.post('/projektManager', function (request, response) {
    console.log('recieved access projektManager');
    MyController.access(request.body, response, 'projekt');
});

app.post('/filterManager', function (request, response) {
    console.log('recieved access filterManager');
    MyController.access(request.body, response, 'filter');
});

// setup server, ip:port
var server = app.listen(localConfiguration.nodejsPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Example app listening at http://%s:%s', host, port);
});

// http://127.0.0.1:3000