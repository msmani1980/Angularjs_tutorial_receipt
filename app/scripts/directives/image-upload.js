'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:imageUpload
 * @description Image upload directive for TS5 retail items
 * # imageUpload
 */

angular.module('ts5App')
  .directive('imageUpload', function () {

  	var imageUploadController = function ($scope, Upload, ENV, $http,$q) {

      // set header param 'type' = item
      $http.defaults.headers.common.type = 'item';

     	$scope.$watch('files', function (files) {

        for(var fileKey in files) {

          var file = files[fileKey];
          file.uploadProgress = 0;

        }

        $scope.files = files;

      });


      // clear current files and progress
      $scope.clearAllFiles = function() {

        for(var filesIndex in $scope.files) {

          $scope.clearFile(filesIndex);

        }

      };

      // clear current files and progress
      $scope.clearFile = function(filesIndex) {

        $scope.files.splice(filesIndex,1);

      };

      $scope.addImage = function(fileIndex,data) {

        // new image object
        var newImage = {
            imageURL: data.url,
            startDate:  $scope.formData.startDate,
            endDate: $scope.formData.endDate
        };

        // pass new image object into formData.images array
        $scope.formData.images.push(newImage);

      };

      $scope.uploadFile = function (fileIndex) {

        var file = $scope.files[fileIndex];

        // Upload image
        return Upload.upload({
            url: ENV.apiUrl + '/api/images',
            fileFormDataName: 'image',
            file: file
        })
        .progress(function (evt) {

          // Upload Progress
          file.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);

        // on a successful upload
        }).success(function (data) {

          $scope.addImage(fileIndex,data);

        // on a failed upload
        }).error(function () {

          //set the UI flag
          file.uploadFail = true;

          // TODO: Interpret this failure and tell the user
          //  console.log(data);

        });

      };

      $scope.doesImageMeetSizeConstraint = function (filesIndex){

        var file = $scope.files[filesIndex];

        var imgElement = angular.element( angular.element('.fileTest')[filesIndex] );

  			var imgHeight = imgElement.height();

  			var imgWidth = imgElement.width();

  			if (imgHeight > 128 || imgWidth > 128){

  				file.imageTooLarge = true;

  				file.imageDimensions = imgWidth + 'px' + ' x ' + imgHeight + 'px';

  			} else {

          return true;

        }

      };

	    // upload image function
	    $scope.upload = function () {

        var fileUploadPromises = [];

        $scope.filesToClear = [];

        var files = $scope.files;

        //if a file exists and it is not null
       	if (files && files.length) {

          //for multiple files, loop through
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
