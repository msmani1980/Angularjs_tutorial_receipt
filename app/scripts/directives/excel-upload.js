'use strict';
/**
 * @ngdoc directive
 * @name ts5App.directive:excelUpload
 * @description Excel upload directive for TS5 retail items
 * # excelUpload
 */
angular.module('ts5App')
  .controller('ExcelUploadCtrl', function ($scope, $http, $q, $injector, Upload, ENV, GlobalMenuService, ngToast) {
    var $this = this;
    this.service;

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    $scope.$watchCollection('rejFiles', function (oldObj, newObj) {
      oldObj = oldObj || [];
      if (oldObj.length >= 1) {
        showToast('warning', 'Import from file', oldObj[0].name + ' does not meet file criteria')
      }
    });

    $scope.$watchCollection('files', function (oldObj, newObj) {
      oldObj = oldObj || [];
      if (oldObj.length >= 1) {
        showToast('success', 'Import from file', oldObj[0].name + ' is ready to be uploaded')
      }
    });

    $scope.modalHtml = function () {
      return 'views/directives/excel-upload.' + $scope.type + '.html';
    };

    $scope.upload = function (files) {
      $this.service.importFromExcel(GlobalMenuService.company.get(), files).then(successHandler, errorHandler);
    };

    function successHandler (response) {
      showToast('success', 'Import from file', response.config.file[0].name + ' was successful');
    }

    function errorHandler (response) {
      showToast('danger', 'Import from file', response.config.file[0].name + ' was rejected');
    }

    $scope.clearFile = function (filesIndex) {
      $scope.files.splice(filesIndex, 1);
    };

    $scope.clearAllFiles = function () {
      for (var filesIndex in $scope.files) {
        $scope.clearFile(filesIndex);
      }
      $scope.files = undefined;
    };

    $scope.showModalImportInfo = function () {
      angular.element('.info-import-model').modal('show');
    };

    $scope.hideModalImportInfo = function () {
      angular.element('.info-import-model').modal('hide');
    };

    function setupController () {
      try {
        $this.service = $injector.get($scope.type + 'Factory')
      } catch (error) {
        console.log(error);
      } finally {
        $this.service = $injector.get($scope.type + 'Service');
      }
    }

    setupController();
  })
  .directive('excelUpload', function () {
    return {
      scope: {
        type: '@'
      },
      restrict: 'E',
      controller: 'ExcelUploadCtrl',
      templateUrl: '/views/directives/excel-upload.html'
    };
  });
