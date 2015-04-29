'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('UploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {

   	$scope.$watch('files', function (files) {
       $scope.files = files;
   });

    $scope.log = '';
    $scope.progress = [ ];

    $scope.upload = function () {

    	var files = $scope.files;

        /*if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/images',
                    fileFormDataName: 'image',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.progress = progressPercentage;
                }).success(function () {
                    console.log( data + 'success');
                }).error(function () {
                	console.log( data + 'error');
                });
            }
        }*/

        if (files && files.length) {
            
            Upload.upload({
                url: 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/images',
                fileFormDataName: 'image',
                file: files
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress = progressPercentage;
            }).success(function () {
                //console.log( data + 'success');
            }).error(function () {
            	//console.log( data + 'error');
            });

        } else {

        	return false;
        }

    };
}]);