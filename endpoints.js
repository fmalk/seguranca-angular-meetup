var validator = require('validator');

exports.status = function(req, res) {
    res.sendStatus(200);
};

// ficará na memória
var tarefas_count = 4;
var tarefas = [
    {id: 1, nome: 'Rever apresentação'},
    {id: 2, nome: 'Subir códigos no Github'},
    {id: 3, nome: 'Preparar local '},
    {id: 4, nome: 'Apresentar slides'}
];

exports.listaTarefas = function(req, res) {
    res.status(200).json(tarefas);
};

exports.criaTarefa = function(req, res) {
    var input = validaInputTarefa(req.body);
    if (input) {
        tarefas_count++;
        input.id = tarefas_count;
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