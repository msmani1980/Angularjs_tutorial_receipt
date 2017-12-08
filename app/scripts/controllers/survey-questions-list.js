'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyQuestionsListCtrl
 * @description
 * # SurveyQuestionsListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyQuestionsListCtrl', function ($scope, $q, $route, $location, $filter) {
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    var companyId;

    $scope.surveyQuestions = [];
  });
