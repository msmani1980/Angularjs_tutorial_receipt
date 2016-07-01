'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReportOptionsCtrl
 * @description
 * # ReportOptionsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReportOptionsCtrl', function ($scope, $modalInstance, $filter, templateService, jobService, templateId) {

    $scope.templateId = templateId;
    $scope.template = templateService.get({ templateId: templateId });

    $scope.selection = {};

    $scope.template.$promise.then(function (rtn) {
      $scope.selection.name = rtn.name;
    });

    $scope.selection.options = {};

    var convertOptionValue = function (value, type, multiValue) {
      if (multiValue && Array.isArray(value)) {
        var retValues = [];
        for (var i = 0; i < value.length; i++) {
          retValues.push(convertOptionValue(value[i], type, false));
        }

        return retValues;
      } else if (type === 'DATE') {
        return $filter('date')(value, 'yyyy-MM-dd');
      } else if (type === 'ID') {
        return value.id;
      }

      return value;
    };

    var getSelectedOptions = function () {
      var returnDetails = {};
      returnDetails.options = {};

      returnDetails.name = $scope.selection.name;

      var i;
      for (i = 0; i < $scope.template.options.length; i++) {
        if ($scope.selection.options[$scope.template.options[i].code]) {
          returnDetails.options[$scope.template.options[i].code] =
            convertOptionValue($scope.selection.options[$scope.template.options[i].code],
              $scope.template.options[i].type,
              $scope.template.options[i].multiValue);
        }
      }

      return returnDetails;
    };

    $scope.run = function () {
      var params = getSelectedOptions();

      jobService.run($scope.template.id, params).then(function () {
        $modalInstance.close();
        window.location.href = '#/reports/queue';
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
