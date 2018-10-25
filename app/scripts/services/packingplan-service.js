'use strict';

/**
 * @ngdoc service
 * @name ts5App.packingplanService
 * @description
 * # packingplanService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('packingplanService', function ($resource, ENV) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  var packingPlanRequestURL = ENV.apiUrl + '/rsvr/api/packingplan/:planId';

  var packingPlanActions = {
    getPackingPlansList: {
      method: 'GET'
    },
    getPackingPlanById: {
      method: 'GET',
      headers: {}
    },
    createPackingPlan: {
      method: 'POST',
      headers: {}
    },
    updatePackingPlan: {
      method: 'PUT',
      headers: {}
    },
    deletePackingPlan: {
      method: 'DELETE',
      headers: {}
    }
  };
	  
  var packingPlanRequestResource = $resource(packingPlanRequestURL, null, packingPlanActions);

  var getPackingPlansList = function (payload, additionalPayload) {
    if (additionalPayload) {
      angular.extend(payload, additionalPayload);
    }

    return packingPlanRequestResource.getPackingPlansList(payload).$promise;
  };

  var getPackingPlanById = function (planId) {
    var requestParameters = {
      planId: planId
    };

    return packingPlanRequestResource.getPackingPlanById(requestParameters, planId).$promise;
  };

  var createPackingPlan = function (payload) {
    return packingPlanRequestResource.createPackingPlan(payload).$promise;
  };

  var updatePackingPlan = function (planId, payload) {
    var requestParameters = {
      planId: planId
    };

    return packingPlanRequestResource.updatePackingPlan(requestParameters, payload).$promise;
  };

  var deletePackingPlan = function (planId) {
    var payload = {
      planId: planId 
    };

    return packingPlanRequestResource.deletePackingPlan(payload).$promise;
  };

  return {
    getPackingPlansList: getPackingPlansList,
    getPackingPlanById: getPackingPlanById,
    createPackingPlan: createPackingPlan,
    updatePackingPlan: updatePackingPlan,
    deletePackingPlan: deletePackingPlan
  };

});
