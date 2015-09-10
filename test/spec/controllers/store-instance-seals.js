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
  var storeInstanceDispatchWizardConfig;
  var routeParams;
  var storeId;

  beforeEach(inject(function($injector,$rootScope,$controller) {
    storeId = 123;
    $scope = $rootScope.$new();
    templateCache = $injector.get('$templateCache');
    compile = $injector.get('$compile');
    storeInstanceDispatchWizardConfig = $injector.get('storeInstanceDispatchWizardConfig');
    routeParams = $injector.get('$routeParams');
    StoreInstanceSealsCtrl = $controller('StoreInstanceSealsCtrl', {
      $scope: $scope,
      $routeParams: { id: storeId }
    });

  }));

  function renderView() {
    var html = templateCache.get('/views/store-instance-seals.html');
    var compiled = compile(angular.element(html))($scope);
    var view = angular.element(compiled[0]);
    $scope.$digest();
    return view;
  }

  fdescribe('when controller executes', function() {

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
