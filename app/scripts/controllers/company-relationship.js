'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyRelationshipCtrl
 * @description
 * # CompanyRelationshipCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyRelationshipCtrl', function ($scope, $routeParams, companyRelationshipService) {
    
    function setupCompanyRelationshipModel(companyRelationshipsFromAPI) {
      $scope.companyRelationships = angular.copy(companyRelationshipsFromAPI);
    }
    
    companyRelationshipService.getCompanyRelationshipList($routeParams.id).then(setupCompanyRelationshipModel);
  });
