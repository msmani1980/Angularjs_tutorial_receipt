'use strict';

describe('the Store Instance Seals controller', function() {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/seal-types.json',
    'served/seal-colors.json',
    'served/store-instance-seals.json',
    'served/store-instance-seals-created.json',
    'served/store-instance-details.json'
  ));

  var StoreInstanceSealsCtrl;
  var $scope;
  var templateCache;
  var compile;
  var storeDetailsJSON;
  var storeInstanceFactory;
  var storeInstanceWizardConfig;
  var getStoreDetailsDeferred;
  var storeId;
  var routeParams;
  var sealTypesService;
  var sealTypesJSON;
  var getSealTypesDeferred;
  var sealColorsService;
  var sealColorsJSON;
  var getSealColorsDeferred;
  var storeInstanceSealsJSON;
  var createStoreInstanceSealDeferred;
  var deleteStoreInstanceSealDeferred;
  var storeInstanceSealService;
  var storeInstanceSealsCreatedJSON;
  var storeInstanceAssignSealsFactory;
  var location;
  var httpBackend;
  var updateStoreInstanceStatusDeferred;
  var getStoreInstanceSealsDeferred;
  var controller;

  beforeEach(inject(function($injector, $rootScope, $controller, $q, $httpBackend, $location, ngToast,
    _servedSealTypes_, _servedSealColors_,
    _servedStoreInstanceSeals_, _servedStoreInstanceSealsCreated_, _servedStoreInstanceDetails_) {

    storeDetailsJSON = _servedStoreInstanceDetails_;
    sealTypesJSON = _servedSealTypes_;
    sealColorsJSON = _servedSealColors_;
    storeInstanceSealsJSON = _servedStoreInstanceSeals_;
    storeInstanceSealsCreatedJSON = _servedStoreInstanceSealsCreated_;

    storeId = 5;

    $scope = $rootScope.$new();

    templateCache = $injector.get('$templateCache');
    routeParams = $injector.get('$routeParams');
    compile = $injector.get('$compile');

    storeInstanceFactory = $injector.get('storeInstanceFactory');
    storeInstanceWizardConfig = $injector.get('storeInstanceWizardConfig');
    sealTypesService = $injector.get('sealTypesService');
    sealColorsService = $injector.get('sealColorsService');
    storeInstanceSealService = $injector.get('storeInstanceSealService');
    storeInstanceAssignSealsFactory = $injector.get('storeInstanceAssignSealsFactory');
    location = $location;
    httpBackend = $httpBackend;
    controller = $controller;

    getStoreDetailsDeferred = $q.defer();
    getSealTypesDeferred = $q.defer();
    getSealColorsDeferred = $q.defer();
    getStoreInstanceSealsDeferred = $q.defer();

    createStoreInstanceSealDeferred = $q.defer();
    deleteStoreInstanceSealDeferred = $q.defer();
    updateStoreInstanceStatusDeferred = $q.defer();

    spyOn(storeInstanceAssignSealsFactory, 'getStoreInstanceSeals').and.returnValue(getStoreInstanceSealsDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);
    spyOn(sealTypesService, 'getSealTypes').and.returnValue(getSealTypesDeferred.promise);
    spyOn(sealColorsService, 'getSealColors').and.returnValue(getSealColorsDeferred.promise);

    spyOn(storeInstanceFactory, 'updateStoreInstanceStatus').and.returnValue(
      updateStoreInstanceStatusDeferred.promise);
    spyOn(storeInstanceAssignSealsFactory, 'createStoreInstanceSeal').and.returnValue(
      createStoreInstanceSealDeferred.promise);
    spyOn(storeInstanceAssignSealsFactory, 'deleteStoreInstanceSeal').and.returnValue(
      deleteStoreInstanceSealDeferred.promise);



  }));

  function initController(action) {
    StoreInstanceSealsCtrl = controller('StoreInstanceSealsCtrl', {
      $scope: $scope,
      $routeParams: {
        action: (action ? action : 'dispatch'),
        storeId: storeId
      }
    });
  }

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

  function mockAssignSeals() {
    var url = /store-instances\/\d+\/seals+$/;
    for (var i = 0; i < $scope.sealTypesList.length; i++) {
      httpBackend.expectPOST(url).respond(200, {});
    }
    $scope.$digest();
    StoreInstanceSealsCtrl.assignSeals();
  }

  function resolveAllDependencies() {
    getSealColorsDeferred.resolve(sealColorsJSON);
    getSealTypesDeferred.resolve(sealTypesJSON);
    getStoreDetailsDeferred.resolve(storeDetailsJSON);
    getStoreInstanceSealsDeferred.resolve(storeInstanceSealsJSON);
  }

  describe('when controller executes', function() {

    beforeEach(function() {
      initController();
      $scope.$digest();
    });

    it('should set wizardSteps', function() {
      var wizardSteps = storeInstanceWizardConfig.getSteps(routeParams.action, storeId);
      expect($scope.wizardSteps).toEqual(wizardSteps);
    });

    it('should have a nextStep set on the controller', function() {
      var mockNextStep = {
        stepName: '3',
        URL: '/store-instance-review/dispatch/' + storeId
      };
      expect(StoreInstanceSealsCtrl.nextStep).toEqual(mockNextStep);
    });

    it('should have a prevStep set on the controller', function() {
      var mockPrevStep = {
        stepName: '1',
        URL: '/store-instance-packing/dispatch/' + storeId
      };
      expect(StoreInstanceSealsCtrl.prevStep).toEqual(mockPrevStep);
    });

    describe('the get store details API call', function() {

      beforeEach(function() {
        spyOn(StoreInstanceSealsCtrl,'isInstanceReadOnly').and.callThrough();
        $scope.$digest();
      });

      it('should get the store details', function() {
        getStoreDetailsDeferred.resolve(storeDetailsJSON);
        $scope.$digest();
        expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith(storeId);
      });

      it('should attach all properties of JSON to scope', function() {
        getStoreDetailsDeferred.resolve(storeDetailsJSON);
        $scope.$digest();
        expect($scope.storeDetails).toEqual(storeDetailsJSON);
      });

      it('should check to see if the instance is read only', function() {
        getStoreDetailsDeferred.resolve(storeDetailsJSON);
        $scope.$digest();
        expect(StoreInstanceSealsCtrl.isInstanceReadOnly).toHaveBeenCalled();
      });

      it('should have the readOnly set flag to true as default', function() {
        expect($scope.readOnly).toBeTruthy();
      });

      describe('when the controller checks if an instance is read only', function() {

        it('should keep readOnly flag set to true if instance is not Ready For Seals', function() {
          storeDetailsJSON.currentStatus = {
            'id': 3,
            'statusName': 'Ready for Dispatch',
            'name': '3'
          };
          getStoreDetailsDeferred.resolve(storeDetailsJSON);
          $scope.$digest();
          expect($scope.readOnly).toBeTruthy();
        });

        it('should set the readOnly  flag to false if instance is Ready For Seals', function() {
          storeDetailsJSON.currentStatus = {
            'id': 2,
            'statusName': 'Ready for Seals',
            'name': '2'
          };
          getStoreDetailsDeferred.resolve(storeDetailsJSON);
          $scope.$digest();
          expect($scope.readOnly).toBeFalsy();
          expect($scope.saveButtonName).toEqual('Save & Exit');
        });

      });

      it('should set wizardSteps', function() {
        var wizardSteps = storeInstanceWizardConfig.getSteps(routeParams.action, storeId);
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

    describe('the get store instance seals API call', function() {

      beforeEach(function() {
        getStoreInstanceSealsDeferred.resolve(storeInstanceSealsJSON);
        $scope.$digest();
      });

      it('should set a list of existing seals in the scope', function() {
        expect($scope.existingSeals).toEqual(storeInstanceSealsJSON.response);
      });

    });

    describe('the getSealTypesDependencies method', function() {

      beforeEach(function() {
        resolveAllDependencies();
        spyOn(StoreInstanceSealsCtrl, 'generateSealTypeObject').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'addSealTypeActions').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'createHandoverActions').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'createInboundActions').and.callThrough();
        spyOn(StoreInstanceSealsCtrl, 'sealTypeListOrder').and.callThrough();
        $scope.readOnly = false;
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

      it('should defined sealTypesList.order', function() {
        expect($scope.sealTypesList[0].order).toBe(1);
      });

      it('should call the addSealTypeActions function', function() {
        expect(StoreInstanceSealsCtrl.addSealTypeActions).toHaveBeenCalled();
      });

      it('should not return any actions if set to read Only', function() {
        $scope.readOnly = true;
        $scope.$digest();
        var createdActions = StoreInstanceSealsCtrl.addSealTypeActions();
        expect(createdActions).toBeUndefined();
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
        view = renderView();
        form = angular.element(view.find('form')[0]);
      });

      it('should call the submitForm if the instance is not read only', function() {
        $scope.readOnly = false;
        spyOn($scope, 'submitForm');
        $scope.$digest();
        $scope.saveAndExit();
        expect($scope.submitForm).toHaveBeenCalled();
        expect(StoreInstanceSealsCtrl.exitAfterSave).toBeTruthy();
      });

      it('should redirect the user if the instance is read only', function() {
        spyOn($scope, 'submitForm');
        $scope.$digest();
        $scope.saveAndExit();
        expect(location.path()).toBeTruthy('/store-instance-dashboard');
      });

    });

    describe('The exit on save functionality', function() {

      beforeEach(function() {
        spyOn(StoreInstanceSealsCtrl, 'hideLoadingModal');
        spyOn(StoreInstanceSealsCtrl, 'showMessage');
        $scope.$digest();
      });

      it('should call hideLoadingModal method', function() {
        StoreInstanceSealsCtrl.exitOnSave();
        expect(StoreInstanceSealsCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should call showMessage method', function() {
        StoreInstanceSealsCtrl.exitOnSave();
        expect(StoreInstanceSealsCtrl.showMessage).toHaveBeenCalled();
      });

    });

    describe('The validateForm method', function() {

      var view;
      var form;

      beforeEach(function() {
        resolveAllDependencies();
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

  describe('The assignSeals functionality', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      spyOn(StoreInstanceSealsCtrl, 'generateSealTypeObject').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'addSealTypeActions').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'displayLoadingModal');
      spyOn(StoreInstanceSealsCtrl, 'formatPayload').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'makeAssignSealsPromises').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'makeCreatePromise').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'makeDeletePromise').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'assignSealsSuccessHandler').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'assignSealsErrorHandler').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'showMessage');
      spyOn(StoreInstanceSealsCtrl, 'updateStatusToStep').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'findStatusObject').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'statusUpdateSuccessHandler').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'hideLoadingModal');
      $scope.$digest();
      $scope.sealTypesList[0].seals.numbers.push('123');
      mockAssignSeals();
    });

    it('should display the loading modal', function() {
      expect(StoreInstanceSealsCtrl.displayLoadingModal).toHaveBeenCalledWith(
        'Assigning seals to Store Instance');
    });

    it('should call the makeAssignSealsPromises', function() {
      expect(StoreInstanceSealsCtrl.makeAssignSealsPromises).toHaveBeenCalled();
    });

    describe('success handler', function() {

      beforeEach(function() {
        resolveAllDependencies();
        createStoreInstanceSealDeferred.resolve(storeInstanceSealsCreatedJSON);
        $scope.$digest();
      });

      it('should call the success handler', function() {
        expect(StoreInstanceSealsCtrl.assignSealsSuccessHandler).toHaveBeenCalled();
      });

      it('should display a success message if the response contains an id', function() {
        var message = 'Seals Assigned!';
        expect(StoreInstanceSealsCtrl.showMessage).toHaveBeenCalledWith('success', message);
      });

      describe('updateStatusToStep', function() {
        var nextStep;
        beforeEach(function() {
          nextStep = {
            stepName: '3',
            URL: '/store-instance-review/dispatch/' + storeId
          };
          updateStoreInstanceStatusDeferred.resolve({});
          $scope.$digest();
        });

        it('should call the update status call', function() {
          expect(StoreInstanceSealsCtrl.updateStatusToStep).toHaveBeenCalledWith(nextStep);
        });

      });

    });

    describe('statusUpdateSuccessHandler', function() {

      beforeEach(function() {
        $scope.$digest();
        StoreInstanceSealsCtrl.statusUpdateSuccessHandler(StoreInstanceSealsCtrl.nextStep);
      });

      it('should hide the loading modal', function() {
        expect(StoreInstanceSealsCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should redirect the user to the packing page with the new store instance id', function() {
        expect(location.path()).toEqual(StoreInstanceSealsCtrl.nextStep.URL);
      });

    });

    describe('error handler', function() {

      var errorResponse;
      beforeEach(function() {
        errorResponse = [{
          field: 'storeId',
          code: '023',
          value: null,
          rowIndex: null,
          columnIndex: null
        }];
        createStoreInstanceSealDeferred.reject(errorResponse);
        $scope.$digest();
      });

      it('should hide the loading modal', function() {
        expect(StoreInstanceSealsCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should call the error handler', function() {
        expect(StoreInstanceSealsCtrl.assignSealsErrorHandler).toHaveBeenCalledWith(errorResponse);
      });

    });

  });

  describe('getSealTypeObjectByName functionality', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      spyOn(StoreInstanceSealsCtrl, 'generateSealTypeObject').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'addSealTypeActions').and.callThrough();
      $scope.$digest();
    });

    it('should return a sealTypeObject', function() {
      var sealTypeObjectControl = $scope.sealTypesList[0];
      var sealTypeReturned = StoreInstanceSealsCtrl.getSealTypeObjectByName('Outbound');
      expect(sealTypeReturned).toEqual(sealTypeObjectControl);
    });

    it('should return undefined if nothing is found', function() {
      var sealTypeReturned = StoreInstanceSealsCtrl.getSealTypeObjectByName('KellyIsSeal');
      expect(sealTypeReturned).toBeUndefined();
    });

  });

  describe('copySeals functionality', function() {

    var outboundSealType;
    var handoverSealType;

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      spyOn(StoreInstanceSealsCtrl, 'generateSealTypeObject').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'addSealTypeActions').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'getSealTypeObjectByName').and.callThrough();
      $scope.$digest();
      outboundSealType = $scope.sealTypesList[0];
      handoverSealType = $scope.sealTypesList[1];
    });

    it('should copy seals from one to another', function() {
      outboundSealType.seals.numbers = ['123'];
      $scope.copySeals('Outbound', 'Hand Over');
      expect(handoverSealType.seals.numbers).toEqual(outboundSealType.seals.numbers);
    });

    it('should call the getSealTypeObjectByName method', function() {
      outboundSealType.seals.numbers = [5341];
      $scope.copySeals('Outbound', 'Hand Over');
      expect(StoreInstanceSealsCtrl.getSealTypeObjectByName).toHaveBeenCalled();
    });

  });

  describe('prevTrigger method', function() {

    beforeEach(function() {
      initController();
      spyOn($scope, 'prevTrigger').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'updateStatusToStep');
      spyOn(StoreInstanceSealsCtrl, 'prevStep');
    });

    it('should have called updateStatusToStep', function() {
      $scope.prevTrigger();
      expect(StoreInstanceSealsCtrl.updateStatusToStep).toHaveBeenCalledWith(StoreInstanceSealsCtrl.prevStep);
    });

  });

  describe('goToPacking method', function() {

    beforeEach(function() {
      initController();
      spyOn($scope, 'goToPacking').and.callThrough();
      spyOn($scope, 'prevTrigger').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'updateStatusToStep');
      spyOn(StoreInstanceSealsCtrl, 'prevStep');
    });

    it('should call prevTrigger method', function() {
      $scope.goToPacking();
      expect($scope.prevTrigger).toHaveBeenCalled();
    });

  });

  describe('when view renders', function() {

    var view;
    beforeEach(function() {
      initController();
      resolveAllDependencies();
      spyOn(StoreInstanceSealsCtrl, 'generateSealTypeObject').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'addSealTypeActions').and.callThrough();
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
      $scope.$digest();
      expect(view.find('seal-type').length).toEqual($scope.sealTypesList.length);
    });

  });

  describe('getting existing seals by type', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      $scope.$digest();
    });

    it('return an array of seals by type', function() {
      var existingSealTypeObjects = $scope.existingSeals.filter(function(sealTypeObject) {
        return sealTypeObject.type === 1;
      });
      var controlArray = [];
      existingSealTypeObjects.forEach(function(sealTypeObject){
        controlArray.push(sealTypeObject.sealNumbers[0]);
      });
      expect(StoreInstanceSealsCtrl.getExistingSealsByType(1)).toEqual(controlArray);
    });

  });

  describe('getting a diff between existing seals and seals in form', function() {

    var sealTypeObject;
    beforeEach(function() {
      initController();
      resolveAllDependencies();
      $scope.$digest();
      sealTypeObject = $scope.sealTypesList[0];
    });

    it('return nothing if there are no existing seal numbers', function() {
      delete $scope.existingSeals;
      $scope.$digest();
      var existingSeals = StoreInstanceSealsCtrl.getExistingSealsByType(1);
      expect(existingSeals).toBeUndefined();
    });

    it('return an empty array if there is no difference', function() {
      var existingSeals = StoreInstanceSealsCtrl.getExistingSealsByType(1);
      var diff = StoreInstanceSealsCtrl.diffExistingSeals(sealTypeObject.seals.numbers,existingSeals);
      expect(diff).toEqual([]);
    });

    it('return a seal if there is a difference', function() {
      sealTypeObject.seals.numbers.push('123');
      $scope.$digest();
      var existingSeals = StoreInstanceSealsCtrl.getExistingSealsByType(sealTypeObject.id);
      var diff = StoreInstanceSealsCtrl.diffExistingSeals(sealTypeObject.seals.numbers,existingSeals);
      expect(diff).toEqual(['123']);
    });

  });

  describe('when an new seal is created', function() {

    var sealTypeObject;
    beforeEach(function() {
      initController();
      resolveAllDependencies();
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      spyOn(StoreInstanceSealsCtrl,'makeCreatePromise').and.callThrough();
      spyOn(StoreInstanceSealsCtrl,'determineSealsToCreate').and.callThrough();
      spyOn(StoreInstanceSealsCtrl,'getExistingSealsByType').and.callThrough();
      spyOn(StoreInstanceSealsCtrl,'diffExistingSeals').and.callThrough();
      $scope.$digest();
      sealTypeObject = $scope.sealTypesList[0];
    });

    it('should determine what seals to be created', function() {
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      expect(StoreInstanceSealsCtrl.determineSealsToCreate).toHaveBeenCalledWith(sealTypeObject);
    });

    it('should find a list of existing seals by type', function() {
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      expect(StoreInstanceSealsCtrl.getExistingSealsByType).toHaveBeenCalledWith(sealTypeObject.id);
    });

    it('should do a diff of existing seals', function() {
      var existingSeals = StoreInstanceSealsCtrl.getExistingSealsByType(sealTypeObject.id);
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      expect(StoreInstanceSealsCtrl.diffExistingSeals).toHaveBeenCalledWith(sealTypeObject.seals.numbers,existingSeals);
    });

    it('should return an array of new seals to create', function() {
      var controlArray = ['123'];
      sealTypeObject.seals.numbers.push('123');
      var sealsToCreate = StoreInstanceSealsCtrl.determineSealsToCreate(sealTypeObject);
      expect(sealsToCreate).toEqual(controlArray);
    });

    it('should call makeCreatePromise', function() {
      sealTypeObject.seals.numbers.push('123');
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      expect(StoreInstanceSealsCtrl.makeCreatePromise).toHaveBeenCalledWith(sealTypeObject);
    });

    it('should receive a promise from makeCreatePromise when there is a new seal', function() {
      sealTypeObject.seals.numbers.push('123');
      var promise = StoreInstanceSealsCtrl.makeCreatePromise(sealTypeObject);
      expect(promise).toBeDefined();
    });

    it('should not receive a promise from makeCreatePromise when there aren\'t new seals', function() {
      var promise = StoreInstanceSealsCtrl.makeCreatePromise(sealTypeObject);
      expect(promise).toBeUndefined();
    });

  });

  describe('when an existing seal is deleted', function() {

    var sealTypeObject;
    beforeEach(function() {
      initController();
      resolveAllDependencies();
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      spyOn(StoreInstanceSealsCtrl,'makeDeletePromise').and.callThrough();
      spyOn(StoreInstanceSealsCtrl,'determineSealsToDelete').and.callThrough();
      spyOn(StoreInstanceSealsCtrl,'getExistingSealsByType').and.callThrough();
      spyOn(StoreInstanceSealsCtrl,'diffExistingSeals').and.callThrough();
      $scope.$digest();
      sealTypeObject = $scope.sealTypesList[0];
    });

    it('should determine what seals to be created', function() {
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      expect(StoreInstanceSealsCtrl.determineSealsToDelete).toHaveBeenCalledWith(sealTypeObject);
    });

    it('should find a list of existing seals by type', function() {
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      expect(StoreInstanceSealsCtrl.getExistingSealsByType).toHaveBeenCalledWith(sealTypeObject.id);
    });

    it('should do a diff of existing seals', function() {
      var existingSeals = StoreInstanceSealsCtrl.getExistingSealsByType(sealTypeObject.id);
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      expect(StoreInstanceSealsCtrl.diffExistingSeals).toHaveBeenCalledWith(existingSeals,sealTypeObject.seals.numbers);
    });

    it('should return an array of existing seals to delete', function() {
      var controlArray = ['1'];
      sealTypeObject.seals.numbers = ['4567'];
      var sealsToDelete = StoreInstanceSealsCtrl.determineSealsToDelete(sealTypeObject);
      expect(sealsToDelete).toEqual(controlArray);
    });

    it('should call makeDeletePromise', function() {
      sealTypeObject.seals.numbers = ['4567'];
      StoreInstanceSealsCtrl.makeAssignSealsPromises();
      expect(StoreInstanceSealsCtrl.makeDeletePromise).toHaveBeenCalledWith(sealTypeObject);
    });

    it('should receive a promise from makeDeletePromise when there is an existing seal removed', function() {
      sealTypeObject.seals.numbers = ['4567'];
      var promise = StoreInstanceSealsCtrl.makeDeletePromise(sealTypeObject);
      expect(promise).toBeDefined();
    });

    it('should not receive a promise from makeDeletePromise when no existing seals are removed', function() {
      var promise = StoreInstanceSealsCtrl.makeDeletePromise(sealTypeObject);
      expect(promise).toBeUndefined();
    });

  });

  describe('the canReplenish functionality', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      spyOn(StoreInstanceSealsCtrl,'canReplenish').and.callThrough();
      $scope.$digest();
    });

    it('should be called when isInstanceReadOnly is called', function() {
      expect(StoreInstanceSealsCtrl.canReplenish).toHaveBeenCalled();
    });

    it('should return true if the storeDetails has parent store instance data', function() {
      var canReplenish  = StoreInstanceSealsCtrl.canReplenish();
      expect(canReplenish).toBeTruthy();
    });

    it('should return false is the storeDetails does not have parent store instance data', function() {
      delete $scope.storeDetails.parentStoreInstance;
      $scope.$digest();
      var canReplenish  = StoreInstanceSealsCtrl.canReplenish();
      expect(canReplenish).toBeFalsy();
    });

  });

  describe('the getSealTypesDependencies method for replenish', function() {

    beforeEach(function() {
      initController('replenish');
      resolveAllDependencies();
      spyOn(StoreInstanceSealsCtrl, 'generateSealTypeObject').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'addSealTypeActions').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'createHandoverActions').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'createInboundActions').and.callThrough();
      spyOn(StoreInstanceSealsCtrl, 'sealTypeListOrder').and.callThrough();
      $scope.readOnly = false;
      $scope.$digest();
    });

    it('should have 3 seal types', function() {
      expect($scope.sealTypesList.length).toBe(3);
    });

    it('should have high security as the 3rd seal type', function() {
      expect($scope.sealTypesList[2].name).toBe('High Security');
    });

    it('should create the actions for the Inbound seal', function() {
      var mockActions = [{
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

});
