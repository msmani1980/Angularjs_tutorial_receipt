'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyQuestionsCreateCtrl
 * @description
 * # SurveyQuestionsCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyQuestionsCreateCtrl', function ($scope) {
    $scope.isLoadingCompleted = true;
    $scope.viewName = 'Create Survey Question'
  });
