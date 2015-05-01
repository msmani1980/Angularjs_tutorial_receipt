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

        if (files && files.length) {
            
            Upload.upload({
                url: 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/images',
                fileFormDataName: 'image',
                file: files
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress = progressPercentage;
                $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function () {
                console.log('success');
            }).error(function () {
            	console.log('error');
            });

        } else {

        	return false;
        }

    };
}]);