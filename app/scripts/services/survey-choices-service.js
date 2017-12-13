'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyChoicesService
 * @description
 * # surveyChoicesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('surveyChoicesService', function (ENV, $resource) {
    var requestURL = ENV.apiUrl + '/rsvr/api/survey/answer/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getSurveyChoices: {
        method: 'GET'
      },
      removeSurveyChoice: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getSurveyChoices = function (payload) {
      return requestResource.getSurveyChoices(payload).$promise;
    };

    var removeSurveyChoice = function (id) {
      return requestResource.removeSurveyChoice({ id: id }).$promise;
    };

    return {
      getSurveyChoices: getSurveyChoices,
      removeSurveyChoice: removeSurveyChoice
    };
  });
