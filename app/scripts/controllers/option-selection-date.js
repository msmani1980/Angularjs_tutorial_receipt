'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:OptionSelectionDateCtrl
 * @description # OptionSelectionDateCtrl Controller of the ts5App
 */
<<<<<<< HEAD
angular.module('ts5App').controller('OptionSelectionDateCtrl',
	function($scope, dateUtility) {
  $scope.format = dateUtility.getReportsDateFormat();

  $scope.status = {
    opened: false
  };

  $scope.open = function() {
    $scope.status.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
	});
=======
angular.module('ts5App')
  .controller('OptionSelectionDateCtrl', function ($scope, dateUtility) {
    $scope.format = dateUtility.getReportsDateFormat();
    $scope.status = {
      opened: false
    };

    $scope.open = function () {
      $scope.status.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
  });
>>>>>>> remotes/origin/master
