'use strict';

angular.module('waterbaseApp')
  .controller('ManagerCtrl', function ($scope, $routeParams) {
    $scope.dbName = $routeParams.database;

    $scope.collection = 'Users';

    $scope.collectionData = [
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
    ];

    $scope.collectionKeys = Object.keys($scope.collectionData[0]);
  });