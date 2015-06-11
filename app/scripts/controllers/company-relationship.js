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

    $scope.companyRelationshipList = [];

    function setupCompanyRelationshipModel(companyRelationshipsFromAPI) {
      companyRelationshipsFromAPI = companyRelationshipsFromAPI.companyRelationships;
      if (!companyRelationshipsFromAPI.length) {
        $scope.companyRelationshipList.push({
          relativeCompanyId: null,
          startDate: null,
          endDate: null
        });
      } else {
        $scope.companyRelationshipList = angular.copy(companyRelationshipsFromAPI);
      }
    }

    companyRelationshipService.getCompanyRelationshipList($routeParams.id).then(setupCompanyRelationshipModel);
  });
