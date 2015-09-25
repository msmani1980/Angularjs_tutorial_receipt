'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionsService
 * @description
 * # promotionsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('promotionsService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/promotions/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getPromotion: {
        method: 'GET'
      },
      createPromotion: {
        method: 'POST'
      },
      savePromotion: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPromotion(id){
      return requestResource.getPromotion({id: id}).$promise;
    }

    function createPromotion(payload){
      return requestResource.createPromotion(payload).$promise;
    }

    function savePromotion(id, payload){
      return requestResource.savePromotion({id: id}, payload).$promise;
    }

    return{
      getPromotion: getPromotion,
      createPromotion: createPromotion,
      savePromotion: savePromotion
    };

  });
