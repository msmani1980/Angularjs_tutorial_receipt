'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:BackOfficeConfigCtrl
 * @description
 * # BackOfficeConfigCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('BackOfficeConfigCtrl', function ($scope, dateUtility, eposConfigFactory, $location, $routeParams, $q, $localStorage, _, lodash, backOfficeConfigService, companyPreferencesService, globalMenuService, featureThresholdsFactory) {
    var $this = this;

    var _companyId = null;
    $scope.formData = {};
    $scope.viewName = 'Back Office Configuration';
    $scope.productVersions = [];
    $scope.portalConfigurationFeatures = [
      {
        name: 'Cash Bag Configuration'
      },
      {
        name: 'PreOrder Configuration'
      },
      {
        name: 'StationOps Configuration'
      },
      {
        name: 'Reconcile Configuration'
      }
    ];

    $scope.configOptionDefinition = null;
    $scope.configOptions = [];
    $scope.companyPreferences = [];
    $scope.dailyExchangeThresHold = [];
    $scope.reconciliationThresHold = [];
    $scope.storeDispatchThresHold = [];

    $scope.selectedProductVersion = null;
    $scope.selectedFeature = null;
    $scope.moduleConfiguration = null;
    $scope.moduleOptionValues = {
      checkbox: {},
      text: {},
      radioButton: {}
    };
    $scope.initialRadioButtonModuleOptionPopulatedIds = {};
    $scope.initialCheckBoxModuleOptionPopulatedIds = {};

    $scope.$watch('selectedProductVersion', function (newProductVersion) {
      if (!newProductVersion) {
        $scope.selectedModule = null;
        $scope.moduleConfiguration = null;
      }
    });

    $scope.resetValues = function () {
      $scope.configOptions = [];
    };

    $scope.calculateFormDataKeyForConfigOption = function (option) {
      return $scope.calculateFormDataKeyFor(option.configSource, option.featureCode, option.optionCode);
    };

    $scope.calculateFormDataKeyFor = function (prefix, featureCode, optionCode) {
      if(prefix && featureCode && optionCode) {
        return prefix + '__' + featureCode + '__' + optionCode;
      }

      return prefix + '__' + featureCode;
    };

    $scope.selectFeature = function (feature) {
      $this.showLoadingModal('Loading Data');

      $scope.resetValues();

      $scope.selectedFeature = feature;

      if($scope.selectedFeature && $scope.selectedFeature.name === 'PreOrder Configuration') {
        $scope.configOptions = angular.copy($scope.configOptionDefinition.preOrderConfigOptions);
      } else if($scope.selectedFeature && $scope.selectedFeature.name === 'Reconcile Configuration') {
        $scope.configOptions = angular.copy($scope.configOptionDefinition.reconcileConfigOptions);
      } else if($scope.selectedFeature && $scope.selectedFeature.name === 'Cash Bag Configuration') {
        $scope.configOptions = angular.copy($scope.configOptionDefinition.cashBagConfigOptions);
      } else if($scope.selectedFeature && $scope.selectedFeature.name === 'StationOps Configuration') {
        $scope.configOptions = angular.copy($scope.configOptionDefinition.stationOpsConfigOptions);
      }

      var dependencyPromises = $this.makeSelectFeatureDependencyPromises();
      $q.all(dependencyPromises).then($this.setDependencies, $this.errorHandler);

      $this.hideLoadingModal();
    };

    this.setDependencies = function(response) {
      $this.setCompanyPreferences(response[0]);
      $this.setDailyExchangeRateThreshold(response[1]);
      $this.setReconciliationThreshold(response[2]);
      $this.setStoreDispatchThreshold(response[3]);
    };

    this.makeSelectFeatureDependencyPromises = function() {
      var companyPreferencesPayload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };

      return [
        companyPreferencesService.getCompanyPreferences(companyPreferencesPayload, _companyId),
        featureThresholdsFactory.getThresholdList('DAILYEXCHANGERATE', companyPreferencesPayload, _companyId),
        featureThresholdsFactory.getThresholdList('RECONCILIATION', companyPreferencesPayload, _companyId),
        featureThresholdsFactory.getThresholdList('STOREDISPATCH', companyPreferencesPayload, _companyId)
      ];
    };

    this.errorHandler = function(dataFromAPI) {
      angular.element('#loading').modal('hide');
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    $scope.cancel = function () {
      $this.showLoadingModal('Canceling ...');
      $scope.resetValues();

      eposConfigFactory.getModule($scope.selectedModule.id, $scope.selectedProductVersion.id).then($this.getModuleSuccess);
    };

    $scope.selectProductVersion = function () {
      $scope.resetValues();
      $scope.selectedModule = null;
      $scope.moduleConfiguration = null;
    };

    $scope.isUserAvailableForEditAndCreate = function () {
      var result = false;
      var userFeaturesInRole = $localStorage.featuresInRole;

      if (userFeaturesInRole.EPOSCONFIG && userFeaturesInRole.EPOSCONFIG.EPOSCONFIG) {
        var eposConfigRoleFeatures = userFeaturesInRole.EPOSCONFIG.EPOSCONFIG;

        _.forEach(eposConfigRoleFeatures, function(feature) {
          if (_.includes(feature.permissionCode, 'C') && _.includes(feature.permissionCode, 'U') && _.includes(feature.permissionCode, 'D')) {
            result = true;
          }
        });
      }

      return result;
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
      if ($scope.moduleConfiguration && $scope.moduleConfiguration.moduleVersions.length > 0 && $scope.moduleConfiguration.moduleVersions) {
        $scope.moduleOptions = _.filter($scope.moduleConfiguration.moduleVersions && $scope.moduleConfiguration.moduleVersions[0].moduleOptions, function(o) {
          return o.parentId === null;
        });

        $scope.moduleOptions = $this.sortModuleOptions($scope.moduleOptions);

        $this.initializeNgModel($scope.moduleConfiguration.moduleVersions[0].moduleOptions);
      }

      $this.hideLoadingModal();
    };

    this.sortModuleOptions = function(moduleOptions) {
      _.forEach(moduleOptions, function(option) {
        if (option.subModules && option.subModules.length > 0) {
          option.subModules = $this.sortModuleOptions(option.subModules);
        }
      });

      return _.orderBy(moduleOptions, ['displayOrder'], ['asc']);
    };

    this.createOrUpdateSuccess = function() {
      $this.hideLoadingModal();
      $scope.selectModule($scope.selectedModule);
    };

    $scope.isModuleConfigurationOptionsEmpty = function () {
      return $scope.moduleConfiguration && $scope.moduleConfiguration.moduleVersions.length === 0;
    };

    $scope.saveBackOfficeConfig = function () {
      // var payload = $this.constructUpsertPayload();

      $scope.formData;
      var i = 0;
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
      var promises = [
        eposConfigFactory.getProductVersions(),
        eposConfigFactory.getModules()
      ];
      return promises;
    };

    var getCompanyId = function () {
      if (globalMenuService.getCompanyData().companyTypeName === 'Retail') {
        return globalMenuService.getCompanyData().id;
      } else {
        return globalMenuService.getCompanyData().chCompany.companyId;
      }
    };

    this.init = function() {
      // $this.showLoadingModal('Loading Data');
      // var initPromises = $this.makeInitPromises();
      // $q.all(initPromises).then($this.initDependenciesSuccess, $this.initDependenciesError);
      _companyId = getCompanyId();
      $scope.configOptionDefinition = angular.copy(backOfficeConfigService.configFeatureOptionsDefinition());
    };

    this.init();

  });
