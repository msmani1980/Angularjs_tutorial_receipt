'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ts5App
 */

angular.module('ts5App')
  .controller('UploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {

    // Log and Progress
    $scope.log = '';
    $scope.progress = [ ];

    //Watch for files
   	$scope.$watch('files', function (files) {
       $scope.files = files;
    });

    //Clear current images/files
    $scope.clearFiles = function() {
        $scope.files = [];
        $scope.progress = '0';
        $scope.success = '';
        $scope.fail = '';
        $scope.formData.images = [];
    };

    //Upload Image function
    $scope.upload = function () {

        //Set variable files for good practice
    	var files = $scope.files;

        //if a file exists and it's length is greater than 0
        if (files && files.length) {
            
            Upload.upload({     
                url: 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/images',
                fileFormDataName: 'image',
                file: files
            }).progress(function (evt) {

                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                //Upload Progress
                $scope.progress = progressPercentage;

            }).success(function (data) {

                //Upload Success
                $scope.success = 'Success'; 

                //on success, create image array
                var newImage = {
                    endDate: '20150515',
                    imageURL: data.url,
                    startDate: '20150715'
                };

                //pass created image into images array
                $scope.formData.images.push(newImage);

            }).error(function (data) {

                //Upload Fail
                $scope.fail = 'Fail';

                console.log(data);

            });

        } else {

        	return false;
        }

    };

}]);