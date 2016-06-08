'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:qrCreate
 * @description
 * # qrCreate
 */
angular.module('ts5App')
  .directive('qrCreate', function () {

    var qrCreateController = function ($scope, Upload, ENV, $http) {
      $http.defaults.headers.common.type = 'item';
      $scope.qrUploadProgress = [];
      $scope.$watch('files', function (files) {
        $scope.files = files;
      });

      $scope.clearQrCodes = function () {
        $scope.files = [];
        $scope.qrCreateUploadProgress = 0;
        $scope.qrCreateUploadSuccess = false;
        $scope.qrCreateUploadFail = false;
      };

      function dataURItoBlob(dataURI) {
        var byteString;
        var mimestring;

        if (dataURI.split(',')[0].indexOf('base64') !== -1) {
          byteString = atob(dataURI.split(',')[1]);
        } else {
          byteString = decodeURI(dataURI.split(',')[1]);
        }

        mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var content = [];
        for (var i = 0; i < byteString.length; i++) {
          content[i] = byteString.charCodeAt(i);
        }

        return new Blob([new Uint8Array(content)], { type: mimestring });
      }

      $scope.qrCreate = function () {
        var canvas = angular.element('.qr-code canvas')[0];
        var imageData = canvas.toDataURL('image/png');
        var imageBlob = dataURItoBlob(imageData);
        imageBlob.name = $scope.formData.qrCodeValue + '.png';
        var files = [imageBlob];
        if (files && files.length) {

          Upload.upload({
            url: ENV.apiUrl + '/rsvr/api/images',
            fileFormDataName: 'image',
            file: files[0]
          }).progress(function (evt) {
            $scope.qrCreateUploadProgress = parseInt(100.0 * evt.loaded / evt.total);
          }).success(function (data) {
            $scope.qrCreateUploadSuccess = true;
            $scope.formData.qrCodeImgUrl = data.url;
            $scope.clearQrCodes();
          }).error(function () {
            $scope.qrCreateUploadFail = true;
          });
        } else {
          return false;
        }
      };
    };

    return {
      templateUrl: 'views/directives/qr-create.html',
      restrict: 'E',
      scope: true,
      controller: qrCreateController
    };

  });
