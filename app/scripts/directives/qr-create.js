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
            $scope.qrCreateUploadProgress = 0;
            $scope.qrCreateUploadSuccess = false;
            $scope.qrCreateUploadFail = false;
        };

        // Function to convert dataURI into a Blob
        // After we pull the qrcode png out of the canvas, we need to pass it as a file/blob into the uploader.
        // based off of http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
        function dataURItoBlob(dataURI) {

            var byteString,
                mimestring;

            if(dataURI.split(',')[0].indexOf('base64') !== -1) {
                byteString = atob(dataURI.split(',')[1]);
            } else {
                byteString = decodeURI(dataURI.split(',')[1]);
            }

            mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

            var content = [];
            for (var i = 0; i < byteString.length; i++) {
                content[i] = byteString.charCodeAt(i);
            }

            return new Blob([new Uint8Array(content)], {type: mimestring});
        }

        // upload qr image function
        $scope.qrCreate = function () {

            // selector for qr-code canvas
            var canvas = angular.element('.qr-code canvas')[0];

            // convert canvas into img/png
            var imageData = canvas.toDataURL('image/png');

            // Use function dataURItoBlob, pass imageData
            var imageBlob = dataURItoBlob(imageData);

            // Set blob name, esentially the file name
            imageBlob.name = $scope.formData.qrCodeValue + '.png';

            // pass the image blob object into files
            var files = [imageBlob];

            //if a file exists and it is not null
            if (files && files.length) {

                // Upload image
                Upload.upload({
                    url: ENV.apiUrl + '/api/images',
                    fileFormDataName: 'image',
                    file: files[0]
                }).progress(function (evt) {

                    // Upload Progress
                    $scope.qrCreateUploadProgress = parseInt(100.0 * evt.loaded / evt.total);

                // on a successful upload
                }).success(function (data) {

                    // set the UI flag
                    $scope.qrCreateUploadSuccess = true;

                    // pass new image object into formData.qrCodeValue array
                    $scope.formData.qrCodeImgUrl = data.url;

                    $scope.clearQrCodes();

                // on a failed upload
                }).error(function () {
                    //set the UI flag
                    $scope.qrCreateUploadFail = true;

                    // TODO: Interpret this failure and tell the user
                    //console.log(data);

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
      scope: true,
      controller: qrCreateController

    };

  });
