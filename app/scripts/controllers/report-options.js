'use strict';
/*jshint maxcomplexity:7*/
/**
 * @ngdoc function
 * @name ts5App.controller:ReportOptionsCtrl
 * @description
 * # ReportOptionsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReportOptionsCtrl', function ($scope, $modalInstance, $filter, templateService, jobService, templateId, reRunExistingJobReport) {

    $scope.templateId = templateId;
    
    templateService.get({ templateId: templateId }).$promise.then(function (rtn) {
      $scope.template = rtn;
      $scope.selection.name = rtn.name;
      if (reRunExistingJobReport !== null && reRunExistingJobReport.optionValues !== null) {
        angular.forEach(reRunExistingJobReport.optionValues, function(optionVal) {
          $scope.selection.options[optionVal.code] = optionVal.value;
        });
      }
    });

    $scope.selection = {};

    $scope.selection.options = {};
    
    $scope.emailMe = {};
    
    $scope.errMessageDatePicker = '';
    $scope.errMessageCBDatePicker = '';
    
    var convertOptionValue = function (value, type, multiValue, isChoiceLookup) {
      if (multiValue && Array.isArray(value)) {
        var retValues = [];
        for (var i = 0; i < value.length; i++) {
          retValues.push(convertOptionValue(value[i], type, false, isChoiceLookup));
        }

        return retValues;
      } else if (type === 'DATE') {
        return $filter('date')(value, 'yyyy-MM-dd');
      } else if (type === 'ID' && isChoiceLookup) {
        return value.id;
      }

      return value;
    };

    var getSelectedOptions = function () {
      var returnDetails = {};
      returnDetails.options = {};
      returnDetails.emailMe = $scope.emailMe === true ? true : false;
      returnDetails.name = $scope.selection.name;

      var i;
      for (i = 0; i < $scope.template.options.length; i++) {
        if ($scope.selection.options[$scope.template.options[i].code]) {
          returnDetails.options[$scope.template.options[i].code] =
            convertOptionValue($scope.selection.options[$scope.template.options[i].code],
              $scope.template.options[i].type,
              $scope.template.options[i].multiValue, $scope.template.options[i].choiceLookup);
        }
      }

      return returnDetails;
    };

    $scope.run = function () {
      var params = getSelectedOptions();
      if (!validateFromToDate(params)) {
        return false;
      }

      jobService.run($scope.template.id, params).then(function () {
        $modalInstance.close();
        window.location.href = '#/reports/queue';
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    
    function validateFromToDate (parameters) { 
      if (parameters.options && parameters.options.effDate && parameters.options.endDate) {
        if (new Date(parameters.options.effDate) > new Date(parameters.options.endDate)) {
          $scope.errMessageDatePicker = 'End Date should be greater than Start Date.';
          $scope.errMessageCBDatePicker = '';
          return false;
        }
      }

      if (parameters.options && parameters.options.verifyEffDate && parameters.options.verifyEndDate) {
        if (new Date(parameters.options.verifyEffDate) > new Date(parameters.options.verifyEndDate)) {
          $scope.errMessageCBDatePicker = 'Cash Bag Verify End Date should be greater than Start Date.';
          $scope.errMessageDatePicker = '';
          return false;
        }
      }
      
      if (parameters.options && parameters.options.priceEffDate && parameters.options.priceEndDate) {
        if (new Date(parameters.options.priceEffDate) > new Date(parameters.options.priceEndDate)) {
          $scope.errMessageCBDatePicker = 'Price Effective End Date should be greater than Start Date.';
          $scope.errMessageDatePicker = '';
          return false;
        }
      }

      return true;
    }
        
  });
