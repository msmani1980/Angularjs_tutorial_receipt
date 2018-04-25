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

    $scope.isFeatureOptionsLoadingInProgress = false;
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

    $scope.resetValues = function () {
      $scope.formData = {};
      $scope.configOptions = [];
      $scope.companyPreferences = [];
      $scope.dailyExchangeThresHold = [];
      $scope.reconciliationThresHold = [];
      $scope.storeDispatchThresHold = [];
    };

    $scope.calculateTitle = function () {
      if($scope.selectedFeature) {
        return 'Back Office Configuration - ' + $scope.selectedFeature.name;
      } else {
        return 'Back Office Configuration';
      }
    };

    $scope.calculateFormDataKeyForConfigOption = function (option) {
      if(option.configSource === 'COMPANY_FEATURE' && (option.inputType === 'RADIO_BUTTON' || option.inputType === 'NUMBER')) {
        return option.configSource + '__' + option.featureCode + '__' + option.optionCode + '__' + option.choiceCode;
      } else if(option.configSource === 'COMPANY_FEATURE' && option.inputType === 'SELECT') {
        return option.configSource + '__' + option.featureCode + '__' + option.optionCode;
      } else if(option.configSource === 'SALES_THRESHOLD') {
        return option.configSource + '__' + option.featureCode;
      }
    };

    $scope.selectFeature = function (feature, isLoadingModelAlreadyShown) {
      if(isLoadingModelAlreadyShown === false) {
        $this.showLoadingModal('Loading Data');
      }

      $scope.isFeatureOptionsLoadingInProgress = true;

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
    };

    this.setDependencies = function(response) {
      $this.setCompanyPreferences(response[0]);
      $this.setDailyExchangeRateThreshold(response[1]);
      $this.setReconciliationThreshold(response[2]);
      $this.setStoreDispatchThreshold(response[3]);

      $scope.populateFormData();

      $scope.isFeatureOptionsLoadingInProgress = false;
      $this.hideLoadingModal();
    };

    this.setCompanyPreferences = function(reponseData) {
      var orderedPreferences = lodash.sortByOrder(angular.copy(reponseData.preferences), 'startDate', 'desc');

      $scope.companyPreferences = angular.copy(orderedPreferences);
    };

    this.setDailyExchangeRateThreshold = function(reponseData) {
      var orderedThresholds = lodash.sortByOrder(angular.copy(reponseData.response), 'startDate', 'desc');

      $scope.dailyExchangeThresHold = angular.copy(orderedThresholds);
    };

    this.setReconciliationThreshold = function(reponseData) {
      var orderedThresholds = lodash.sortByOrder(angular.copy(reponseData.response), 'startDate', 'desc');

      $scope.reconciliationThresHold = angular.copy(orderedThresholds);
    };

    this.setStoreDispatchThreshold = function(reponseData) {
      var orderedThresholds = lodash.sortByOrder(angular.copy(reponseData.response), 'startDate', 'desc');

      $scope.storeDispatchThresHold = angular.copy(orderedThresholds);
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

    $scope.populateFormData = function () {
      _.forEach($scope.configOptions, function(featureOption) {
        featureOption.ngModelIdentifier = $scope.calculateFormDataKeyForConfigOption(featureOption);
        $scope.formData[featureOption.ngModelIdentifier] = {};

        if(featureOption.configSource === 'COMPANY_FEATURE') {
          $scope.populateCompanyFeatureFormData(featureOption);
        } else if(featureOption.configSource === 'SALES_THRESHOLD') {
          $scope.populateSalesThresholdFormData(featureOption);
        }
      });
    };

    $scope.populateCompanyFeatureFormData = function (featureOption) {
      var existingPreference = $scope.findExistingCompanyFeaturePreference(featureOption);

      $scope.formData[featureOption.ngModelIdentifier].configSource = featureOption.configSource;
      $scope.formData[featureOption.ngModelIdentifier].featureCode = featureOption.featureCode;
      $scope.formData[featureOption.ngModelIdentifier].optionCode = featureOption.optionCode;
      $scope.formData[featureOption.ngModelIdentifier].inputType = featureOption.inputType;
      if(featureOption.choiceCode) {
        $scope.formData[featureOption.ngModelIdentifier].choiceCode = featureOption.choiceCode;
      }

      if(existingPreference) {
        $scope.formData[featureOption.ngModelIdentifier].id = existingPreference.id;
        $scope.formData[featureOption.ngModelIdentifier].startDate = dateUtility.formatDateForApp(existingPreference.startDate);

        if(featureOption.inputType === 'RADIO_BUTTON') {
          $scope.formData[featureOption.ngModelIdentifier].value = existingPreference.isSelected;
        } else if(featureOption.inputType === 'NUMBER') {
          $scope.formData[featureOption.ngModelIdentifier].value = existingPreference.numericValue;
        } else if(featureOption.inputType === 'SELECT') {
          $scope.formData[featureOption.ngModelIdentifier].value = existingPreference.choiceCode;
        }
      } else {
        $scope.formData[featureOption.ngModelIdentifier].value = null;
      }
    };

    $scope.populateSalesThresholdFormData = function (featureOption) {
      var existingPreference = $scope.findExistingSalesThresholdPreference(featureOption);

      $scope.formData[featureOption.ngModelIdentifier].configSource = featureOption.configSource;
      $scope.formData[featureOption.ngModelIdentifier].featureCode = featureOption.featureCode;
      $scope.formData[featureOption.ngModelIdentifier].inputType = featureOption.inputType;


      if(existingPreference) {
        $scope.formData[featureOption.ngModelIdentifier].id = existingPreference.id;
        $scope.formData[featureOption.ngModelIdentifier].startDate = dateUtility.formatDateForApp(existingPreference.startDate);
        $scope.formData[featureOption.ngModelIdentifier].value = existingPreference.percentage;
      } else {
        $scope.formData[featureOption.ngModelIdentifier].value = null;
      }
    };

    $scope.findExistingCompanyFeaturePreference = function (featureOption) {
      return _.find($scope.companyPreferences, function(preference) {
        return featureOption.featureCode === preference.featureCode && featureOption.optionCode === preference.optionCode;
      });
    };

    $scope.findExistingSalesThresholdPreference = function (featureOption) {
      if(featureOption.featureCode === 'RECONCILIATION') {
        return _.find($scope.reconciliationThresHold, function(preference) {
          return featureOption.featureCode === preference.featureCode;
        });
      } else if(featureOption.featureCode === 'DAILYEXCHANGERATE') {
        return _.find($scope.dailyExchangeThresHold, function(preference) {
          return featureOption.featureCode === preference.featureCode;
        });
      } else if(featureOption.featureCode === 'STOREDISPATCH') {
        return _.find($scope.storeDispatchThresHold, function(preference) {
          return featureOption.featureCode === preference.featureCode;
        });
      }
    };


    this.errorHandler = function(dataFromAPI) {
      angular.element('#loading').modal('hide');
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    $scope.cancel = function () {
      $this.showLoadingModal('Canceling ...');
      $scope.resetValues();
      $scope.selectedFeature = null;
      $this.hideLoadingModal();
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

    this.createOrUpdateSuccess = function(dataFromApi) {
      $scope.selectFeature($scope.selectedFeature, true);
    };

    $scope.isModuleConfigurationOptionsEmpty = function () {
      return $scope.moduleConfiguration && $scope.moduleConfiguration.moduleVersions.length === 0;
    };

    $scope.saveBackOfficeConfig = function () {
      $this.showLoadingModal('Saving');

      var companyPreferencePayload = $this.constructSaveOrUpdateDataForCompanyPreference($scope.formData);

      companyPreferencesService.createOrUpdateCompanyPreference(companyPreferencePayload, _companyId).then($this.createOrUpdateSuccess, $this.errorHandler);
    };

    this.constructSaveOrUpdateDataForCompanyPreference = function(formData) {
        var result = [];

      _.forEach(_.values(formData), function(data) {
        var payload = {};

        if(data.configSource !== 'COMPANY_FEATURE') {
          return;
        }

        payload.companyId = _companyId;
        payload.featureCode = data.featureCode;
        payload.optionCode = data.optionCode;
        payload.startDate = dateUtility.formatDateForAPI(data.startDate);
        if(data.id) {
          payload.companyPortalFeatureChoiceId = data.id;
        }

        if(data.inputType === 'RADIO_BUTTON') {
          payload.isSelected = data.value;
          payload.choiceCode = data.choiceCode;
        } else if(data.inputType === 'NUMBER') {
          payload.isSelected = true;
          payload.choiceCode = data.choiceCode;
          payload.numericValue = data.value;
        } else if(data.inputType === 'SELECT') {
          payload.isSelected = true;
          payload.choiceCode = data.value;
        }

        result.push(payload);
      });

      return result;
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

    var getCompanyId = function () {
      if (globalMenuService.getCompanyData().companyTypeName === 'Retail') {
        return globalMenuService.getCompanyData().id;
      } else {
        return globalMenuService.getCompanyData().chCompany.companyId;
      }
    };

    this.init = function() {
      _companyId = getCompanyId();
      $scope.configOptionDefinition = angular.copy(backOfficeConfigService.configFeatureOptionsDefinition());
    };

    this.init();
  });
