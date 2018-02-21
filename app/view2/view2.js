'use strict';

var app1 = angular.module('myApp.view2', ['ngRoute'])

app1.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

app1.controller('View2Ctrl',function($scope) {
  $scope.project_loaded  = false;
  $scope.message         = 'success';
  $scope.isDisplay       = false;

  document.getElementById('file').addEventListener("change", function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(f) {
      var data = f.target.result;
      $scope.imageSrc = data;
      $scope.$broadcast('upload');
    };
    reader.readAsDataURL(file);
  });

    $scope.$on("fileProgress", function(e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });

    $scope.all_projects =  [];
    $scope.up = function () {
        $scope.$broadcast('change');
    }
    $scope.add = function () {
        $scope.$broadcast('add');
    }
    $scope.redo = function(){
      $scope.$broadcast('redo');
    }
    $scope.undo = function(){
      $scope.$broadcast('undo');
    }
    $scope.save = function(){
      $scope.$broadcast('save');
    }
    $scope.load = function(){
      $scope.$broadcast('load');
    }
    $scope.upload = function(){
      $scope.$broadcast('upload');
    }
    $scope.delete = function(){
      $scope.$broadcast('delete');
    }
    $scope.remove_object = function(){
      $scope.$broadcast('remove_object');
    }
    $scope.forward = function(){
      $scope.$broadcast('forward');
    }
    $scope.backward = function(){
      $scope.$broadcast('backward');
    }
    $scope.create = function(){
      $scope.$broadcast('create');
    }
});
