'use strict';

describe('the Store Instance Seals controller', function() {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/seal-types.json',
    'served/seal-colors.json',
    'served/store-instance-seals.json'
  ));

  var StoreInstanceSealsCtrl;
  var $scope;
  var templateCache;
  var compile;
  var storeDetailsJSON;
  var storeInstanceFactory;
  var storeInstanceDispatchWizardConfig;
  var routeParams;
  var getStoreDetailsDeferred;
  var storeId;
  var sealTypesService;
  var sealTypesJSON;
  var getSealTypesDeferred;
  var sealColorsService;
  var sealColorsJSON;
  var getSealColorsDeferred;
  var storeInstanceSealsJSON;

  beforeEach(inject(function($injector, $rootScope, $controller, $q, ngToast, _servedSealTypes_, _servedSealColors_,
    _servedStoreInstanceSeals_) {

    sealTypesJSON = _servedSealTypes_;
    sealColorsJSON = _servedSealColors_;
    storeInstanceSealsJSON = _servedStoreInstanceSeals_;

    storeId = 5;

    $scope = $rootScope.$new();

    templateCache = $injector.get('$templateCache');
    routeParams = $injector.get('$routeParams');
    compile = $injector.get('$compile');

    storeInstanceFactory = $injector.get('storeInstanceFactory');
    storeInstanceDispatchWizardConfig = $injector.get('storeInstanceDispatchWizardConfig');
    sealTypesService = $injector.get('sealTypesService');
    sealColorsService = $injector.get('sealColorsService');

    getStoreDetailsDeferred = $q.defer();
    getSealTypesDeferred = $q.defer();
    getSealColorsDeferred = $q.defer();

    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);
    spyOn(sealTypesService, 'getSealTypes').and.returnValue(getSealTypesDeferred.promise);
    spyOn(sealColorsService, 'getSealColors').and.returnValue(getSealColorsDeferred.promise);

    StoreInstanceSealsCtrl = $controller('StoreInstanceSealsCtrl', {
      $scope: $scope,
      $routeParams: {
        storeId: storeId
      }
    });

  }));

  function renderView() {
    var html = templateCache.get('/views/store-instance-seals.html');
    var compiled = compile(angular.element(html))($scope);
    var view = angular.element(compiled[0]);
    $scope.$digest();
    return view;
  }

  function mockFormSubmission(form, saveAndExit) {
    form.triggerHandler('submit');
    $scope.submitForm((saveAndExit ? saveAndExit : false));
    $scope.$digest();
  }

  describe('when controller executes', function() {

    beforeEach(function() {
      $scope.$digest();
    });

    it('should set wizardSteps', function() {
      var wizardSteps = storeInstanceDispatchWizardConfig.getSteps(storeId);
      expect($scope.wizardSteps).toEqual(wizardSteps);
    });

    describe('the get store details API call', function() {

      beforeEach(function() {
        storeDetailsJSON = {
          LMPStation: 'ORD',
          storeNumber: '180485',
          scheduleDate: '2015-08-13',
          scheduleNumber: 'SCHED123',
          storeInstanceNumber: $scope.storeId
        };
        getStoreDetailsDeferred.resolve(storeDetailsJSON);
        $scope.$digest();
      });

      it('should get the store details', function() {
        expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith(storeId);
      });

      it('should attach all properties of JSON to scope', function() {
        expect($scope.storeDetails).toEqual(storeDetailsJSON);
      });

      it('should set wizardSteps', function() {
        var wizardSteps = storeInstanceDispatchWizardConfig.getSteps(storeId);
        expect($scope.wizardSteps).toEqual(wizardSteps);
      });

    });

    describe('the get sealType API call', function() {

      beforeEach(function() {
        getSealTypesDeferred.resolve(sealTypesJSON);
        $scope.$digest();
      });

      it('should get the seal types', function() {
        expect(sealTypesService.getSealTypes).toHaveBeenCalled();
      });

      it('should attach all properties of JSON to scope', function() {
        expect($scope.sealTypes).toEqual(sealTypesJSON);
      });

    });

    describe('the get sealColor API call', function() {

      beforeEach(function() {
        getSealColorsDeferred.resolve(sealColorsJSON);
        $scope.$digest();
      });

      it('should get the seal types', function() {
        expect(sealColorsService.getSealColors).toHaveBeenCalled();
      });

      it('should attach all properties of JSON to scope', function() {
        expect($scope.sealColorsList).toEqual(sealColorsJSON.response);
      });

    });

    describe('the getSealTypesDependencies method', function() {

      beforeEach(function() {
        storeDetailsJSON = {
          LMPStation: 'ORD',
          storeNumber: '180485',
          scheduleDate: '2015-08-13',
          scheduleNumber: 'SCHED123',
          storeInstanceNumber: $scope.storeId
        };

        getSealColorsDeferred.resolve(sealColorsJSON);
        getSealTypesDeferred.resolve(sealTypesJSON);
        getStoreDetailsDeferred.resolve(storeDetailsJSON);

        spyOn(StoreInstanceSealsCtrl, 'generateSealTypeObject').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'addSealTypeActions').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'createHandoverActions').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'createInboundActions').and.callThrough();
        $scope.$digest();
      });

      it('should get the seal types', function() {
        expect(StoreInstanceSealsCtrl.generateSealTypeObject).toHaveBeenCalled();
      });

      it('should set sealTypesList id to 1', function() {
        expect($scope.sealTypesList[0].id).toBe(1);
      });

      it('should set sealTypesList name to Outbound', function() {
        expect($scope.sealTypesList[0].name).toBe('Outbound');
      });

      it('should defined sealTypesList.color', function() {
        expect($scope.sealTypesList[0].color).toBeDefined();
      });

      it('should defined sealTypesList.actions', function() {
        expect($scope.sealTypesList[1].actions).toBeDefined();
      });

      it('should defined sealTypesList.required', function() {
        expect($scope.sealTypesList[1].required).toBeDefined();
      });

      it('should call the addSealTypeActions function', function() {
        expect(StoreInstanceSealsCtrl.addSealTypeActions).toHaveBeenCalled();
      });

      it('should create the actions for the Handover seal', function() {
        var mockActions = [{
          label: 'Copy From Outbound',
          trigger: function() {
            return $scope.copySeals('Outbound', 'Hand Over');
          }
        }];
        var createdAction = StoreInstanceSealsCtrl.createHandoverActions();
        expect(createdAction.label).toEqual(mockActions.label);
        expect(createdAction.trigger).toEqual(mockActions.trigger);
      });

      it('should create the actions for the Inbound seal', function() {
        var mockActions = [{
          label: 'Copy From Hand Over',
          trigger: function() {
            return $scope.copySeals('Hand Over', 'Inbound');
          }
        }, {
          label: 'Copy From Outbound',
          trigger: function() {
            return $scope.copySeals('Outbound', 'Inbound');
          }
        }];
        var createdAction = StoreInstanceSealsCtrl.createInboundActions();
        expect(createdAction.label).toEqual(mockActions.label);
        expect(createdAction.trigger).toEqual(mockActions.trigger);
      });

    });

    describe('the resetErrors method', function() {

      beforeEach(function() {
        $scope.formErrors = ['error'];
        $scope.errorCustom = ['error'];
        $scope.displayError = true;
        $scope.response500 = true;
        spyOn(StoreInstanceSealsCtrl, 'resetErrors').and.callThrough();
        StoreInstanceSealsCtrl.resetErrors();
      });

      it('should have been called', function() {
        expect(StoreInstanceSealsCtrl.resetErrors).toHaveBeenCalled();
      });

      it('should clear formErrors', function() {
        expect($scope.formErrors.length).toBe(0);
      });

      it('should clear errorCustom', function() {
        expect($scope.errorCustom.length).toBe(0);
      });

      it('should set displayError to false', function() {
        expect($scope.displayError).toBeFalsy();
      });

      it('should set response500 to false', function() {
        expect($scope.response500).toBeFalsy();
      });

    });

    describe('The save and exit functionality', function() {

      var view;
      var form;

      beforeEach(function() {
        spyOn($scope, 'submitForm');
        // TODO: extend tests to call through to assign Seals
        $scope.$digest();
        view = renderView();
        form = angular.element(view.find('form')[0]);
      });

      it('should call the submitForm method with the saveAndExit flag set as true', function() {
        $scope.saveAndExit();
        expect($scope.submitForm).toHaveBeenCalledWith(true);
      });

    });

    describe('The validateForm method', function() {

      var view;
      var form;

      beforeEach(function() {
        storeDetailsJSON = {
          LMPStation: 'ORD',
          storeNumber: '180485',
          scheduleDate: '2015-08-13',
          scheduleNumber: 'SCHED123',
          storeInstanceNumber: $scope.storeId
        };

        getSealColorsDeferred.resolve(sealColorsJSON);
        getSealTypesDeferred.resolve(sealTypesJSON);
        getStoreDetailsDeferred.resolve(storeDetailsJSON);

        spyOn(StoreInstanceSealsCtrl, 'generateSealTypeObject').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'addSealTypeActions').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'createHandoverActions').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'createInboundActions').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'validateForm').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'resetErrors').and.callThrough();
        spyOn($scope, 'validateSeals').and.callThrough();

        $scope.$digest();
        view = renderView();
        form = angular.element(view.find('form')[0]);
        mockFormSubmission(form);
      });

      it('should have called the validateForm method', function() {
        expect(StoreInstanceSealsCtrl.validateForm).toHaveBeenCalled();
      });

      it('should have called the resetErrors method', function() {
        expect(StoreInstanceSealsCtrl.resetErrors).toHaveBeenCalled();
      });

      it('should have called validateSeals with sealTypesList', function() {
        expect($scope.validateSeals).toHaveBeenCalledWith($scope.sealTypesList[0]);
      });


    });

  });

  // sorry kelly
  describe('when view renders', function() {

    var view;
    beforeEach(function() {
      view = renderView();
      $scope.assignSealsForm = view.find('form')[0];
    });

    it('should render the view template', function() {
      expect(view).toBeDefined();
    });

    it('should have a step-wizard directive in the view', function() {
      expect(view.find('step-wizard')[0]).toBeDefined();
    });

    it('should have a error-dialog directive in the view', function() {
      expect(view.find('error-dialog')[0]).toBeDefined();
    });

    it('should have at least one seal-type directive in the view', function() {
      $scope.sealTypesList = [{
        name: 'Outbound',
        color: '#00B200',
        seals: {
          numbers: []
        }
      }, {
        name: 'Hand Over',
        color: '#E5E500',
        seals: {
          numbers: []
        },
        actions: [{
          label: 'Copy From Outbound',
          trigger: function() {
            return $scope.copySeals('Outbound', 'Hand Over');
          }
        }]
      }];
      $scope.$digest();
      expect(view.find('seal-type').length).toEqual(2);
    });

  });

});
