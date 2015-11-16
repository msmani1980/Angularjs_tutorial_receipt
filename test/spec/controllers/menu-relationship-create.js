'use strict';

describe('The MenuRelationshipCreateCtrl', function () {

  var $scope,
    MenuRelationshipCreateCtrl,
    getMenuListDeffered,
    menuService,
    menuListJSON,
    stationListJSON,
    catererStationService,
    getCatererStationListDeffered,
    getRelationshipDeffered,
    menuCatererStationListJSON,
    menuCatererStationsService,
    location,
    httpBackend,
    authRequestHandler,
    createMenuRelationshipDeffered;

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module(
    'served/menus.json',
    'served/catering-stations.json',
    'served/menu-catering-stations.json'
  ));

  function createFormObject() {
    $scope.form = {
      $name:'form',
      $valid: false,
      $invalid: false,
      $submitted: false,
      $setSubmitted: function(submitted) {
        this.$submitted = submitted;
      },
      startDate: {
        $name: 'startDate',
        $invalid: false,
        $valid: true,
        $viewValue: '',
        $setViewValue: function(value) {
          this.$viewValue = value;
        }
      },
      endDate: {
        $name: 'endDate',
        $invalid: false,
        $valid: true,
        $viewValue: '',
        $setViewValue: function(value) {
          this.$viewValue = value;
        }
      },
      menuId: {
        $name: 'menuId',
        $invalid: false,
        $valid: true,
        $viewValue: '',
        $setViewValue: function(value) {
          this.$viewValue = value;
        }
      },
      catererStationId: {
        $name: 'catererStationId',
        $invalid: false,
        $valid: true,
        $viewValue: '',
        $setViewValue: function(value) {
          this.$viewValue = value;
        }
      }
    };
  }


  beforeEach(inject(function ($q, $controller, $rootScope, _menuService_,
    $location, $httpBackend, _catererStationService_,
    _menuCatererStationsService_) {
    inject(function (_servedMenus_, _servedCateringStations_,
      _servedMenuCateringStations_) {
      menuListJSON = _servedMenus_;
      stationListJSON = _servedCateringStations_;
      menuCatererStationListJSON = _servedMenuCateringStations_;
    });

    // backend definition common for all tests
    authRequestHandler = $httpBackend.when('GET', '/auth.py').respond({
      userId: 'userX'
    }, {
      'A-Token': 'xxx'
    });

    httpBackend = $httpBackend;
    location = $location;
    $scope = $rootScope.$new();
    getMenuListDeffered = $q.defer();
    getMenuListDeffered.resolve(menuListJSON);
    menuService = _menuService_;
    spyOn(menuService, 'getMenuList').and.returnValue(
      getMenuListDeffered.promise);

    getCatererStationListDeffered = $q.defer();
    getCatererStationListDeffered.resolve(stationListJSON);
    catererStationService = _catererStationService_;
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(
      getCatererStationListDeffered.promise);

    getRelationshipDeffered = $q.defer();
    getRelationshipDeffered.resolve(menuCatererStationListJSON);
    menuCatererStationsService = _menuCatererStationsService_;
    spyOn(menuCatererStationsService, 'getRelationship').and.returnValue(
      getRelationshipDeffered.promise);

    createMenuRelationshipDeffered = $q.defer();
    spyOn(menuCatererStationsService, 'createRelationship').and.returnValue(
      createMenuRelationshipDeffered.promise);

    MenuRelationshipCreateCtrl = $controller(
      'MenuRelationshipCreateCtrl', {
        $scope: $scope
      });

    createFormObject();

  }));

  /*afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });*/

  describe('The MenuRelationshipCreateCtrl', function () {
    it('should be defined', function () {
      expect(MenuRelationshipCreateCtrl).toBeDefined();
    });
    it('should have a the route /menu-relationship-create', function () {
      location.path('/menu-relationship-create');
      expect(location.path()).toBe('/menu-relationship-create');
    });
  });

  it('should have a setMenuList method', function () {
    expect(MenuRelationshipCreateCtrl.setMenuList).toBeDefined();
  });

  it('should have an empty menu list before the scope is digested',
    function () {
      expect($scope.menuList).toBeUndefined();
    });

  describe('menus list', function () {

    beforeEach(function () {
      $scope.$digest();
    });

    it('should be defined', function () {
      expect($scope.menuList).toBeDefined();
    });

    it('should be contain at least one object in the menus array',
      function () {
        expect($scope.menuList.length).toBeGreaterThan(0);
      });

    it('should be match the menus from the menu API Respone',
      function () {
        expect($scope.menuList).toEqual(menuListJSON.menus);
      });

    describe('menu object', function () {

      var menuObject;

      beforeEach(function () {
        menuObject = $scope.menuList[0];
      });

      it('should be defined', function () {
        expect(menuObject).toBeDefined();
      });

      it('should have an id and it is a number', function () {
        expect(menuObject.id).toBeDefined();
        expect(menuObject.id).toEqual(jasmine.any(Number));
      });

      it('should have a companyId and it is a number',
        function () {
          expect(menuObject.companyId).toBeDefined();
          expect(menuObject.companyId).toEqual(jasmine.any(
            Number));
        });

      it('should have a menuCode and it is a number',
        function () {
          expect(menuObject.menuCode).toBeDefined();
          expect(menuObject.menuCode).toEqual(jasmine.any(
            String));
        });

      it('should have a menuName and it is a string',
        function () {
          expect(menuObject.menuName).toBeDefined();
          expect(menuObject.menuName).toEqual(jasmine.any(
            String));
        });

    });

  });

  it('should have a setCatererStationList method', function () {
    expect(MenuRelationshipCreateCtrl.setCatererStationList).toBeDefined();
  });

  it('should not have a stationList attached to the scope yet',
    function () {
      expect($scope.stationList).toBeUndefined();
    });

  describe('station list', function () {

    beforeEach(function () {
      $scope.$digest();
    });

    it('should be defined', function () {
      expect($scope.stationList).toBeDefined();
    });

    it('should be contain at least one object in the menus array',
      function () {
        expect($scope.stationList.length).toBeGreaterThan(0);
      });

    it(
      'should be match the stations from the station API Response',
      function () {
        expect($scope.stationList).toEqual(stationListJSON.response);
      });

    describe('station object', function () {

      var stationObject;

      beforeEach(function () {
        stationObject = $scope.stationList[0];
      });

      it('should be defined', function () {
        expect(stationObject).toBeDefined();
      });

      it('should have an id and it is a number', function () {
        expect(stationObject.id).toBeDefined();
        expect(stationObject.id).toEqual(jasmine.any(
          Number));
      });

      it('should have a companyId and it is a number',
        function () {
          expect(stationObject.companyId).toBeDefined();
          expect(stationObject.companyId).toEqual(jasmine.any(
            Number));
        });

      it('should have a station Code and it is a number',
        function () {
          expect(stationObject.code).toBeDefined();
          expect(stationObject.code).toEqual(jasmine.any(
            String));
        });

      it('should have a station Name and it is a string',
        function () {
          expect(stationObject.name).toBeDefined();
          expect(stationObject.name).toEqual(jasmine.any(
            String));
        });

    });

  });

  describe('submitting the form', function () {

    beforeEach(inject(function () {
      $scope.formData = {
        startDate: '07/21/2015',
        endDate: '07/25/2015',
        menuId: '68',
        catererStationIds: ['3']
      };
      $scope.$digest();
    }));

    it('should return false if formData is not passed to it', function () {
      var result = $scope.submitForm();
      expect(result).toBeFalsy();
    });

    it('should set the form submitted flag when called', function () {
      expect($scope.form.$submitted).toBeFalsy();
      $scope.submitForm($scope.formData);
      expect($scope.form.$submitted).toBeTruthy();
    });

    describe('validating the form', function () {

      beforeEach(function () {
        spyOn(MenuRelationshipCreateCtrl, 'validateForm').and.callThrough();
        spyOn(MenuRelationshipCreateCtrl, 'formatPayloadDates').and.callThrough();
      });

      it('should be called during the submission',function () {
        $scope.submitForm($scope.formData);
        expect(MenuRelationshipCreateCtrl.validateForm).toHaveBeenCalled();
      });

      it('should set the displayError to false flag if the form is valid', function () {
        $scope.form.$valid = true;
        expect($scope.displayError).toBeFalsy();
        $scope.submitForm($scope.formData);
        expect($scope.displayError).toBeFalsy();
      });

      it('should set the displayError to true if the form is invalid',function () {
        $scope.formData = {
          startDate: '20150717',
          menuId: '68'
        };
        $scope.$digest();
        expect($scope.displayError).toBeFalsy();
        $scope.submitForm($scope.formData);
        expect($scope.displayError).toBeTruthy();
      });

    });

    it('should call the service method createRelationship ', function () {
      $scope.form.$valid = true;
      $scope.submitForm($scope.formData);
      expect(menuCatererStationsService.createRelationship).toHaveBeenCalled();
    });

    describe('error handling when creating a relationship', function () {

      var mockError;

      beforeEach(function () {
        mockError = {
          status: 400,
          statusText: 'Bad Request',
          response: {
            field: 'catererStationId',
            code: '000'
          }
        };
        $scope.form.$valid = true;
        spyOn(MenuRelationshipCreateCtrl, 'errorHandler').and.callThrough();
        $scope.$digest();
        $scope.submitForm($scope.formData);
        createMenuRelationshipDeffered.reject(mockError);
        $scope.$apply();
      });

      it('should call the error handler', function() {
        expect(MenuRelationshipCreateCtrl.errorHandler).toHaveBeenCalledWith(mockError);
      });

      it('should set the displayError flag to true', function() {
        expect($scope.displayError).toBeTruthy();
      });

      it('should set the errorResponse as the API ', function() {
        expect($scope.errorResponse).toEqual(mockError);
      });

    });

  });

});
