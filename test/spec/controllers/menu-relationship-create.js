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
    authRequestHandler;

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/menus.json', 'served/catering-stations.json',
    'served/menu-catering-stations.json'));

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

    MenuRelationshipCreateCtrl = $controller(
      'MenuRelationshipCreateCtrl', {
        $scope: $scope
      });

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

  /* E2E Tests */

  describe('view', function () {

    var $templateCache,
      $compile,
      html,
      view;

    beforeEach(inject(function (_$templateCache_, _$compile_) {
      $templateCache = _$templateCache_;
      $compile = _$compile_;
      html = $templateCache.get(
        '/views/menu-relationship-create.html');
      var compiled = $compile(angular.element(html))($scope);
      view = angular.element(compiled[0]);
      $scope.$digest();
    }));

    it('should be defined', function () {
      expect(view[0]).toBeDefined();
    });

    describe('container', function () {
      var container;
      beforeEach(function () {
        container = angular.element(view.find(
          '.container')[0]);
      });
      it('should be defined', function () {
        expect(container).toBeDefined();
      });
    });

    describe('edit controls', function () {
      var controls;
      beforeEach(function () {
        controls = angular.element(view.find(
          '.edit-controls')[0]);
      });
      it('should be defined', function () {
        expect(controls).toBeDefined();
      });
      it('should have a row', function () {
        expect(controls.find('.row')[0]).toBeDefined();
      });
      it('should have (2) columns inside of the row', function () {
        expect(controls.find('.row .col-xs-6').length).toEqual(
          2);
      });
      it('should have a View Name', function () {
        expect(controls.find('.view-name')[0]).toBeDefined();
      });
      it('should have a View Name that contains text', function () {
        expect(controls.find('.view-name').text().trim()).toEqual(
          'Create Relationship');
      });
      it('should have (2) buttons inside the controls', function () {
        expect(controls.find('.btn').length).toEqual(2);
      });

      describe('save button', function () {
        var saveButton;
        beforeEach(function () {
          saveButton = angular.element(controls.find(
            '.btn-success')[0]);
        });
        it('should be defined', function () {
          expect(saveButton[0]).toBeDefined();
        });
        it('should contain a check square icon', function () {
          expect(saveButton.find('span.fa-check-square-o')[
            0]).toBeDefined();
        });
        it('should contain the correct text', function () {
          expect(saveButton.find('.btn-label').text().trim())
            .toEqual('Create');
        });
      });

      describe('cancel button', function () {
        var cancelButton;
        beforeEach(function () {
          cancelButton = angular.element(controls.find(
            '.btn-default')[0]);
        });
        it('should be defined', function () {
          expect(cancelButton[0]).toBeDefined();
        });
        it('should contain a close icon', function () {
          expect(cancelButton.find('span.fa-close')).toBeDefined();
        });
        it('should contain the correct text', function () {
          expect(cancelButton.find('.btn-label').text().trim())
            .toEqual('Back');
        });
      });
    });

    describe('form', function () {
      var form;
      beforeEach(function () {
        form = angular.element(view.find('ng-form')[0]);
      });
      it('should be defined', function () {
        expect(form[0]).toBeDefined();
      });
      it('should have a name attribute', function () {
        expect(form.attr('name')).toEqual('form');
      });
      it('should have a .form class', function () {
        expect(form.hasClass('form')).toBeTruthy();
      });
      it('should inject the form-error-dialog directive', function () {
        expect(form.find('form-error-dialog')[0]).toBeDefined();
      });

      describe('fieldset', function () {
        var fieldSet;
        beforeEach(function () {
          fieldSet = angular.element(form.find(
            '.row fieldset')[
            0]);
        });
        it('should be defined', function () {
          expect(fieldSet[0]).toBeDefined();
        });
        it(
          'should contain ng-disabled with specific expression',
          function () {
            expect(fieldSet.attr('ng-disabled')).toContain(
              'viewOnly || isRelationshipActive()');
          });
        it('should contain a form-group', function () {
          var fieldSetRow = fieldSet.find('.form-group')[0];
          expect(fieldSetRow).toBeDefined();
        });
      });
    });
  });
});
