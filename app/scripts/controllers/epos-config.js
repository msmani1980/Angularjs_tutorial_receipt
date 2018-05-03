'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EposConfigCtrl
 * @description
 * # EposConfigCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EposConfigCtrl', function ($scope, $rootScope, dateUtility, eposConfigFactory, $location, $routeParams, $q, $localStorage, _, accessService) {
    var companyId;
    var $this = this;

    $scope.viewName = 'ePOS Configuration';
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
    $scope.initialRadioButtonModuleOptionPopulatedIds = {};
    $scope.initialCheckBoxModuleOptionPopulatedIds = {};
    $scope.isCRUD = false;

    $rootScope.$on('eposConfigurationInputChanged', function(event, e){
      var changedModuleOption = e.module;

      $this.normalizeSelectionOfParentsAndChildren(changedModuleOption);
    });

    this.normalizeSelectionOfParentsAndChildren = function (changedModuleOption) {
      var parents = _.reject($this.findModuleParents(changedModuleOption), { optionTypeId: 3 });
      var children = _.reject($this.findModuleChildren(changedModuleOption),{ optionTypeId: 3 });

      

      console.log(parents)
      console.log(children)

      // TODO: filter for radio and check boxes, select all parents if child is selected, deselet all children if parent is deselected
    };

    this.findModuleById = function (moduleOptions, id) {
      for (var i = 0; i < moduleOptions.length; i++) {
        var moduleOption = moduleOptions[i];

        if (moduleOption.id === id) {
          return moduleOption;
        }

        var result = $this.findModuleById(moduleOption.subModules, id);
        if (result) {
          return result;
        }
      }
    };

    this.findModuleParents = function (module) {
      var parents = [];
      var currentParentId = module.parentId;

      while(currentParentId) {
        var currentModule = $this.findModuleById($scope.moduleOptions, currentParentId);

        if (currentModule) {
          parents.push(currentModule);
          currentParentId = currentModule.parentId;
        } else {
          currentParentId = null;
        }
      }

      return parents;
    };

    this.findModuleChildren = function (module) {
      var children = [];
      var subModules = module.subModules;

      subModules.forEach(function (subModule) {
        children.push(subModule);
        children = children.concat($this.findModuleChildren(subModule));
      });

      return children;
    };

    $scope.$watch('selectedProductVersion', function (newProductVersion) {
      if (!newProductVersion) {
        $scope.selectedModule = null;
        $scope.moduleConfiguration = null;
      }
    });

    $scope.resetValues = function () {
      $scope.initialRadioButtonModuleOptionPopulatedIds = {};
      $scope.initialCheckBoxModuleOptionPopulatedIds = {};
      $scope.moduleOptionValues = {
        checkbox: {},
        text: {},
        radioButton: {}
      };
      $scope.moduleOptions = null;
    };

    $scope.selectModule = function (module) {
      $this.showLoadingModal('Loading Data');
      $scope.resetValues();

      $scope.selectedModule = module;

      eposConfigFactory.getModule(module.id, $scope.selectedProductVersion.id).then($this.getModuleSuccess);
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
      return $scope.isCRUD;
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.getProductVersionsSuccess = function(dataFromAPI) {
      var versions = angular.copy(dataFromAPI.response).map(function (productVersion) {
        productVersion.displayName = productVersion.majorVersion + '.' + productVersion.minorVersion + '.' + productVersion.revision + '.' + productVersion.build;

        return productVersion;
      });

      $scope.productVersions = _.orderBy(versions, ['build'], ['desc']);

      if ($scope.productVersions && $scope.productVersions.length > 0) {
        $scope.selectedProductVersion = $scope.productVersions[0];
      }
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

    this.initializeNgModel = function(moduleOptions) {
      _.forEach(moduleOptions, function(option) {
        if (Array.isArray(option.selected) && option.selected.length > 0) {
          $this.initializeNgModelSingleOptionHelper(option);
        }
      });
    };

    this.initializeNgModelSingleOptionHelper = function(option) {
      if (option.optionTypeId === 1) { // CheckBox
        $scope.moduleOptionValues.checkbox[option.id.toString()] = true;
        $scope.initialCheckBoxModuleOptionPopulatedIds[option.id] = true;
      } else if (option.optionTypeId === 2) { // Radio Button
        var nameAttribute = option.parentId ? option.parentId.toString() : 'null';

        $scope.moduleOptionValues.radioButton[nameAttribute] = option.id;
        $scope.initialRadioButtonModuleOptionPopulatedIds[option.id] = true;
      } else if (option.optionTypeId === 3) { // Text
        $scope.moduleOptionValues.text[option.id.toString()] = option.selected[0];
      }
    };

    $scope.isModuleConfigurationOptionsEmpty = function () {
      return $scope.moduleConfiguration && $scope.moduleConfiguration.moduleVersions.length === 0;
    };

    $scope.saveModuleOptions = function () {
      var payload = $this.constructUpsertPayload();

      $this.showLoadingModal('Saving Data');

      eposConfigFactory.createOrUpdate(payload).then($this.createOrUpdateSuccess);
    };

    this.constructUpsertPayload = function() {
      var payload = [];

      // Populate update/create payload
      _.forEach($scope.moduleOptionValues.checkbox, function(value, index) {
        var payloadCheckBoxItem = {
          moduleOptionId: parseInt(index)
        };
        if (value === false && $scope.initialCheckBoxModuleOptionPopulatedIds[index]) {
          payloadCheckBoxItem.isActive = false;
          payload.push(payloadCheckBoxItem);
        } else if (value === true) {
          payload.push(payloadCheckBoxItem);
        }
      });

      _.forEach($scope.moduleOptionValues.radioButton, function(value) {
        payload.push({
            moduleOptionId: parseInt(value)
          }
        );
      });

      _.forEach($scope.moduleOptionValues.text, function(value, index) {
        payload.push({
            moduleOptionId:  parseInt(index),
            value: value
          }
        );
      });

      // Populate delete payload
      var currentlyRadioButtonModuleOptionPopulatedIds = $this.getCurrentlyRadioButtonsModuleOptionPopulatedIds();
      _.forEach($scope.initialRadioButtonModuleOptionPopulatedIds, function(value, index) {
        if (!currentlyRadioButtonModuleOptionPopulatedIds.includes(parseInt(index))) {
          payload.push({
              moduleOptionId:  parseInt(index),
              isActive: false
            }
          );
        }
      });

      return payload;
    };

    this.getCurrentlyRadioButtonsModuleOptionPopulatedIds = function() {
      var currentlyModuleOptionPopulatedIds = [];
      _.forEach(Object.values($scope.moduleOptionValues.radioButton), function(value) {
        currentlyModuleOptionPopulatedIds.push(parseInt(value));
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

      $scope.isCRUD = accessService.crudAccessGranted('EPOSCONFIG', 'EPOSCONFIG', 'EPOSCONFIG');

      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess, $this.initDependenciesError);
    };

    this.init();
  });
