'use strict';
/**
 * @ngdoc directive
 * @name ts5App.directive:excelUpload
 * @description Excel upload directive for TS5 retail items
 * # excelUpload
 */
angular.module('ts5App')
  .controller('ExcelUploadCtrl', function ($scope, $http, $q, $injector, Upload, ENV, globalMenuService, ngToast, identityAccessFactory) {
    var $this = this;
    this.service = null;

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function successHandler(response) {
      if (response.toString() === 'OK_BUT_EMAIL_FAILURE') {
        showToast('warning', 'Import from file', 'upload successful, but email notifications have failed');
      } else {
        showToast('success', 'Import from file', response.config.file.name + ' was successful. Please wait for an email to see the status of the file processing, and then return to this screen to see your data');
      }

      $scope.clearFile();
    }

    function errorHandler(response) {
      showToast('danger', 'Import from file', response.config.file.name + ' was rejected');
    }

    $scope.$watchCollection('rejFiles', function (oldObj/*, newObj*/) {
      oldObj = oldObj || [];
      if (oldObj.length >= 1) {
        showToast('danger', 'Import from file', oldObj.name + ' does not meet file criteria');
      }
    });

    $scope.$watchCollection('files', function (oldObj/*, newObj*/) {
      oldObj = oldObj || [];
      if (oldObj.length >= 1) {
        showToast('success', 'Import from file', oldObj.name + ' is ready to be uploaded');
      }
    });

    $scope.modalHtml = function () {
      return 'views/directives/excel-upload.' + $scope.type + '.html';
    };

    $scope.upload = function (files) {
      if ($scope.uploadParam) {
        $this.service.importFromExcel(globalMenuService.company.get(), files, $scope.uploadParam).then(successHandler, errorHandler);
      } else {
        $this.service.importFromExcel(globalMenuService.company.get(), files).then(successHandler, errorHandler);
      }
    };

    $scope.clearFile = function () {
      $scope.files = undefined;
    };

    $scope.showModalImportInfo = function () {
      angular.element('.info-import-model').modal('show');
    };

    $scope.hideModalImportInfo = function () {
      angular.element('.info-import-model').modal('hide');
    };

    function setTemplateName() {
      // jshint ignore: start
      if ($scope.type === 'menu') {
        $scope.templateName = 'menuUpload';
      } else if ($scope.type === 'postTrip') {
        $scope.templateName = 'FileUpload-PostTripManagement';
      } else if ($scope.type === 'schedule') {
        $scope.templateName = 'scheduleUpload';
      } else if ($scope.type === 'employee') {
        $scope.templateName = 'employeeUpload';
      } else if ($scope.type === 'stations') {
        $scope.templateName = 'stationUpload';
      }

      // jshint ignore: end
    }

    function setDownloadTemplateUrl() {
      $scope.downloadTemplateUrl = 'https://s3.amazonaws.com/ts5-dev-portal-images/templates/' + $scope.templateName + '.xlsx';

      if ($scope.type === 'stockTake') {
        var sessionToken = identityAccessFactory.getSessionObject().sessionToken;
        $scope.downloadTemplateUrl = ENV.apiUrl + '/rsvr-pdf/api/stock-management/dashboard/file/template?sessionToken=' + sessionToken;
      }
    }

    function setupController() {
      setTemplateName();
      setDownloadTemplateUrl();
      try {
        $this.service = $injector.get($scope.type + 'Factory');
      } catch (error) {
        console.log(error);
      } finally {
        if ($scope.type === 'schedule') {
          $this.service = $injector.get('schedulesService');
        } else if ($scope.type === 'employee') {
          $this.service = $injector.get('employeesService');
        } else {
          $this.service = $injector.get($scope.type + 'Service');
        }

      }
    }

    setupController();
  })
  .directive('excelUpload', function () {
    return {
      scope: {
        type: '@',
        uploadParam: '@'
      },
      restrict: 'E',
      controller: 'ExcelUploadCtrl',
      templateUrl: '/views/directives/excel-upload.html'
    };
  });
