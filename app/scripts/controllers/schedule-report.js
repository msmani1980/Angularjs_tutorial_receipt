'use strict';
/*jshint maxcomplexity:8*/

/**
 * @ngdoc function
 * @name ts5App.controller:ScheduleReportCtrl
 * @description
 * # ScheduleReportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ScheduleReportCtrl',
    function ($scope, $modal, templateService, templateId, scheduleReportService, $modalInstance, $filter, scheduledReportsService, scheduledReportId) {

      $scope.today = new Date();
      $scope.templateId = templateId;
      $scope.timeZone = [];
      $scope.recurrenceTime = [];
      $scope.selection = {};
      $scope.selection.options = {};
      $scope.isActive = [];
      $scope.user = {
        daysOfWeek: []
      };
      $scope.errRecurrenceDatePicker = '';
      $scope.errMessage = '';
      
      if (scheduledReportId !== '') {

        $scope.scheduleReport = [];
        $scope.scheduledReportId = scheduledReportId;
        scheduledReportsService.getSchedule($scope.scheduledReportId).then(function (res) {
          $scope.scheduleReport = res.data;
          var timeArr = $scope.scheduleReport.recurrenceTime.split(':');
          $scope.scheduleReport.recurrenceTime = new Date(1970, 0, 1, timeArr[0], timeArr[1], 0);
          if ($scope.scheduleReport.daysOfWeek !== null && $scope.scheduleReport.daysOfWeek !== '') {
            $scope.array = $scope.scheduleReport.daysOfWeek.split(',');
            $scope.user.daysOfWeek = $scope.array;
          }

        });
      }

      templateService.get({ templateId: templateId }).$promise.then(function (rtn) {
        $scope.template = rtn;
        $scope.selection.name = rtn.name;
      });
      
      $scope.recurrencePattern = [{
        name: 'Daily',
        value: 'Daily'
      }, {
        name: 'Weekly',
        value: 'Weekly'
      }, {
        name: 'Monthly',
        value: 'Monthly'
      }];

      $scope.dayOfMonth = [{ name: 1, value: 1 }, { name: 2, value: 2 }, { name: 3, value: 3 }, { name: 4, value: 4 }, { name: 5, value: 5 }, { name: 6, value: 6 },
        { name: 7, value: 7 }, { name: 8, value: 8 }, { name: 9, value: 9 }, { name: 10, value: 10 }, { name: 11, value: 11 }, { name: 12, value: 12 }, { name: 13, value: 13 },
        { name: 14, value: 14 }, { name: 15, value: 15 }, { name: 16, value: 16 }, { name: 17, value: 17 }, { name: 18, value: 18 }, { name: 19, value: 19 },
        { name: 20, value: 20 }, { name: 21, value: 21 }, { name: 22, value: 22 }, { name: 23, value: 23 }, { name: 24, value: 24 }, { name: 25, value: 25 },
        { name: 26, value: 26 }, { name: 27, value: 27 }, { name: 28, value: 28 }, { name: 29, value: 29 }, { name: 30, value: 30 }, { name: 31, value: 31 },
        { name: 'Last Day', value: -1 }];

      $scope.daysOfWeek = [{ name: 'Sunday', value: 'Sunday' }, { name: 'Monday', value: 'Monday' }, { name: 'Tuesday', value: 'Tuesday' },
        { name: 'Wednesday', value: 'Wednesday' }, { name: 'Thursday', value: 'Thursday' }, { name: 'Friday', value: 'Friday' }, { name: 'Saturday', value: 'Saturday' }];

      $scope.dateRange = [{ name: 'Previous Day', value: 'Previous Day' }, { name: 'Previous 7 days', value: 'Previous 7 days' }, { name: 'Previous Month', value: 'Previous Month' }];

      var convertOptionValue = function (value, type, multiValue, choiceLookup) {
        if (multiValue && Array.isArray(value)) {
          var retValues = [];
          for (var i = 0; i < value.length; i++) {
            retValues.push(convertOptionValue(value[i], type, false, choiceLookup));
          }

          return retValues;
        } else if (type === 'DATE') {
          return $filter('date')(value, 'yyyy-MM-dd');
        } else if (type === 'ID' && choiceLookup) {
          return value.id;
        } else {
          return value;
        }
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
                $scope.template.options[i].multiValue,
                $scope.template.options[i].choiceLookup);
          }
        }

        return returnDetails;
      };

      var selection = 'not selected';

      function getSelectedRecurrencePattern(payLoad) {

        if ($scope.scheduleReport.recurrencePattern === $scope.recurrencePattern[0].name) {
          payLoad.daysOfWeek = ($scope.user.daysOfWeek.length) ? $scope.user.daysOfWeek.join() : selection;
        } else if ($scope.scheduleReport.recurrencePattern === $scope.recurrencePattern[1].name) {
          payLoad.dayOfWeek = $scope.scheduleReport.dayOfWeek;
        } else if ($scope.scheduleReport.recurrencePattern === $scope.recurrencePattern[2].name) {
          payLoad.dayOfMonth = $scope.scheduleReport.dayOfMonth;
        }
      }

      $scope.saveReport = function () {

        var payLoad = angular.copy($scope.scheduleReport);
        payLoad.templateId = templateId;

        var startDatevalue = $scope.scheduleReport.recurrenceStartDate;
        var endDatevalue = $scope.scheduleReport.recurrenceEndDate;
        payLoad.recurrenceStartDate = $filter('date')(startDatevalue, 'yyyy-MM-dd');
        payLoad.recurrenceEndDate = $filter('date')(endDatevalue, 'yyyy-MM-dd');
        
        if (payLoad.recurrenceStartDate && payLoad.recurrenceEndDate) {
          if (new Date(payLoad.recurrenceStartDate) > new Date(payLoad.recurrenceEndDate)) {
            $scope.errRecurrenceDatePicker = 'End Date should be greater than Start Date.';
            return false;
          }
        }
        
        payLoad.recurrenceTime = $filter('date')($scope.scheduleReport.recurrenceTime, 'HH:mm');

        $scope.checkBoxDaysOfWeekArray = [];

        payLoad.daysOfWeek = null;
        payLoad.dayOfWeek = null;
        payLoad.dayOfMonth = null;
       
        getSelectedRecurrencePattern(payLoad);
        if ($scope.scheduleReport.recurrencePattern === 'Daily' && payLoad.daysOfWeek === 'not selected') {
          $scope.errMessage = 'Please Select DaysOfWeek.';
          return false;
        }

        if ($scope.scheduleReport.dayOfMonth === 'Last Day') {
          payLoad.dayOfMonth = -1;
        }
        
        if ($scope.scheduleReport.dateRange === '' || $scope.scheduleReport.dateRange === null) {
          payLoad.dateRange = 'Previous Month';
        }
        
        var params = getSelectedOptions();
        
        if (isMandatoryFieldMissing()) {
          return;
        }
        
        payLoad.options = params.options;
        scheduleReportService.saveReport(payLoad);
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
      
      var isMandatoryFieldMissing = function () {
        var requiredFlag = false;
        for (var i = 0; i < $scope.template.options.length; i++) {
          if ($scope.template.options[i].type !== 'DATE' && $scope.template.options[i].optional === false && $scope.selection.options[$scope.template.options[i].code] === undefined) {
            requiredFlag = true;
          }
        }

        return requiredFlag;
      };
      
    });
