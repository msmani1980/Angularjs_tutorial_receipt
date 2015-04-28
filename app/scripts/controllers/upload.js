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
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.log = '';

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/images',
                    file: file
                });
            }
        }
    };  
}]);
