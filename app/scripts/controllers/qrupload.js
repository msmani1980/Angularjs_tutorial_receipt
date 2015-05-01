'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:QruploadCtrl
 * @description
 * # QruploadCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('QruploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {

   	$scope.$watch('qrcodes', function (qrcodes) {
       $scope.qrcodes = qrcodes;
   });

    $scope.log = '';
    $scope.progress = [ ];

    $scope.upload = function () {

    	var qrcodes = $scope.qrcodes;

        if (qrcodes && qrcodes.length) {
            
            Upload.upload({
                url: 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/images',
                fileFormDataName: 'image',
                file: qrcodes
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
