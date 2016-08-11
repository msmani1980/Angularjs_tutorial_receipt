'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:qrUpload
 * @description
 * # qrUpload
 */
angular.module('ts5App')
  .directive('qrUpload', function () {

    var qrUploadController = function ($scope, Upload, ENV, $http) {

      // set header param 'type' = item
      $http.defaults.headers.common.type = 'item';

      // progress
      $scope.qrUploadProgress = '0';

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
      };

      // upload qr image function
      $scope.qrUploader = function () {

        // grab files from scope
        var files = $scope.files;

        var qrImgElement = angular.element('.thumbs');
        var qrImgHeight = qrImgElement.height();
        var qrImgWidth = qrImgElement.width();

        if (qrImgHeight > 128 && qrImgWidth > 128) {

          $scope.clearQrCodes();
          $scope.qrTooLarge = true;
          $scope.imageDimensions = qrImgWidth + 'px' + ' x ' + qrImgHeight + 'px';
        }

        //if a file exists and it is not null
        else if (files && files.length) {

          $scope.qrTooLarge = false;

          // Upload image
          Upload.upload({
            url: ENV.apiUrl + '/rsvr-image/api/images',
            fileFormDataName: 'image',
            file: files
          }).progress(function (evt) {

            // Upload Progress
            $scope.qrUploadProgress = parseInt(100.0 * evt.loaded / evt.total);

        // on a successful upload
          }).success(function (data) {

            // set the UI flag
            $scope.qrUploadSuccess = true;

            // pass new image object into formData.qrCodeValue array
            $scope.formData.qrCodeImgUrl = data.url;

            $scope.clearQrCodes();

        // on a failed upload
          }).error(function () {

            //set the UI flag
            $scope.qrUploadFail = true;

            // TODO: Interpret this failure and tell the user

          });

      // no files found, exit function
        } else {
          return false;
        }

      };

    };

    return {

      templateUrl: 'views/directives/qr-upload.html',
      restrict: 'E',
      scope: false, //isolate scope to parent
      controller: qrUploadController

    };

  });
