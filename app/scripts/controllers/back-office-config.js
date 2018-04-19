'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:BackOfficeConfigCtrl
 * @description
 * # BackOfficeConfigCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('BackOfficeConfigCtrl', function ($scope, dateUtility, eposConfigFactory, $location, $routeParams, $q, $localStorage, _) {
    var companyId;
    var $this = this;

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

    $scope.radioButtonValues = [
      {
        name: 'True',
        value: true
      },
      {
        name: 'False',
        value: false
      }
    ];

    $scope.configOptions = [];

    $scope.cashBagConfigOptions = [
      {
        name: 'Cashless Company',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'cashLessCompany',
        values: angular.copy($scope.radioButtonValues)
      }
    ];

    $scope.preOrderConfigOptions = [
      {
        name: 'PreOrder Configuration',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'preorder',
        values: angular.copy($scope.radioButtonValues)
      }
    ];

    $scope.reconcileConfigOptions = [
      {
        name: 'Confirmation Threshold',
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'confirmationThreshold'
      },
      {
        name: 'Amend-Amend Required to Confirm',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendRequiredToConfirm',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Amend Auto Delete CashBag',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoDeleteCashBag',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Amend Auto Merge CashBag',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoMergeCashBag',
        values: angular.copy($scope.radioButtonValues)
      }
    ];


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

    $scope.selectFeature = function (feature) {
      $this.showLoadingModal('Loading Data');

      $scope.resetValues();

      $scope.selectedFeature = feature;

      if($scope.selectedFeature && $scope.selectedFeature.name === 'PreOrder Configuration') {
        $scope.configOptions = angular.copy($scope.preOrderConfigOptions);
      } else if($scope.selectedFeature && $scope.selectedFeature.name === 'Reconcile Configuration') {
        $scope.configOptions = angular.copy($scope.reconcileConfigOptions);
      }

      $this.hideLoadingModal();
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

    $scope.saveModuleOptions = function () {
      var payload = $this.constructUpsertPayload();

      $this.showLoadingModal('Saving Data');

      eposConfigFactory.createOrUpdate(payload).then($this.createOrUpdateSuccess);
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
      // $this.showLoadingModal('Loading Data');
      // var initPromises = $this.makeInitPromises();
      // $q.all(initPromises).then($this.initDependenciesSuccess, $this.initDependenciesError);
    };

    this.init();

  });
