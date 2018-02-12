'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EposConfigCtrl
 * @description
 * # EposConfigCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EposConfigCtrl', function ($scope, dateUtility, eposConfigFactory, $location, $routeParams, $q, _) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Epos Configuration';
    $scope.productVersions = [];
    $scope.modules = [];
    $scope.selectedProductVersion = null;
    $scope.selectedModule = null;
    $scope.moduleConfiguration = null;
    $scope.moduleOptionValues = {
      checkbox: {},
      text: {},
      radioButton: {}
    };
    $scope.initialModuleOptionPopulatedIds = [];


    $scope.$watch('selectedProductVersion', function (newProductVersion) {
      if (!newProductVersion) {
        $scope.selectedModule = null;
        $scope.moduleConfiguration = null;
      }
    });

    $scope.selectModule = function (module) {
      $scope.moduleOptionValues = {
        checkbox: {},
        text: {},
        radioButton: {}
      };
      $scope.moduleOptions = null;
      $this.showLoadingModal('Loading Data');

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
        $scope.moduleOptions = _.filter($scope.moduleConfiguration.moduleVersions && $scope.moduleConfiguration.moduleVersions[0].moduleOptions, function(o) {
          return o.parentId == null;
        });

        $this.initializeNgModel($scope.moduleConfiguration.moduleVersions[0].moduleOptions);
      }

      $this.hideLoadingModal();
    };

    this.createOrUpdateSuccess = function(dataFromAPI) {
      $this.hideLoadingModal();
    };


    this.initializeNgModel = function(moduleOptions) {
      _.forEach(moduleOptions, function(option) {
        if(option.selected && option.selected[0]) {
          if(option.optionTypeId === 1) { // CheckBox
            $scope.moduleOptionValues.checkbox[option.id.toString()] = true;
          } else if(option.optionTypeId === 2) { // Radio Button
            $scope.moduleOptionValues.radioButton[option.parentId.toString()] = option.id;
          } else if(option.optionTypeId === 3) { // Checkbox
            $scope.moduleOptionValues.text[option.id.toString()] = option.selected[0].value;
          }

          $scope.initialModuleOptionPopulatedIds.push(option.id);
        }
      });
    };

    $scope.saveModuleOptions = function () {
      var payload = $this.constructUpsertPayload();

      $this.showLoadingModal('Saving Data');

      eposConfigFactory.createOrUpdate(payload).then($this.createOrUpdateSuccess);
    };

    this.constructUpsertPayload =function() {
      var payload = [];

      // Populate update/create payload
      _.forEach($scope.moduleOptionValues.checkbox, function(value, index) {
        var payloadCheckBoxItem = {
          "moduleOptionId": parseInt(index)
        };
        if(value === false && $scope.initialModuleOptionPopulatedIds.includes(index)) {
          payloadCheckBoxItem.isActive = false;
          payload.push(payloadCheckBoxItem);
        } else if(value === true) {
          payload.push(payloadCheckBoxItem);
        }
      });
      _.forEach($scope.moduleOptionValues.radioButton, function(value) {
        payload.push({
            "moduleOptionId": parseInt(value)
          }
        );
      });
      _.forEach($scope.moduleOptionValues.text, function(value, index) {
        payload.push({
            "moduleOptionId":  parseInt(index),
            "value": value
          }
        );
      });

      // Populate delete payload
      var currentlyModuleOptionPopulatedIds = $this.getCurrentlyModuleOptionPopulatedIds();
      _.forEach($scope.initialModuleOptionPopulatedIds, function(id) {
        if(!currentlyModuleOptionPopulatedIds.includes(id)) {
          payload.push({
              "moduleOptionId":  parseInt(id),
              "isActive": false
            }
          );
        }
      });

      return payload;
    };

    this.getCurrentlyModuleOptionPopulatedIds = function() {
      var currentlyModuleOptionPopulatedIds = [];
      _.forEach($scope.moduleOptionValues.checkbox, function(value, index) {
        currentlyModuleOptionPopulatedIds.push(parseInt(index));
      });
      _.forEach($scope.moduleOptionValues.radioButton, function(value, index) {
        currentlyModuleOptionPopulatedIds.push(value);
      });
      _.forEach($scope.moduleOptionValues.text, function(value, index) {
        currentlyModuleOptionPopulatedIds.push(parseInt(index));
      });

      return currentlyModuleOptionPopulatedIds;
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
  .directive('modules', function () {
    return {
      restrict: "E",
      replace: true,
      scope: {
        moduleList: '=',
        model: '='
      },
      templateUrl: 'views/directives/epos-config-form-modules.html'
    }
  })
  .directive('module', function ($compile) {
    return {
      restrict: "E",
      scope: {
        singleModule: '=',
        model: '='
      },
      templateUrl: 'views/directives/epos-config-form-single-module.html',
      link: function (scope, element, attrs) {
        var collectionSt = '<modules module-list="singleModule.subModules" model="model"></modules>';
        if (scope.singleModule.subModules && angular.isArray(scope.singleModule.subModules)) {
          $compile(collectionSt)(scope, function(cloned, scope)   {
            element.append(cloned);
          });
        }
      }
    }
  });
