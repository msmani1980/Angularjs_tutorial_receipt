'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EposConfigCtrl
 * @description
 * # EposConfigCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EposConfigCtrl', function ($scope, dateUtility, eposConfigFactory, $location, $routeParams, $q) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Epos Configuration';
    $scope.productVersions = [];
    $scope.modules = [];
    $scope.selectedProductVersion = null;
    $scope.selectedModule = null;
    $scope.moduleConfiguration = null;

    $scope.$watch('selectedProductVersion', function (newProductVersion) {
      if (!newProductVersion) {
        $scope.selectedModule = null;
        $scope.moduleConfiguration = null;
      }
    });

    $scope.selectModule = function (module) {
      $scope.selectedModule = module;

      eposConfigFactory.getModule(module.id, $scope.selectedProductVersion.id).then($this.getModuleSuccess);
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.getProductVersionsSuccess = function(dataFromAPI) {
      $scope.productVersions = angular.copy(dataFromAPI.response).map(function (productVersion) {
        productVersion.displayName = productVersion.majorVersion + '.' + productVersion.minorVersion + '.' + productVersion.revision + '.' + productVersion.build;

        return productVersion;
      });
    };

    this.getModulesSuccess = function(dataFromAPI) {
      $scope.modules = angular.copy(dataFromAPI.response);
    };

    this.getModuleSuccess = function(dataFromAPI) {
      $scope.moduleConfiguration = angular.copy(dataFromAPI);

      $scope.moduleOptions = null;
      if($scope.moduleConfiguration && $scope.moduleConfiguration.moduleVersions && $scope.moduleConfiguration.moduleVersions) {
        $scope.moduleOptions = $scope.moduleConfiguration.moduleVersions && $scope.moduleConfiguration.moduleVersions[0].moduleOptions;
      }
    };

    this.initDependenciesSuccess = function(result) {
      $this.getProductVersionsSuccess(result[0]);
      $this.getModulesSuccess(result[1]);
      $this.hideLoadingModal();
    };

    this.initDependenciesError = function(errorResponse) {
      $scope.errorResponse = errorResponse[0];
      $scope.displayError = true;
      $this.hideLoadingModal();
    };

    this.makeInitPromises = function() {
      companyId = eposConfigFactory.getCompanyId();
      var promises = [
        eposConfigFactory.getProductVersions(),
        eposConfigFactory.getModules()
      ];
      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess, $this.initDependenciesError);
    };

    this.init();

  })
  .directive('collection', function () {
    return {
      restrict: "E",
      replace: true,
      scope: {
        collection: '='
      },
      template: "<ul><member ng-repeat='member in collection' member='member'></member></ul>"
    }
  })
  .directive('member', function ($compile) {
    return {
      restrict: "E",
      replace: true,
      scope: {
        member: '='
      },
      template: "<li>{{member.name}}</li>",
      link: function (scope, element, attrs) {
        var collectionSt = '<collection collection="member.children"></collection>';
        if (angular.isArray(scope.member.children)) {
          $compile(collectionSt)(scope, function(cloned, scope)   {
            element.append(cloned);
          });
        }
      }
    }
  });
