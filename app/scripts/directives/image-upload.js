'use strict';
/*jshint maxcomplexity:9 */
/**
 * @ngdoc directive
 * @name ts5App.directive:imageUpload
 * @description Image upload directive for TS5 retail items
 * # imageUpload
 */
angular.module('ts5App')
  .directive('imageUpload', function () {

    var imageUploadController = function ($scope, Upload, ENV, $http, $q, messageService) {
      $scope.imageSize  = '';
      $scope.imageTypeText = '';
      $scope.fileFormat = 'jpg,.png,.gif';
      $scope.isRequired = 'false';

      $scope.$watch('files', function (files) {
        for (var fileKey in files) {
          var file = files[fileKey];
          file.uploadProgress = 0;
        }

        $scope.files = files;
      });

      // Fix bug where file was not re-validated after imageName was changed
      $scope.$watch('imageName', function (newImageName, oldImageName) {
        // For retail company, clear rejected files if image name is changed
        if ($scope.formData.companyTypeId === '1' && newImageName !== oldImageName && $scope.rejFiles) {
          $scope.rejFiles = [];
        }
      });

      $scope.clearAllFiles = function () {
        for (var filesIndex in $scope.files) {
          $scope.clearFile(filesIndex);
        }
      };

      $scope.clearFile = function (filesIndex) {
        $scope.files.splice(filesIndex, 1);
      };

      $scope.addImage = function (fileIndex, data, imageType) {
        var tempImageURL;
        if (imageType === 'cornerLogo' || imageType === 'homeLogo') {
          tempImageURL = data.url + '?decache=' + Math.random();
        } else {
          tempImageURL = data.url;
        }

        var newImage = {
          imageURL: tempImageURL,
          startDate: $scope.formData.startDate,
          endDate: $scope.formData.endDate
        };

        if (imageType === 'homeLogo') {
          newImage.imageName = 'homeLogo';

          // Mykola's way to avoid effective dates conflict for images (keeping as is for now)
          newImage.startDate = '1/1/2016';
          newImage.endDate = '1/1/2016';
        }

        if (imageType === 'cornerLogo') {
          newImage.imageName = 'cornerLogo';
        }

        $scope.formData.images.push(newImage);
      };

      $scope.uploadFile = function (fileIndex, imageType) {
        var file = $scope.files[fileIndex];
        return Upload.upload({
          url: ENV.apiUrl + '/rsvr-image/api/images',
          fileFormDataName: 'image',
          file: file
        }).progress(function (evt) {
          file.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function (data) {
          $scope.addImage(fileIndex, data, imageType);
        }).error(function () {
          file.uploadFail = true;

          // TODO: Interpret this failure and tell the user
        });
      };

      $scope.upload = function (imageType, companyCode) {
        var imageTypeHeader = $scope.headerType;
        if (imageType === 'receiptImage') {
          imageTypeHeader = 'virtual';
        }

        $http.defaults.headers.common.type = imageTypeHeader;
        if (companyCode === undefined && imageType !== 'itemImage') {
          messageService.display('warning', 'Please provide required Company Information', 'Image upload');
        }  else if ($scope.formData.images.length >= 2) {
          messageService.display('warning', 'Maximum allowed image upload limit reached', 'Image upload');
          $scope.clearAllFiles();
        } else {
          $http.defaults.headers.common.companyCode = companyCode;
          var fileUploadPromises = [];
          $scope.filesToClear = [];
          var files = $scope.files;

          if (files && files.length) {
            for (var filesIndex in files) {
              fileUploadPromises.push($scope.uploadFile(filesIndex, imageType));
            }

            $q.all(fileUploadPromises).then(function (results) {
              var reversedResults = results.reverse();
              for (var key in reversedResults) {
                var result = reversedResults[key];
                if (result.status === 201) {
                   // TODO: edit ne radi, ne napuni se isFileUploaded, zabranit special chars
                  $scope.files.pop();
                }
              }
            });
          }
        }

      };

    };

    return {
      templateUrl: '/views/directives/image-upload.html',
      restrict: 'EA',
      scope: {
        imageType: '@',
        imageSize: '@',
        imageTypeText: '@',
        fileFormat: '@',
        formData: '=formDataBind',
        imageName: '@',
        imageNameMessage: '@',
        itemMaxSize: '@',
        editingCompany: '='
      },
      link: function(scope) {

        if (scope.imageType === 'homeLogo') {
          scope.imageSize  = '900 x 600';
          scope.imageTypeText = 'ePOS home screen logo.';
          scope.fileFormat = 'png';
          scope.imageNameMessage = 'Accepted image name: ';
          scope.itemMaxSize = '';
          scope.headerType = 'companyImage';
          scope.imgHeight = 600;
          scope.imgWidth = 900;
        }

        if (scope.imageType === 'cornerLogo') {
          scope.imageSize  = '92 x 33';
          scope.imageTypeText = 'ePOS brand corner logo.';
          scope.fileFormat = 'png';
          scope.imageNameMessage = 'Accepted image name: ';
          scope.itemMaxSize = '';
          scope.headerType = 'companyImage';
          scope.imgHeight = 33;
          scope.imgWidth = 92;
        }

        if (scope.imageType === 'receiptImage') {
          scope.imageSize  = '380 x 1000';
          scope.imageTypeText = 'Receipt image.';
          scope.fileFormat = 'bmp';
          scope.imageName = '*';
          scope.imageNameMessage = '';
          scope.itemMaxSize = '';
          scope.headerType = 'companyImage';
          scope.imgHeight = 1000;
          scope.imgWidth = 380;
        }

        if (scope.imageType === 'itemImage') {
          scope.imageSize  = '128 x 128';
          scope.imageTypeText = 'Item image.';
          scope.imageName = '*';
          scope.imageNameMessage = '';
          scope.itemMaxSize = '10kb';
          scope.headerType = 'item';
          scope.imgHeight = 128;
          scope.imgWidth = 128;
        }
      },

      controller: imageUploadController
    };
  });
