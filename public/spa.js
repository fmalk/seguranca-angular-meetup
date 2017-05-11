'use strict';

var spa = angular.module('spa', ['ngRoute', 'ngSanitize', 'LocalForageModule']);

spa.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'Home'
        })
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'Home'
        })
        .when('/formulario', {
            templateUrl: '/rest/formulario'
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

spa.service('Rest', ['$http', function($http) {
    return {
        listaTarefas: function() {
            return $http.get('https://seguranca-angular.herokuapp.com/rest/tarefas');
        }
    }
}]);