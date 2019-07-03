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
  .controller('ReportOptionsCtrl', function ($scope, $modalInstance, $filter, templateService, jobService, templateId, reRunExistingJobReport, lodash, $timeout, templateOptionService, $location, $route) {

    $scope.templateId = templateId;
    
    templateService.get({ templateId: templateId }).$promise.then(function (rtn) {
      $scope.template = rtn;
      $scope.selection.name = rtn.name;
      loadExistingReportParams();
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
        if ($location.path() === '/reports/queue') {
          $route.reload();
        } else {
          window.location.href = '#/reports/queue';
        }
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
    
    function loadExistingReportParams() {
      if (reRunExistingJobReport !== null && reRunExistingJobReport.optionValues !== undefined) {
        $scope.selection.name = reRunExistingJobReport.name;
        var groups = reRunExistingJobReport.optionValues.reduce(function(obj, item) {
          obj[item.code] = obj[item.code] || [];
          obj[item.code].push(item.value);
          return obj;
        }, {});
        
        var myArray = Object.keys(groups).map(function(key) {
          return { code: key, value: groups[key] };
        });
        
        angular.forEach(myArray, function(option) {
          var choiceSelectedVal = [];
          var optionResponse = [];
          var isOptionID = lodash.findWhere(reRunExistingJobReport.template.options, { code: option.code });
          if (isOptionID !== undefined && (isOptionID.choiceLookup || isOptionID.choiceValues) && (isOptionID.type === 'ID' || isOptionID.type === 'STRING')) {
            if (isOptionID.choiceLookup !== undefined) {
              var promise = getSelectedChoiceValues(isOptionID.choiceLookup, '');
              promise.then(function(response) {
                  optionResponse = response.data;
                  angular.forEach(option.value, function(selectedId) {
                    var optionMatch = $filter('filter')(optionResponse, function(item) {
                      return (parseInt(item.id) === selectedId);
                    })[0];

                    choiceSelectedVal.push(optionMatch);
                  });

                  $scope.selection.options[option.code] = choiceSelectedVal;
                });

            } else if (isOptionID.choiceLookup === undefined && isOptionID.type === 'STRING' && !isOptionID.multiValue) {
              $scope.selection.options[option.code] = option.value.toString();
            } else {
              $scope.selection.options[option.code] = option.value;
            }
            
          } else if (isOptionID !== undefined && !isOptionID.choiceLookup && isOptionID.type === 'ID') {
            $scope.selection.options[option.code] = parseInt(option.value.toString());
          } else {
            $scope.selection.options[option.code] = option.value.toString();
          }
        });
      }
    }
    
    function  getSelectedChoiceValues (choiceLookup, filter) {
      return templateOptionService.getChoiceValues(choiceLookup, filter);
    }
  });
