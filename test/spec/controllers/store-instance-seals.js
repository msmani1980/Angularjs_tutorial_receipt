'use strict';

describe('the Store Instance Seals controller', function () {

  // load the controller's module
  beforeEach(module(
    'ts5App',
    'template-module'
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


  beforeEach(inject(function($injector, $rootScope, $controller, $q) {

    storeId = 5;

    $scope = $rootScope.$new();

    templateCache = $injector.get('$templateCache');
    routeParams = $injector.get('$routeParams');
    compile = $injector.get('$compile');

    storeInstanceFactory = $injector.get('storeInstanceFactory');
    storeInstanceDispatchWizardConfig = $injector.get('storeInstanceDispatchWizardConfig');

    getStoreDetailsDeferred = $q.defer();
    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);

    StoreInstanceSealsCtrl = $controller('StoreInstanceSealsCtrl', {
      $scope: $scope,
      $routeParams: {storeId: storeId}
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

    it('should set wizardSteps', function(){
      var wizardSteps = storeInstanceDispatchWizardConfig.getSteps();
      expect($scope.wizardSteps).toEqual(wizardSteps);
    });

    it('should set the storeId scope variable', function(){
      expect($scope.storeId).toEqual(storeId);
    });

    describe('the get store details API call', function () {

      beforeEach(function () {
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

      it('should get the store details', function () {
        expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith($scope.storeId);
      });

      it('should attach all properties of JSON to scope', function () {
        expect($scope.storeDetails).toEqual(storeDetailsJSON);
      });

      it('should set wizardSteps', function(){
        var wizardSteps = storeInstanceDispatchWizardConfig.getSteps(routeParams.storeId);
        expect($scope.wizardSteps).toEqual(wizardSteps);
      });

    });

  });

  // sorry kelly
  describe('when view renders', function() {

    var view;
    beforeEach(function() {
      view = renderView ();
    });

    it('should render the view template', function(){
      expect(view).toBeDefined();
    });

    it('should have a step-wizard directive in the view', function(){
      expect(view.find('step-wizard')[0]).toBeDefined();
    });

    it('should have a error-dialog directive in the view', function(){
      expect(view.find('error-dialog')[0]).toBeDefined();
    });

  });

});
