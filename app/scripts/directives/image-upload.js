'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:imageUpload
 * @description Image upload directive for TS5 retail items
 * # imageUpload
 */

angular.module('ts5App')
  .directive('imageUpload', function () {

  	var imageUploadController = function ($scope, Upload, ENV, $http) {

      // set header param 'type' = item
      $http.defaults.headers.common.type = 'item';

      $scope.uploadProgress = '0';

     	$scope.$watch('files', function (files) {
        $scope.files = files;
      });

      $scope.filesChanged = function(){
        //console.log('Files have been changed');
      };

      // clear current files and progress
      $scope.clearFiles = function() {
        $scope.files = [];
        $scope.uploadProgress = 0;
        $scope.uploadSuccess = false;
        $scope.uploadFail = false;
      };

      var multipleFiles =  function (i, files) {
            
        var file = files[i];

        $scope.imageTooLarge = false;

        // Upload image
        Upload.upload({
            url: ENV.apiUrl + '/api/images',
            fileFormDataName: 'image',
            file: file
        }).progress(function (evt) {

          // Upload Progress
          $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);

        // on a successful upload
        }).success(function (data) {

          // set the UI flag
          $scope.uploadSuccess = true;

          // new image object
          var newImage = {
              imageURL: data.url,
              startDate:  $scope.formData.startDate,
              endDate: $scope.formData.endDate
          };

          // pass new image object into formData.images array
          $scope.formData.images.push(newImage);

          $scope.clearFiles();

        // on a failed upload
        }).error(function () {

          //set the UI flag
          $scope.uploadFail = true;

          // TODO: Interpret this failure and tell the user
          //  console.log(data);

        });

      };

	    // upload image function
	    $scope.upload = function () {

        var files = $scope.files;
            
  			var imgElement = angular.element('.thumbs');
  			var imgHeight = imgElement.height();
  			var imgWidth = imgElement.width();

  			if (imgHeight > 128 && imgWidth > 128){
  				$scope.clearFiles();
  				$scope.imageTooLarge = true;
  				$scope.imageDimensions = imgWidth + 'px' + ' x ' + imgHeight + 'px';
  			}

        //if a file exists and it is not null
       	else if (files && files.length) {

          //for multiple files, loop through
          for (var i = 0; i < files.length; i++) {

            multipleFiles(i, files);

          }

          $scope.clearFiles();

        // no files found, exit function
        } else {

        	return false;

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