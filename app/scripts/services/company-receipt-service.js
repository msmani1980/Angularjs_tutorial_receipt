'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyReceiptService
 * @description
 * # companyReceiptService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyReceiptService', function (ENV, $resource) {
    var requestURL = ENV.apiUrl + '/rsvr/api/company-receipts/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCompanyReceipts: {
        method: 'GET'
      },
      getSurveyQuestion: {
        method: 'GET'
      },
      createSurveyQuestion: {
        method: 'POST'
      },
      updateSurveyQuestion: {
        method: 'PUT'
      },
      removeSurveyQuestion: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompanyReceipts = function (payload) {
      return requestResource.getCompanyReceipts(payload).$promise;
    };

    var getSurveyQuestion = function (id) {
      return requestResource.getSurveyQuestion({ id: id }).$promise;
    };

    var createSurveyQuestion = function (payload) {
      return requestResource.createSurveyQuestion(payload).$promise;
    };

    var updateSurveyQuestion = function (id, payload) {
      return requestResource.updateSurveyQuestion({ id: id }, payload).$promise;
    };

    var removeSurveyQuestion = function (id) {
      return requestResource.removeSurveyQuestion({ id: id }).$promise;
    };

    return {
      getCompanyReceipts: getCompanyReceipts,
      getSurveyQuestion: getSurveyQuestion,
      createSurveyQuestion: createSurveyQuestion,
      updateSurveyQuestion: updateSurveyQuestion,
      removeSurveyQuestion: removeSurveyQuestion
    };
  });
