'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ts5App
 */

angular.module('ts5App')
  .controller('UploadCtrl', function ($scope,Upload,baseUrl,$http) {

    // set header param 'type' = item
    $http.defaults.headers.common.type = 'item';

    // Progress
    $scope.uploadProgress = [];

    //Watch for files
   	$scope.$watch('files', function (files) {
       $scope.files = files;
    });

    //Clear current images/files
    $scope.clearFiles = function() {
        $scope.files = [];
        $scope.uploadProgress = 0;
        $scope.uploadSuccess = false;
        $scope.uploadFail = false;
        $scope.formData.images = [];
    };

    //Upload Image function
    $scope.upload = function () {

        // grab files from scope
    	var files = $scope.files;

        //if a file exists and it's length is greater than 0
        if (files && files.length) {
            
            // Upload iamge
            Upload.upload({     
                url: baseUrl + '/api/images',
                fileFormDataName: 'image',
                file: files
            }).progress(function (evt) {

                //Upload Progress
                $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);

            // on a successful upload
            }).success(function (data) {

                // set the UI flag
                $scope.uploadSuccess = true; 

                // new image object
                var newImage = {
                    endDate: '20150515',
                    imageURL: data.url,
                    startDate: '20150715'
                };

                // pass new image object into formData.images array
                $scope.formData.images.push(newImage);

            // on a failed upload
            }).error(function (data) {

                //set the UI flag 
                $scope.uploadFail = true;

                console.log(data);

            });

        // no files found, exit function
        } else {
        	return false;
        }

    };

});