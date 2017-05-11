'use strict';

var spa = angular.module('spa', ['ngRoute', 'ngSanitize', 'LocalForageModule']);

spa.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'Home'
        })
        .when('/ajax', {
            templateUrl: 'views/ajax.html',
            controller: 'Ajax'
        })
        .when('/formulario', {
            templateUrl: '/rest/formulario'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'Login'
        })
        .when('/listasegura', {
            templateUrl: 'views/home.html',
            controller: 'ListaSegura'
        })
        .when('/envioseguro', {
            templateUrl: 'views/ajax.html',
            controller: 'EnvioSeguro'
        });
}]);

spa.controller('Home', ['$scope','Rest', function($scope, Rest) {
    Rest.listaTarefas()
        .then(function(lista) {
            $scope.lista = lista.data;
        })
        .catch(function() {
            $scope.erro = 'Não foi possível listar'
        });
}]);

spa.controller('Ajax', ['$scope','$location', 'Rest', function($scope, $location, Rest) {
    $scope.envia = function() {
        Rest.enviaTarefa($scope.nome)
            .then(function() {
                $location.path('/');
            });
    }
}]);

spa.controller('Login', ['$scope','$location', '$localForage', 'Rest', function($scope, $location, $localForage, Rest) {
    $scope.envia = function() {
        var login = {
            usuario: $scope.usuario,
            senha: $scope.senha
        };
        Rest.login(login)
            .then(function(resposta) {
                $localForage.setItem('token', resposta.data.token )
                    .then(function() {
                        $location.path('/');
                    })
            });
    }
}]);

spa.controller('ListaSegura', ['$scope','Rest', function($scope, Rest) {
    Rest.listaSeguraTarefas()
        .then(function(lista) {
            $scope.lista = lista.data;
        })
        .catch(function(erro) {
            $scope.erro = erro;
        });
}]);

spa.controller('EnvioSeguro', ['$scope','$location', '$localForage', 'Rest', function($scope, $location, $localForage, Rest) {
    $scope.envia = function() {
        Rest.enviaSeguraTarefa($scope.nome)
            .then(function() {
                $location.path('/listasegura');
            });
    }
}]);

spa.service('Rest', ['$http', '$q', '$localForage', function($http, $q, $localForage) {
    return {
        listaTarefas: function() {
            return $http.get('/rest/tarefas');
        },
        enviaTarefa: function(nome) {
            return $http.post('/rest/tarefas', { nome: nome });
        },
        login: function(cred) {
            return $http.post('/seguro/login', cred);
        },
        listaSeguraTarefas: function() {
            return $localForage
                .getItem('token')
                .then(function(token) {
                    if (!token)
                        return $q.reject('sem token');
                    else
                        return token;
                })
                .then(function(token) {
                    var req = {
                        method: 'GET',
                        url: '/seguro/tarefas',
                        headers: {
                            Authorization: token
                        }
                    };
                    return $http(req);
                });
        },
        enviaSeguraTarefa: function(nome) {
            return $localForage
                .getItem('token')
                .then(function(token) {
                    if (!token)
                        return $q.reject('sem token');
                    else
                        return token;
                })
                .then(function(token) {
                    var req = {
                        method: 'POST',
                        url: '/seguro/tarefas',
                        headers: {
                            Authorization: token
                        },
                        data: {
                            nome: nome
                        }
                    };
                    return $http(req);
                });
        }
    }
}]);