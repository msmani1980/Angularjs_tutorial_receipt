'use strict';

/**
 * @ngdoc service
 * @name ts5App.receiptRules
 * @description
 * # receiptRules
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('receiptRulesService', function($resource, ENV) {

    var receiptRulesRequestURL = ENV.apiUrl + '/api/receipt-rules/:id';
   
    var receiptRulesActions = {
      getReceiptRules: {
        method: 'GET',
        headers: {}
      },
      getReceiptRule: {
        method: 'GET',
        headers: {}
      },
      createReceiptRule: {
        method: 'POST',
        headers: {}
      },
      updateReceiptRule: {
        method: 'PUT',
        headers: {}
      },
      deleteReceiptRule: {
        method: 'DELETE',
        headers: {}
      }
    };

    var receiptRulesRequestResource = $resource(receiptRulesRequestURL, null, receiptRulesActions);

    var getReceiptRules = function(payload) {
      return receiptRulesRequestResource.getReceiptRules(payload).$promise;
    };

    var getReceiptRule = function(receiptRuleId) {
      var payload = {
        id: receiptRuleId
      };
      return receiptRulesRequestResource.getReceiptRule(payload).$promise;
    };
    
    var createReceiptRule = function (payload) {
      return receiptRulesRequestResource.createReceiptRule(payload).$promise;
    };
    
    var updateReceiptRule = function (receiptRuleId, payload) {
      return receiptRulesRequestResource.updateReceiptRule(receiptRuleId, payload).$promise;
    };
    
    var deleteReceiptRule = function (receiptRuleId) {
      var payload = {
        id: receiptRuleId
      };
      return receiptRulesRequestResource.deleteReceiptRule(payload).$promise;
    };

    return {
      getReceiptRules: getReceiptRules,
      getReceiptRule: getReceiptRule,
      createReceiptRule: createReceiptRule,
      updateReceiptRule: updateReceiptRule,
      deleteReceiptRule: deleteReceiptRule,
    };

  });
