'use strict';
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
      $scope.homeLogoCount = 0;
      $scope.cornerLogoCount = 0;
      $scope.receiptCount = 0;

      $scope.$watch('files', function (files) {
        for (var fileKey in files) {
          var file = files[fileKey];
          file.uploadProgress = 0;
        }

        $scope.files = files;
      });

      $scope.clearAllFiles = function () {
        for (var filesIndex in $scope.files) {
          $scope.clearFile(filesIndex);
        }
      };

      $scope.clearFile = function (filesIndex) {
        $scope.files.splice(filesIndex, 1);
      };

      $scope.addImage = function (fileIndex, data) {
        var newImage = {
          imageURL: data.url,
          startDate: $scope.formData.startDate,
          endDate: $scope.formData.endDate
        };
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
          $scope.addImage(fileIndex, data);
          if (imageType === 'homeLogo') {
            $scope.homeLogoCount++;
          } else if (imageType === 'cornerLogo') {
            $scope.cornerLogoCount++;
          } else if (imageType === 'receiptImage') {
            $scope.receiptCount++;
          }
        }).error(function () {
          file.uploadFail = true;

          // TODO: Interpret this failure and tell the user
        });
      };

      $scope.doesImageMeetSizeConstraint = function (filesIndex, imageType, imgElement) {
        var file = $scope.files[filesIndex];

        if (!imgElement) {
          imgElement = angular.element(angular.element('.fileTest')[filesIndex]);
        }

        this.imgHeight = imgElement.height();
        this.imgWidth = imgElement.width();
        var acceptImageHeight = 128;
        var acceptImageWidth = 128;

        if (imageType === 'homeLogo') {
          acceptImageHeight = 600;
          acceptImageWidth = 900;
        } else if (imageType === 'cornerLogo') {
          acceptImageHeight = 33;
          acceptImageWidth = 92;
        } else if (imageType === 'receiptImage') {
          acceptImageHeight = 1000;
          acceptImageWidth = 380;
        }

        $scope.imageSize  = acceptImageWidth + ' x ' + acceptImageHeight;

        if ($scope.imgHeight > acceptImageHeight || $scope.imgWidth > acceptImageWidth) {
          file.imageTooLarge = true;
          file.imageDimensions = this.imgWidth + 'px' + ' x ' + this.imgHeight +
            'px';
        } else {
          return true;
        }

      };

      $scope.upload = function (imageType, companyCode) {
        $http.defaults.headers.common.type = $scope.headerType;
        if (companyCode === undefined && imageType !== 'itemImage') {
          messageService.display('warning', 'Please provide required Company Information', 'Image upload');
        } else if (imageType === 'homeLogo' && $scope.homeLogoCount > 0) {
          messageService.display('warning', 'Cannot upload more than one image for home screen logo', 'Image upload');
        } else if (imageType === 'cornerLogo' && $scope.cornerLogoCount > 0) {
          messageService.display('warning', 'Cannot upload more than one image for top left corner logo', 'Image upload');
        } else if (imageType === 'receiptImage' && $scope.receiptCount > 1) {
          messageService.display('warning', 'Cannot upload more than two receipt images', 'Image upload');
        } else {
          $http.defaults.headers.common.companyCode = companyCode;
          var fileUploadPromises = [];
          $scope.filesToClear = [];
          var files = $scope.files;

          if (files && files.length) {
            for (var filesIndex in files) {
              if ($scope.doesImageMeetSizeConstraint(filesIndex, imageType)) {
                fileUploadPromises.push($scope.uploadFile(filesIndex, imageType));
              }
            }

            $q.all(fileUploadPromises).then(function (results) {
              var reversedResults = results.reverse();
              for (var key in reversedResults) {
                var result = reversedResults[key];
                if (result.status === 201) {
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
        invalidNameMessage: '@'
      },
      link: function(scope) {

        if (scope.imageType === 'homeLogo') {
          scope.imageSize  = '900 x 600';
          scope.imageTypeText = 'ePOS home screen logo.';
          scope.fileFormat = 'png';
          scope.imageName = 'logo_*';
          scope.imageNameMessage = 'Accepted image name: logo_COMPANYCODE';
          scope.itemMaxSize = '';
          scope.headerType = 'companyImage';
          scope.invalidNameMessage = ' has invalid name OR';
        }

        if (scope.imageType === 'cornerLogo') {
          scope.imageSize  = '92 x 33';
          scope.imageTypeText = 'ePOS brand corner logo.';
          scope.fileFormat = 'png';
          scope.imageName = 'brand_*';
          scope.imageNameMessage = 'Accepted image name: brand_COMPANYCODE';
          scope.itemMaxSize = '';
          scope.headerType = 'companyImage';
          scope.invalidNameMessage = ' has invalid name OR';
        }

        if (scope.imageType === 'receiptImage') {
          scope.imageSize  = '380 x 1000';
          scope.imageTypeText = 'Receipt image.';
          scope.fileFormat = 'bmp';
          scope.imageName = '*';
          scope.imageNameMessage = '';
          scope.itemMaxSize = '';
          scope.headerType = 'companyImage';
          scope.invalidNameMessage = '';
        }

        if (scope.imageType === 'itemImage') {
          scope.imageSize  = '10kb and 128 x 128';
          scope.imageTypeText = 'Item image.';
          scope.imageName = '*';
          scope.imageNameMessage = '';
          scope.itemMaxSize = '10000';
          scope.headerType = 'item';
          scope.invalidNameMessage = '';
        }
      },

      controller: imageUploadController
    };
  });
