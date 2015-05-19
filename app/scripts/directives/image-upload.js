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

	    // progress
	    $scope.uploadProgress = '0';

	    // watch for files
	   	$scope.$watch('files', function (files) {
	       $scope.files = files;
	    });

	    // clear current qr files
	    $scope.clearFiles = function() {
	        $scope.files = [];
	        $scope.uploadProgress = 0;
	        $scope.uploadSuccess = false;
	        $scope.uploadFail = false;
	        $scope.formData.images = [];
	    };

	    // upload image function
	    $scope.upload = function () {

	        // grab files from scope
	    	var files = $scope.files;

	        //if a file exists and it is not null
	        if (files && files.length) {

	            // Upload image
	            Upload.upload({
	                url: ENV.apiUrl + '/api/images',
	                fileFormDataName: 'image',
	                file: files
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
	                    startDate: '20150615',
	                    endDate: '20150715'
	                };

	                // pass new image object into formData.images array
	                $scope.formData.images.push(newImage);

	            // on a failed upload
            }).error(function (data) {

	                //set the UI flag
	                $scope.uploadFail = true;


                  // TODO: Interpret this failure and tell the user
                  console.log(data);

	            });

	        // no files found, exit function
	        } else {
	        	return false;
	        }

	    };

    };

    return {

      	templateUrl: 'views/directives/image-upload.html',
      	restrict: 'E',
      	scope: false, // isolate scope to parent
      	controller: imageUploadController
    };

  });
