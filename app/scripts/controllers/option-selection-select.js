'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:OptionSelectionSelectCtrl
 * @description # OptionSelectionSelectCtrl Controller of the ts5App
 */
angular.module('ts5App').controller(
		'OptionSelectionSelectCtrl',
		function($scope, templateOptionService) {

			$scope.choices = [];

			$scope.selected = {};

			$scope.refreshChoiceValues = function(filter) {
				templateOptionService.getChoiceValues(
						$scope.option.choiceLookup, filter).then(
						function(response) {
							$scope.choices = response.data;
						});
			};

		});
