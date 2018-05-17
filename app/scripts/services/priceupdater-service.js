'use strict';

/**
 * @ngdoc service
 * @name ts5App.priceupdaterService
 * @description
 * # priceupdaterService
 * Service in the ts5App.
 */
angular.module('ts5App')
.service('priceupdaterService', function ($resource, ENV) {

  var priceUpdaterRequestURL = ENV.apiUrl + '/rsvr/api/bulk-price/:ruleId';

  var priceUpdaterActions = {
    getPriceUpdaterRules: {
      method: 'GET'
    },
    getPriceUpdaterRuleById: {
      method: 'GET',
      headers: {}
    },
    createPriceUpdaterRule: {
      method: 'POST',
      headers: {}
    },
    updatePriceUpdaterRule: {
      method: 'PUT',
      headers: {}
    },
    applyPriceUpdateRules: {
      method: 'PATCH',
      headers: {}
    },
    deletePriceUpdaterRule: {
      method: 'DELETE',
      headers: {}
    }
  };
  
  var priceUpdaterRequestResource = $resource(priceUpdaterRequestURL, null, priceUpdaterActions);

  var getPriceUpdaterRules = function (payload, additionalPayload) {
    if (additionalPayload) {
      angular.extend(payload, additionalPayload);
    }

    return priceUpdaterRequestResource.getPriceUpdaterRules(payload).$promise;
  };

  var getPriceUpdaterRuleById = function (ruleId) {
    var requestParameters = {
      ruleId: ruleId
    };

    return priceUpdaterRequestResource.getPriceUpdaterRuleById(requestParameters, ruleId).$promise;
  };

  var createPriceUpdaterRule = function (payload) {

    return priceUpdaterRequestResource.createPriceUpdaterRule(payload).$promise;
  };

  var updatePriceUpdaterRule = function (ruleId, payload) {
    var requestParameters = {
      ruleId: ruleId
    };

    return priceUpdaterRequestResource.updatePriceUpdaterRule(requestParameters, payload).$promise;
  };

  var deletePriceUpdaterRule = function (ruleId) {
    var payload = {
      ruleId: ruleId 
    };

    return priceUpdaterRequestResource.deletePriceUpdaterRule(payload).$promise;
  };

  var applyPriceUpdateRules = function (ruleId, payload) {
    var requestParameters = {
      ruleId: ruleId
    };
 
    return priceUpdaterRequestResource.applyPriceUpdateRules(requestParameters, payload).$promise;
  };

  return {
    getPriceUpdaterRules: getPriceUpdaterRules,
    getPriceUpdaterRuleById: getPriceUpdaterRuleById,
    createPriceUpdaterRule: createPriceUpdaterRule,
    updatePriceUpdaterRule: updatePriceUpdaterRule,
    deletePriceUpdaterRule: deletePriceUpdaterRule,
    applyPriceUpdateRules: applyPriceUpdateRules
  };

});
