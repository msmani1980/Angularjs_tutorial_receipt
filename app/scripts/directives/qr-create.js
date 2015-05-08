'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:qrCreate
 * @description
 * # qrCreate
 */
angular.module('ts5App')
  .directive('qrCreate', function () {

  	var qrCreateController = function ($scope, Upload, baseUrl, $http) {

  		// set header param 'type' = item
        $http.defaults.headers.common.type = 'item';

        // progress
        $scope.qrUploadProgress = [];

        // watch for files
        $scope.$watch('files', function (files) {
           $scope.files = files;
        });

        // clear current qr codes
        $scope.clearQrCodes = function() {
            $scope.files = [];
            $scope.qrUploadProgress = 0; 
            $scope.qrUploadSuccess = false; 
            $scope.qrUploadFail = false;
            $scope.formData.qrCodeImgUrl = '';
        };

        // upload qr image function
        $scope.qrCreate = function () {

           var files = files;

            console.log(files);
            //if a file exists and it is not null
            if (files && files.length) {
                
                // Upload image
                Upload.upload({     
                    url: baseUrl + '/api/images',
                    fileFormDataName: 'image',
                    file: files[0] 
                }).progress(function (evt) {

                    // Upload Progress
                    $scope.qrUploadProgress = parseInt(100.0 * evt.loaded / evt.total);

                // on a successful upload
                }).success(function (data) {

                    // set the UI flag
                    $scope.qrUploadSuccess = true; 

                    // pass new image object into formData.qrCodeValue array
                    $scope.formData.qrCodeImgUrl = data.url;

                // on a failed upload
                }).error(function (data) {

                    //set the UI flag 
                    $scope.qrUploadFail = true;

                    console.log(data);

                });

            // no files found, exit function
            } else {
                return false;
            }

        };

    };

    return {

      templateUrl: 'views/directives/qr-create.html',
      restrict: 'E',
      scope: false,
      controller: qrCreateController

    };

  });
