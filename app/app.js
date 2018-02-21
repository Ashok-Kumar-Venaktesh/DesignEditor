'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/view2'});
}]).
service('db_operation', function($http) {
  this.get_all_rows = function(baseURI){
    return $http({
         method : "GET",
         url : baseURI + '/get_all_rows'
     })
    }

  this.update = function(baseURI, body){
    return $http({
         method : "POST",
         url    : baseURI + '/update',
         data   : body
     })
    }

  this.insert = function(baseURI, body){
    return $http({
         method : "POST",
         url    : baseURI + '/insert',
         data   : body
     })
    }

  this.load = function(baseURI, project_name){
    return $http({
         method : "GET",
         url    : baseURI + '/get_canvas_data/' + project_name
     })
    }

  this.delete = function(baseURI, project_name){
    return $http({
         method : "GET",
         url    : baseURI + '/delete/' + project_name
     })
    }
}).
directive('ngCanvas', function(db_operation){
    return {
        restrict: 'EA',
        scope: false,
        template: '<canvas id="canvas" width="1200px" height="600px"></canvas>',
        controller: function ($scope, $timeout, db_operation) {
          // to test in the heroku app
          $scope.baseURI = 'https://sleepy-hamlet-79903.herokuapp.com';
          // to test in the localhost MySql
          //$scope.baseURI = 'http://localhost:5000';
          $scope.history = [];

          $scope.get_options = function(){
            db_operation.get_all_rows($scope.baseURI).
              then(function mySuccess(response) {
                 var data = response.data;
                 for(let i=0; i<data.length; i++){
                   var obj = {}
                   obj['value'] = data[i].ProjectName;
                   obj['label'] = data[i].ProjectName;
                   $scope.all_projects.push(obj);
                 }
              }, function myError(response) {
                console.log(response);
              });
          }

          $scope.get_options();

          $scope.sendSelectedObjectBack = function() {
            $scope.canvas.sendToBack($scope.canvas.getActiveObject());
            $scope.canvas.renderAll();
          }

          $scope.throwError = function(message){
            $scope.canvas.clear();
            $scope.canvas.renderAll();
            $scope.canvas.add(new fabric.Text(message, {
                left: 20,
                top: 20,
                fill: 'red'
            }))
            $scope.canvas.renderAll();
          }

          $scope.display_message = function(message){
            $scope.message = message;
            $scope.isDisplay = true;
            $timeout(function () {
              $scope.isDisplay = false;
            }, 2000);
          }

          $scope.create = function() {
            if ($scope.project_name != undefined){
              // Make the edit project buttons visible
              $scope.project_loaded  = true;
              var body = {
                "project_name": $scope.project_name,
                "canvas_data": JSON.stringify($scope.canvas)
              }
              db_operation.insert($scope.baseURI, body).
                then(function mySuccess(response) {
                  $scope.canvas.clear();
                  $scope.display_message('Create project successfully');
                  console.log("insert response --> ", response);
                }, function myError(response) {
                  console.log(response);
                  $scope.display_message('Creating project Failed!! \n Reason: ' + response.statusText);
                });
            }
            else if ($scope.project_name == undefined){
              // hide the "Edit Project" buttons
              $scope.project_loaded = false;
              $scope.throwError('Please enter the project name');
            }
          }

          $scope.save = function(){
            if ($scope.selected_project != undefined || $scope.project_name != undefined){
              $scope.display_message('Saving your project. Please wait ....');
              var body = {
                "project_name": ($scope.selected_project != undefined)?$scope.selected_project:$scope.project_name,
                "canvas_data": JSON.stringify($scope.canvas)
              }
              db_operation.update($scope.baseURI, body).
                then(function mySuccess(response) {
                  $scope.display_message('Saved project successfully');
                }, function myError(response) {
                    $scope.display_message('Save Failed!! \n Reason: ' + response.statusText );
                });
            }
            else if($scope.selected_project == undefined &&  $scope.project_name == undefined) {
                $scope.throwError('Create new or load existing project');
            }
          }

          $scope.delete = function(){
            if ($scope.selected_project != undefined){
              db_operation.delete($scope.baseURI, $scope.selected_project).
                then(function mySuccess(response) {
                  $scope.canvas.clear();
                  $scope.project_name = '';
                  $scope.display_message('Deleted project successfully');
                  $scope.all_projects = [];
                  $scope.get_options();
                  $scope.canvas.add(
                    new fabric.IText('Upload image and start designing', {
                        left: 50,
                        top: 100,
                        fontFamily: 'helvetica neue',
                        fill: 'green',
                        stroke: '#F0F0F0',
                        strokeWidth: 1,
                        fontSize: 45
                    })
                  );
                  $scope.renderAll();
                }, function myError(response) {
                  $scope.display_message('Unable to delte Failed!! \n Reason: ' + response.statusText);
                });
            }
            else if($scope.selected_project == undefined) {
                $scope.throwError('Create new or load existing project');
            }
          }

          $scope.remove_object = function(){
            if ($scope.project_name != undefined){
              $scope.canvas.getActiveObject().remove();
              $scope.canvas.renderAll();
            }
            else if($scope.selected_project == undefined) {
                $scope.throwError('Create new or load existing project');
            }
          }

          $scope.upload = function(){
            $scope.display_message('Uploading your project.  Please wait ...');
            if ($scope.selected_project != undefined || $scope.project_name != undefined){
              fabric.Image.fromURL($scope.imageSrc, function(img) {
                 var oImg = img.set({
                    left: 0,
                    top: 0,
                    angle: 0,
                    stroke: '#F0F0F0',
                    strokeWidth: 40
                 }).scale(0.2);
                 $scope.canvas.add(oImg).renderAll();
                 var dataURL = $scope.canvas.toDataURL({
                    format: 'png',
                    quality: 1
                 });
              });
            }
            else if($scope.selected_project == undefined && $scope.project_name == undefined) {
                $scope.throwError('Create new or load existing project');
            }
          }

          $scope.load = function(){
            if ($scope.selected_project != undefined){
              $scope.project_loaded = true;
              $scope.display_message('Loading your project.  Please wait ...');
              $scope.project_name   = $scope.selected_project;
              db_operation.load($scope.baseURI, $scope.selected_project).
                then(function mySuccess(response) {
                  if($scope.selected_project != undefined){
                    $scope.canvas.clear();
                    $scope.canvas.loadFromJSON(response.data[0]["CanvasData"], function(o, object) {
                      $scope.display_message('Loaded project successfully');
                      $scope.canvas.renderAll();
                    });
                  }
                }, function myError(response) {
                    $scope.display_message('Loading project Failed!! \n Reason: ' + response.statusText);
                });
            }
            else if($scope.selected_project == undefined) {
              $scope.project_loaded = false;
              $scope.throwError('Select the existing project');
            }
          }

          $scope.undo = function(){
            if ($scope.selected_project != undefined || $scope.project_name != undefined){
              if(!$scope.isRedoing){
                 $scope.h = [];
                 if($scope.canvas._objects.length>0){
                    $scope.history.push($scope.canvas._objects.pop());
                    $scope.canvas.renderAll();
                 }
              }
              $scope.isRedoing = false;
            }
            else if($scope.project_name == undefined && $scope.selected_project == undefined) {
                $scope.throwError('Select the existing project');
            }
          }

          $scope.redo = function(){
            if ($scope.project_name != undefined || $scope.selected_project != undefined){
              if($scope.history.length>0){
                $scope.isRedoing = true;
                $scope.canvas.add($scope.history.pop());
              }
            }
            else if($scope.project_name == undefined && $scope.selected_project == undefined) {
                $scope.throwError('Select the existing project');
            }
          }

          $scope.sendSelectedObjectToFront = function() {
            if ($scope.selected_project != undefined){
              $scope.canvas.bringToFront($scope.canvas.getActiveObject());
              $scope.canvas.renderAll();
            }
            else if($scope.selected_project == undefined) {
                $scope.throwError('Select the existing project');
            }
          }

          $scope.$on('backward', function (event, data) {
            $scope.sendSelectedObjectBack();
          });

          $scope.$on('save', function (event, data) {
            $scope.save();
          });

          $scope.$on('delete', function (event, data) {
            $scope.delete();
          });

          $scope.$on('remove_object', function (event, data) {
            $scope.remove_object();
          });

          $scope.$on('load', function (event, data) {
            $scope.load();
          });

          $scope.$on('upload', function (event, data) {
            $scope.upload();
          });

          $scope.$on('forward', function (event, data) {
            $scope.sendSelectedObjectToFront();
          });

          $scope.$on('undo', function (event, data) {
            $scope.undo();
          });

          $scope.$on('redo', function (event, data) {
            $scope.redo();
          });

          $scope.$on('create', function (event, data) {
            $scope.create();
          });

          $scope.$on('add', function (event, data) {
            if ($scope.selected_project != undefined || $scope.project_name){
              var tmp = $scope.canvas.getObjects();
              $scope.canvas.add(
                new fabric.IText('Enter Text', {
                    left: 50,
                    top: 100,
                    fontFamily: 'helvetica neue',
                    fill: '#333',
                    stroke: '#F0F0F0',
                    strokeWidth: 1,
                    fontSize: 45
                })
              );
            }
            else if($scope.selected_project == undefined && $scope.project_name == undefined) {
                $scope.throwError('Select the existing project');
            }
          });
        },
        link: function (scope, element, attrs) {
            scope.canvas = new fabric.Canvas('canvas');
            scope.canvas.add(
              new fabric.IText('Upload image and start designing', {
                  left: 50,
                  top: 100,
                  fontFamily: 'helvetica neue',
                  fill: 'green',
                  stroke: '#F0F0F0',
                  strokeWidth: 1,
                  fontSize: 45
              })
            );
        }
    }
})
