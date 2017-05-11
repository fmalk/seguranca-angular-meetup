var express            = require('express'),
	bodyparser         = require('body-parser'),
	http               = require('http'),
	path               = require('path'),
	passport           = require('passport');

var app = express();

// create application/json parser
var jsonparser = bodyparser.json();

// create application/x-www-form-urlencoded parser
var urlencodedparser = bodyparser.urlencoded({
	extended: false,
	parameterLimit: 20
});

// ======== MIDDLEWARES ===========

app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));//, { maxAge: oneDay })));
app.use(passport.initialize());
app.use(app.router);

// Permite CORS
app.all('*', function(req,res,next) {

	// possível bug: Access-Control-Allow-Headers precisa aceitar o que vier, e não há wildcard.
	// Access-control-request-headers é o padrão para indicar o que está sendo transmitido, mas não há garantia que ele realmente aparece
	var allowed = req.get('access-control-request-headers');
	if (!allowed) {
		/*
		// vamos procurar os headers no request e retornar todos
		var headers = Object.keys(req.headers);
		if (headers.length > 0) {
			allowed = Object.keys(req.headers).reduce(function(prev, cur) {
				return prev+', '+cur;
			}, 'authorization, content-type'); // estes dois podem não estar listados e são importantes
		} else {

		 por enquanto o padrão deve resolver */
			allowed = 'Origin, X-Requested-With, Content-Type, Content-Length, Accept, Authorization, ' +
				'User-Agent, Host, Accept-Encoding, Accept-Language, Connection, Referer, Cache-Control';
		//}
	}

	res.header('Access-Control-Allow-Origin', config.DOMAINS);
	res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,HEAD');
	res.header("Access-Control-Allow-Headers", allowed);
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});
app.options('*', function(req,res) {
	res.send(200);
});

// ======== ROTAS ===========

app.get('/api',                                          Status.status);
app.head('/api',                                         Status.status);

app.post('/login',                                       jsonparser, urlencodedparser, Autenticacao.autenticarWeb);
app.post('/erro',                                        jsonparser, urlencodedparser, registrarErro);


// ========== SERVER ===========

var server = http.createServer(app);
//io.listen(server);
server.listen(process.env.PORT || 80);

exports = server;