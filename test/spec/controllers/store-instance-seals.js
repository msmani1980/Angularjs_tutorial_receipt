'use strict';

describe('the Store Instance Seals controller', function() {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/seal-types.json',
    'served/seal-colors.json'
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

  beforeEach(inject(function($injector, $rootScope, $controller, $q, _servedSealTypes_, _servedSealColors_) {

    sealTypesJSON = _servedSealTypes_;
    sealColorsJSON = _servedSealColors_;

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

    fdescribe('the getSealTypesDependencies method', function() {

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

        $scope.$digest();
      });

      it('should get the seal types', function() {
        expect(StoreInstanceSealsCtrl.generateSealTypeObject).toHaveBeenCalled();
      });

      it('should set sealTypesList type to 1', function() {
        expect($scope.sealTypesList[0].type).toBe(1);
      });

      it('should set sealTypesList name to OB', function() {
        expect($scope.sealTypesList[0].name).toBe('OB');
      });

      it('should defined sealTypesList.color', function() {
        expect($scope.sealTypesList[0].color).toBeDefined();
      });

      it('should call the addSealTypeActions function', function() {
        expect(StoreInstanceSealsCtrl.addSealTypeActions).toHaveBeenCalled();
      });

    });

  });

  // sorry kelly
  describe('when view renders', function() {

    var view;
    beforeEach(function() {
      view = renderView();
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
        code: 'OB',
        color: '#00B200',
        seals: {
          numbers: []
        }
      }, {
        name: 'Handover',
        code: 'HO',
        color: '#E5E500',
        seals: {
          numbers: []
        },
        actions: [{
          label: 'Copy From Outbound',
          trigger: function() {
            return $scope.copySeals('Outbound', 'Handover');
          }
        }]
      }];
      $scope.$digest();
      expect(view.find('seal-type').length).toEqual(2);
    });

  });

});
