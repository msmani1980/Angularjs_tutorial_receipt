'use strict';
/**
 * @ngdoc directive
 * @name ts5App.directive:imageUpload
 * @description Image upload directive for TS5 retail items
 * # imageUpload
 */
angular.module('ts5App')
  .directive('imageUpload', function () {

  	var imageUploadController = function ($scope, Upload, ENV, $http, $q) {
      $http.defaults.headers.common.type = 'item';
     	$scope.$watch('files', function (files) {
        for(var fileKey in files) {
          var file = files[fileKey];
          file.uploadProgress = 0;
        }
        $scope.files = files;
      });

      $scope.clearAllFiles = function() {
        for(var filesIndex in $scope.files) {
          $scope.clearFile(filesIndex);
        }
      };

      $scope.clearFile = function(filesIndex) {
        $scope.files.splice(filesIndex, 1);
      };

      $scope.addImage = function(fileIndex, data) {
        var newImage = {
            imageURL: data.url,
            startDate:  $scope.formData.startDate,
            endDate: $scope.formData.endDate
        };
        $scope.formData.images.push(newImage);
      };

      $scope.uploadFile = function (fileIndex) {
        var file = $scope.files[fileIndex];
        return Upload.upload({
            url: ENV.apiUrl + '/api/images',
            fileFormDataName: 'image',
            file: file
        }).progress(function (evt) {
          file.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function (data) {
          $scope.addImage(fileIndex, data);
        }).error(function () {
          file.uploadFail = true;
          // TODO: Interpret this failure and tell the user
        });
      };

      $scope.doesImageMeetSizeConstraint = function (filesIndex, imgElement){
        var file = $scope.files[filesIndex];

        if(!imgElement){
          imgElement = angular.element( angular.element('.fileTest')[filesIndex] );
        }

  			this.imgHeight = imgElement.height();
  			this.imgWidth = imgElement.width();

  			if ($scope.imgHeight > 128 || $scope.imgWidth > 128){
  				file.imageTooLarge = true;
  				file.imageDimensions = this.imgWidth + 'px' + ' x ' + this.imgHeight + 'px';
  			} else {
          return true;
        }

      };

      $scope.upload = function () {
        var fileUploadPromises = [];
        $scope.filesToClear = [];
        var files = $scope.files;

       	if (files && files.length) {
          for (var filesIndex in files) {
             if( $scope.doesImageMeetSizeConstraint(filesIndex) ) {
               fileUploadPromises.push( $scope.uploadFile(filesIndex) );
             }
          }

          $q.all(fileUploadPromises).then(function(results) {
            var reversedResults = results.reverse();
            for(var key in reversedResults) {
              var result = reversedResults[key];
              if(result.status === 201) {
                $scope.files.pop();
              }
            }
          });
        }
      };

    };

    return {
    	templateUrl: '/views/directives/image-upload.html',
    	restrict: 'E',
    	scope: false, // isolate scope to parent
    	controller: imageUploadController
    };
  });
