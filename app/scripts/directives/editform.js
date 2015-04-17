'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:editForm
 * @description
 * # editForm
 */
angular.module('ts5App')
  .directive('editForm', ['$parse',function ($http,baseUrl) {

    return {  
      templateUrl: 'views/directives/edit-form.html',
      restrict: 'E',
      scope: {
      	fields:	'=',
        ngModel: '=',
      },

      controller: function($scope,$http,baseUrl) {

        // Submit form 
        $scope.submitForm = function() {

          // loop through fields passed to the directive
          angular.forEach($scope.fields, function(field) {

              // add data to the ngModel passed to the directive
              $scope.ngModel[field.model] = field.value ;

           });

          // forcing price right now, FIX ME
          $scope.ngModel.prices = [{startDate: '20150418', endDate: '20150518', typeId: '1', priceCurrencies: [], taxIs: 'Included',}];

          // Request Object
          var req = {
              method: 'POST',
              url: baseUrl + '/api/retail-items1',
              headers: {
                  'Content-Type': 'application/json',
                  'userId': 1,
                  'companyId': 326
              },
              data: {
                retailItem: $scope.ngModel
              }
          };

          // Post Data to server
            $http(req).success(function(data) {

              console.log('Created item!');
              console.log(data);
               // success

            }).error(function(data) {
              

              console.error('Error creating item!');
              console.log(data);

            });

          };

      }



   };



  }]);
