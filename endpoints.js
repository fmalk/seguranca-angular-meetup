var validator = require('validator'),
    jwt = require('jsonwebtoken');

exports.status = function(req, res) {
    res.sendStatus(200);
};

// ficará na memória
var tarefas_count = 4;
var tarefas = [
    {id: 1, nome: 'Rever apresentação', autor: 'Meetup'},
    {id: 2, nome: 'Subir códigos no Github', autor: 'Meetup'},
    {id: 3, nome: 'Preparar local ', autor: 'Meetup'},
    {id: 4, nome: 'Apresentar slides', autor: 'Meetup'}
];

exports.listaTarefas = function(req, res) {
    res.status(200).json(tarefas);
};

exports.criaTarefa = function(req, res) {
    var input = validaInputTarefa(req.body);
    if (input) {
        tarefas_count++;
        input.id = tarefas_count;
        input.autor = 'Inseguro';
        tarefas.push(input);
        res.status(200).json(input);
    } else {
        res.sendStatus(400);
    }
};

function validaInputTarefa(input) {
    var sanitizado = {};
    if (!input)
        return false;

    if (input.nome) {
        var nome = validator.trim(input.nome);
        sanitizado.nome = input.nome;
    }
    if (!sanitizado.nome || sanitizado.nome == '')
        return false;
    else
        return sanitizado;
}

exports.buscaFormulario = function(req, res) {
    res.render('formulario', { csrfToken: req.csrfToken() });
};

exports.login = function(req, res) {
    var usuario = req.body.usuario;
    var senha = req.body.senha;

    // vamos usar um usuário hardcoded, mas aqui é responsabilidade
    // do servidor checar as credenciais
    if (usuario == 'Fernando' && senha == '1234') {
        var logged = {
            autor: 'Fernando'
        };
        // o segredo, no caso, pode rotacionar com o tempo,
        // mas é preciso garantir que tokens antigos podem validar o segredo antigo,
        // ou serão automaticamente descartados
        var token = jwt.sign(logged, 'segredomuitosecreto');
        res.status(200).json({ token: token });
    } else {
        res.sendStatus(403);
    };
};

exports.listaSeguraTarefas = function(req, res) {
    var token = req.header('Authorization');
    if (!token) {
        res.sendStatus(403);
    } else {
        jwt.verify(token, 'segredomuitosecreto', function(err, usuario) {
            if (err)
                res.sendStatus(403);
            else
                res.status(200).json(tarefas);
        });
    }
};

exports.criaSeguraTarefa = function(req, res) {
    var input = validaInputTarefa(req.body);
    var token = req.header('Authorization');
    if (!token || !input) {
        res.sendStatus(400);
    } else {
        jwt.verify(token, 'segredomuitosecreto', function(err, usuario) {
            if (err)
                res.sendStatus(403);
            else {
                tarefas_count++;
                input.id = tarefas_count;
                input.autor = usuario.autor;
                tarefas.push(input);
                res.status(200).json(input);
            }
        });
    }
};