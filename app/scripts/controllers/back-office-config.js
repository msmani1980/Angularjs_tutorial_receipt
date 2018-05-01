'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:BackOfficeConfigCtrl
 * @description
 * # BackOfficeConfigCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('BackOfficeConfigCtrl', function ($scope, dateUtility, eposConfigFactory, $location, $routeParams, $q, $localStorage, _, lodash,
                                                backOfficeConfigService, companyPreferencesService, globalMenuService, featureThresholdsFactory, accessService, recordsService) {
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
    $scope.featureInfoMessages = [];
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

    $scope.isFeatureSelected = function () {
      return !!$scope.selectedFeature;
    };

    $scope.calculateTitle = function () {
      if ($scope.selectedFeature) {
        return 'Back Office Configuration - ' + $scope.selectedFeature.name;
      } else {
        return 'Back Office Configuration';
      }
    };

    $scope.toolTipMessage = function (option) {
      if (option.configSource === 'COMPANY_FEATURE') {
        if (option.featureCode && option.optionCode && option.choiceCode) {
          return $scope.featureInfoMessages[option.featureCode + '__' + option.optionCode + '__' + option.choiceCode];
        } else if (option.featureCode && option.optionCode) {
          return $scope.featureInfoMessages[option.featureCode + '__' + option.optionCode];
        } else {
          return option.featureCode;
        }
      } else if (option.configSource === 'SALES_THRESHOLD') {
        return option.info;
      }
    };

    $scope.calculateFormDataKeyForConfigOption = function (option) {
      if (option.configSource === 'COMPANY_FEATURE' && (option.inputType === 'RADIO_BUTTON' || option.inputType === 'NUMBER')) {
        return option.configSource + '__' + option.featureCode + '__' + option.optionCode + '__' + option.choiceCode;
      } else if (option.configSource === 'COMPANY_FEATURE' && option.inputType === 'SELECT') {
        return option.configSource + '__' + option.featureCode + '__' + option.optionCode;
      } else if (option.configSource === 'SALES_THRESHOLD') {
        return option.configSource + '__' + option.featureCode;
      }
    };

    $scope.selectFeature = function (feature, isLoadingModelAlreadyShown) {
      if (isLoadingModelAlreadyShown === false) {
        $this.showLoadingModal('Loading Data');
      }

      $scope.isFeatureOptionsLoadingInProgress = true;

      $scope.resetValues();

      $scope.selectFeatureHelper(feature);

      var dependencyPromises = $this.makeSelectFeatureDependencyPromises();
      $q.all(dependencyPromises).then($this.setDependencies, $this.errorHandler);
    };

    $scope.selectFeatureHelper = function (feature) {
      $scope.selectedFeature = feature;

      if ($scope.selectedFeature && $scope.selectedFeature.name === 'PreOrder Configuration') {
        $scope.configOptions = angular.copy($scope.configOptionDefinition.preOrderConfigOptions);
      } else if ($scope.selectedFeature && $scope.selectedFeature.name === 'Reconcile Configuration') {
        $scope.configOptions = angular.copy($scope.configOptionDefinition.reconcileConfigOptions);
      } else if ($scope.selectedFeature && $scope.selectedFeature.name === 'Cash Bag Configuration') {
        $scope.configOptions = angular.copy($scope.configOptionDefinition.cashBagConfigOptions);
      } else if ($scope.selectedFeature && $scope.selectedFeature.name === 'StationOps Configuration') {
        $scope.configOptions = angular.copy($scope.configOptionDefinition.stationOpsConfigOptions);
      }
    };

    this.setDependencies = function(response) {
      $this.setCompanyPreferences(response[0]);
      $this.setDailyExchangeRateThreshold(response[1]);
      $this.setReconciliationThreshold(response[2]);
      $this.setStoreDispatchThreshold(response[3]);

      $scope.populateFormData();

      $scope.isFeatureOptionsLoadingInProgress = false;
      $this.hideLoadingModal();

      setTimeout(function () {
        angular.element('.tooltip-focus').each(function (i, e) {
          angular.element(e).tooltip({ trigger: 'focus' });
        });
      },

        400);
    };

    this.setAvailableFeatures = function(reponseData) {
      $scope.featureInfoMessages = [];

      _.forEach(reponseData, function(feature) {
        _.forEach(feature.featureOptions, function(featureOption) {
          var featureAndFeatureChoiceInfoMessageKey =  feature.code + '__' + featureOption.optionCode;
          $scope.featureInfoMessages[featureAndFeatureChoiceInfoMessageKey] = feature.name + ' - ' + featureOption.optionName;

          _.forEach(featureOption.featureChoiceDOs, function(featureChoice) {
            var featureAndFeatureChoiceAndChoiceCodeInfoMessageKey =  featureAndFeatureChoiceInfoMessageKey + '__' + featureChoice.choiceCode;
            $scope.featureInfoMessages[featureAndFeatureChoiceAndChoiceCodeInfoMessageKey] = $scope.featureInfoMessages[featureAndFeatureChoiceInfoMessageKey] + ' - ' + featureChoice.choiceName;
          });
        });
      });
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

        if (featureOption.configSource === 'COMPANY_FEATURE') {
          $scope.populateCompanyFeatureFormData(featureOption);
        } else if (featureOption.configSource === 'SALES_THRESHOLD') {
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
      if (featureOption.choiceCode) {
        $scope.formData[featureOption.ngModelIdentifier].choiceCode = featureOption.choiceCode;
      }

      if (existingPreference) {
        $scope.populateCompanyFeatureFormDataHelper(featureOption, existingPreference);
      } else {
        $scope.formData[featureOption.ngModelIdentifier].value = null;
      }
    };

    $scope.populateCompanyFeatureFormDataHelper = function (featureOption, existingPreference) {
      $scope.formData[featureOption.ngModelIdentifier].id = existingPreference.id;

      if (featureOption.inputType === 'RADIO_BUTTON') {
        $scope.formData[featureOption.ngModelIdentifier].value = existingPreference.isSelected;
      } else if (featureOption.inputType === 'NUMBER') {
        $scope.formData[featureOption.ngModelIdentifier].value = existingPreference.numericValue;
      } else if (featureOption.inputType === 'SELECT') {
        $scope.formData[featureOption.ngModelIdentifier].value = existingPreference.choiceCode;
      }
    };

    $scope.populateSalesThresholdFormData = function (featureOption) {
      var existingPreference = $scope.findExistingSalesThresholdPreference(featureOption);

      $scope.formData[featureOption.ngModelIdentifier].configSource = featureOption.configSource;
      $scope.formData[featureOption.ngModelIdentifier].featureCode = featureOption.featureCode;
      $scope.formData[featureOption.ngModelIdentifier].inputType = featureOption.inputType;

      if (existingPreference) {
        $scope.formData[featureOption.ngModelIdentifier].id = existingPreference.id;
        $scope.formData[featureOption.ngModelIdentifier].value = existingPreference.percentage;
        $scope.formData[featureOption.ngModelIdentifier].startDate = dateUtility.formatDateForApp(existingPreference.startDate);
      } else {
        $scope.formData[featureOption.ngModelIdentifier].startDate = dateUtility.nowFormattedDatePicker();
        $scope.formData[featureOption.ngModelIdentifier].value = null;
      }
    };

    $scope.findExistingCompanyFeaturePreference = function (featureOption) {
      return _.find($scope.companyPreferences, function(preference) {
        return featureOption.featureCode === preference.featureCode && featureOption.optionCode === preference.optionCode;
      });
    };

    $scope.findExistingSalesThresholdPreference = function (featureOption) {
      if (featureOption.featureCode === 'RECONCILIATION') {
        return _.find($scope.reconciliationThresHold, function(preference) {
          return featureOption.featureCode === preference.featureCode;
        });
      } else if (featureOption.featureCode === 'DAILYEXCHANGERATE') {
        return _.find($scope.dailyExchangeThresHold, function(preference) {
          return featureOption.featureCode === preference.featureCode;
        });
      } else if (featureOption.featureCode === 'STOREDISPATCH') {
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

    this.resetErrors = function() {
      $scope.displayError = false;
      $scope.errorResponse = [];
    };

    $scope.cancel = function () {
      $this.showLoadingModal('Canceling ...');
      $this.resetErrors();
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

    this.createOrUpdateSuccess = function() {
      $scope.selectFeature($scope.selectedFeature, true);
    };

    $scope.isModuleConfigurationOptionsEmpty = function () {
      return $scope.moduleConfiguration && $scope.moduleConfiguration.moduleVersions.length === 0;
    };

    $scope.saveBackOfficeConfig = function () {
      $this.showLoadingModal('Saving');
      $this.resetErrors();

      var promises = [];

      var companyPreferencePayload = $this.constructSaveOrUpdateDataForCompanyPreference($scope.formData);
      var salesThresholdPayload = $this.constructPayloadForSalesThreshold($scope.formData);

      promises.push(companyPreferencesService.createOrUpdateCompanyPreference(companyPreferencePayload, _companyId));
      _.forEach(salesThresholdPayload, function(payload) {
        if (payload.id) {
          promises.push(featureThresholdsFactory.updateThreshold(payload.featureCode, payload, payload.id));
        } else {
          promises.push(featureThresholdsFactory.createThreshold(payload.featureCode, payload));
        }
      });

      $q.all(promises).then($this.createOrUpdateSuccess, $this.errorHandler);
    };

    this.constructPayloadForSalesThreshold = function(formData) {
      var result = [];

      _.forEach(_.values(formData), function(data) {
        var payload = {};

        if (data.configSource !== 'SALES_THRESHOLD') {
          return;
        }

        payload.companyId = _companyId;
        payload.percentage = data.value;
        payload.featureCode = data.featureCode;
        payload.startDate = dateUtility.formatDateForAPI(data.startDate);
        if (data.id) {
          payload.id = data.id;
        }

        result.push(payload);
      });

      return result;
    };

    this.constructSaveOrUpdateDataForCompanyPreference = function(formData) {
      var result = [];

      _.forEach(_.values(formData), function(data) {
        var payload = {};

        if (data.configSource !== 'COMPANY_FEATURE') {
          return;
        }

        payload.companyId = _companyId;
        payload.featureCode = data.featureCode;
        payload.optionCode = data.optionCode;
        if (data.id) {
          payload.companyPortalFeatureChoiceId = data.id;
        }

        if (data.inputType === 'RADIO_BUTTON') {
          payload.isSelected = data.value;
          payload.choiceCode = data.choiceCode;
        } else if (data.inputType === 'NUMBER') {
          payload.isSelected = true;
          payload.choiceCode = data.choiceCode;
          payload.numericValue = data.value;
        } else if (data.inputType === 'SELECT') {
          payload.isSelected = true;
          payload.choiceCode = data.value;
        }

        result.push(payload);
      });

      return result;
    };

    this.initDependenciesError = function(errorResponse) {
      $scope.errorResponse = errorResponse[0];
      $scope.displayError = true;
      $this.hideLoadingModal();
    };

    this.initSuccess = function(response) {
      _companyId = getCompanyId();
      $scope.configOptionDefinition = angular.copy(backOfficeConfigService.configFeatureOptionsDefinition());
      $scope.isCRUD = accessService.crudAccessGranted('BACKOFFICECONFIG', 'BACKOFFICECONFIG', 'BACKOFFICECONFIG');

      $this.setAvailableFeatures(response);
    };

    var getCompanyId = function () {
      if (globalMenuService.getCompanyData().companyTypeName === 'Retail') {
        return globalMenuService.getCompanyData().id;
      } else {
        return globalMenuService.getCompanyData().chCompany.companyId;
      }
    };

    this.init = function() {
      recordsService.getFeatures().then($this.initSuccess, $this.initDependenciesError);
    };

    this.init();
  });
