var express            = require('express'),
    jade               = require('jade'),
    cookieparser       = require('cookie-parser'),
    csrf               = require('csurf'),
	bodyparser         = require('body-parser'),
	http               = require('http'),
	path               = require('path'),
    cors               = require('cors'),
	passport           = require('passport'),
    Endpoints          = require('./endpoints.js');

var app = express();

// jade
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'public/views'));
app.locals.basedir = app.get('views');

// create application/json parser
var jsonparser = bodyparser.json();

// create application/x-www-form-urlencoded parser
var urlencodedparser = bodyparser.urlencoded({
	extended: false,
	parameterLimit: 20
});

// CSRF
var csrfprotection = csrf({ cookie: true });

// CORS
var whitelist = ['https://seguranca-angular.herokuapp.com', 'http://localhost:777'];
var corsOptions = {
    origin: function (origin, callback) {
        console.log(origin);
        // Se for vazio, o request está no mesmo domínio
        if (!origin) {
            callback(null, true);
        } else if(whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback('Erro CORS')
        }
    },
    preflightContinue: false,
    optionsSuccessStatus: 200
};

// ======== MIDDLEWARES ===========

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// ======== ROTAS ===========

// CORS apenas nesta rota
app.all('/rest/status',                                  cors(corsOptions), Endpoints.status);

// CORS para todas as rotas seguintes
app.all('/rest/*',                                       cors(corsOptions));
app.get('/rest/tarefas',                                 jsonparser, urlencodedparser, Endpoints.listaTarefas);
app.post('/rest/tarefas',                                jsonparser, urlencodedparser, Endpoints.criaTarefa);

app.get('/rest/formulario',                              cookieparser(), csrfprotection, Endpoints.buscaFormulario);
app.post('/rest/formulario',                             cookieparser(), urlencodedparser, csrfprotection, Endpoints.criaTarefa);


// ========== SERVER ===========

var server = http.createServer(app);
//io.listen(server);
server.listen(process.env.PORT || 777);
exports = server;