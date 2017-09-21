'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCtrl
 * @description
 * # EmployeeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('EmployeeCtrl', function($scope) {
	
	$scope.viewName = 'Add Employee';
	$scope.employeeList = {
		employeeID : "",
		employeeFirstName : "",
		startDate : "",
		passcode : "",
		employeeLastName : "",
		endDate : "",
		country : "",
		employeeTitle : "",
		baseStation : ""
	};
	$scope.formSave = function() {
		if (!formValid()) {
			$scope.displayError = true;
			return false;
		}
	};
	function formValid() {
		resetErrors();
		return $scope.employeeDataForm.$valid;
	}
	function resetErrors() {
		$scope.formErrors = [];
		$scope.errorCustom = [];
		$scope.displayError = false;
	}
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
	
});
