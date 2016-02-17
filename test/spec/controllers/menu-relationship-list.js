'use strict';

describe('Menu Relationship List Controller', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json', 'served/catering-stations.json',
    'served/menu-catering-stations.json'));
  beforeEach(module('template-module'));

  var MenuRelationshipListCtrl;
  var $scope;
  var getMenuListDeffered;
  var menuService;
  var menuListJSON;
  var stationListJSON;
  var catererStationService;
  var getCatererStationListDeffered;
  var getRelationshipListDeffered;
  var menuCatererStationListJSON;
  var menuCatererStationsService;
  var location;
  var httpBackend;
  var dateUtility;

  beforeEach(inject(function ($q, $controller, $rootScope, _menuService_,
                              $location, $httpBackend, _catererStationService_,
                              _menuCatererStationsService_, $injector) {
    inject(function (_servedMenus_, _servedCateringStations_,
                     _servedMenuCateringStations_) {
      menuListJSON = _servedMenus_;
      stationListJSON = _servedCateringStations_;
      menuCatererStationListJSON = _servedMenuCateringStations_;
    });

    httpBackend = $httpBackend;
    location = $location;
    $scope = $rootScope.$new();
    dateUtility = $injector.get('dateUtility');

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

    getRelationshipListDeffered = $q.defer();
    getRelationshipListDeffered.resolve(menuCatererStationListJSON);
    menuCatererStationsService = _menuCatererStationsService_;
    spyOn(menuCatererStationsService, 'getRelationshipList').and.returnValue(
      getRelationshipListDeffered.promise);
    spyOn(menuCatererStationsService, 'deleteRelationship').and.returnValue({
      then: function () {
        return true;
      }
    });
    MenuRelationshipListCtrl = $controller('MenuRelationshipListCtrl', {
      $scope: $scope
    });

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a init method', function () {
    expect(MenuRelationshipListCtrl.init).toBeDefined();
  });

  it('should have a getRelationshipList method', function () {
    expect($scope.searchRelationshipList).toBeDefined();
  });

  it('should have a setMenuList method', function () {
    expect(MenuRelationshipListCtrl.setMenuList).toBeDefined();
  });

  describe('menus list', function () {

    beforeEach(function () {
      $scope.searchRelationshipList();
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
        $scope.searchRelationshipList();
        $scope.$digest();
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
    expect(MenuRelationshipListCtrl.setCatererStationList).toBeDefined();
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

  describe('the findRelationshipIndex functionality', function () {

    beforeEach(function () {
      $scope.$digest();
    });

    it('should have a findRelationshipIndex method', function () {
      expect(MenuRelationshipListCtrl.findRelationshipIndex).toBeDefined();
    });

    it('should return the correct relationship index', function () {
      var relationshipIndex = MenuRelationshipListCtrl.findRelationshipIndex(
        $scope.relationshipList[0]);
      expect(relationshipIndex).toEqual(0);
    });

  });

  describe('the findMenuIndex functionality', function () {
    beforeEach(function () {
      $scope.$digest();
    });

    it('should have a findMenuIndex method', function () {
      expect(MenuRelationshipListCtrl.findMenuIndex).toBeDefined();
    });

    it('should return the correct menu index when passed a menuId',
      function () {
        var menuIndex = MenuRelationshipListCtrl.findMenuIndex(6);
        expect(menuIndex).toEqual(2);
      });
  });

  describe('the findMenuIndex functionality', function () {
    beforeEach(function () {
      $scope.$digest();
    });

    it('should have a findMenuIndex method', function () {
      expect(MenuRelationshipListCtrl.findMenuIndex).toBeDefined();
    });

    it('should return the correct menu index when passed a menuId',
      function () {
        var menuId = 6;
        var menuIndex = MenuRelationshipListCtrl.findMenuIndex(menuId);
        expect(menuIndex).toEqual(2);
      });
  });

  describe('the findStationIndex functionality', function () {
    beforeEach(function () {
      $scope.$digest();
    });

    it('should have a findStationIndex method', function () {
      expect(MenuRelationshipListCtrl.findStationIndex).toBeDefined();
    });

    it(
      'should return the correct station index when passed a stationId',
      function () {
        var stationId = 3;
        var stationIndex = MenuRelationshipListCtrl.findStationIndex(
          stationId);
        expect(stationIndex).toEqual(0);
      });
  });

  describe('remove relationship functionality', function () {

    var relationshipId,
      testObject;
    beforeEach(function () {
      $scope.$digest();
      relationshipId = 75;
      testObject = $scope.relationshipList[0];
    });

    it('should have a removeRecord() method attached to the scope',
      function () {
        expect($scope.removeRecord).toBeDefined();
      });

    it('should remove the record from the relationshipList', function () {
      expect($scope.relationshipList.length).toEqual(6);
      $scope.removeRecord(relationshipId);
      expect($scope.relationshipList.length).toEqual(5);
    });

  });

  describe('clear filter functionality', function () {

    beforeEach(function () {
      spyOn($scope, 'searchRelationshipList').and.callThrough();
      $scope.$digest();
    });

    it('should have a clearSearchFilters() method attached to the scope', function () {
      expect($scope.clearSearchFilters).toBeDefined();
    });

    it('should clear the search ng-model when called', function () {
      $scope.search = {
        menuId: 4
      };
      $scope.clearSearchFilters();
      expect($scope.search).toEqual({});
    });

    it('should clear the dateRange ng-model when called', function () {
      $scope.dateRange.startDate = '07-15-2015';
      $scope.dateRange.endDate = '08-15-2015';
      $scope.clearSearchFilters();
      expect($scope.dateRange).toEqual({});
    });

    it('should call searchRelationshipList when the user clears the filters', function () {
      $scope.clearSearchFilters();
      expect($scope.searchRelationshipList).toHaveBeenCalled();
    });

  });

  describe('generating the query filter', function () {
    var todaysDate;
    beforeEach(function () {
      todaysDate = dateUtility.formatDateForAPI(dateUtility.now(), 'x');
      spyOn(MenuRelationshipListCtrl, 'generateRelationshipQuery').and.callThrough();
      $scope.$digest();
    });

    it('should call generateRelationshipQuery when the user searches', function () {
      $scope.searchRelationshipList();
      expect(MenuRelationshipListCtrl.generateRelationshipQuery).toHaveBeenCalled();
    });

    it('create a default query filter ', function () {
      var query = MenuRelationshipListCtrl.generateRelationshipQuery();
      var controlQuery = {
        startDate: todaysDate,
        sortBy: 'ASC',
        limit: 100
      };
      expect(query).toEqual(controlQuery);
    });

    it('create a query filter that contains a menu id but maintains start date as today', function () {
      $scope.search = {
        menuId: 4
      };
      var query = MenuRelationshipListCtrl.generateRelationshipQuery();
      var controlQuery = {
        menuId: 4,
        startDate: todaysDate,
        sortBy: 'ASC',
        limit: 100
      };
      expect(query).toEqual(controlQuery);
    });

    it('create a query filter that contains a menu id and the supplied start date', function () {
      $scope.search = {
        menuId: 4
      };
      $scope.dateRange.startDate = '07-15-2015';
      var query = MenuRelationshipListCtrl.generateRelationshipQuery();
      var controlQuery = {
        menuId: 4,
        startDate: dateUtility.formatDateForAPI('07-15-2015'),
        sortBy: 'ASC',
        limit: 100
      };
      expect(query).toEqual(controlQuery);
    });

    it('create a query filter that contains a menu id and the supplied end date but maintains start date as today', function () {
      $scope.search = {
        menuId: 6
      };
      $scope.dateRange.endDate = '07-15-2015';
      var query = MenuRelationshipListCtrl.generateRelationshipQuery();
      var controlQuery = {
        menuId: 6,
        startDate: todaysDate,
        endDate: dateUtility.formatDateForAPI('07-15-2015'),
        sortBy: 'ASC',
        limit: 100
      };
      expect(query).toEqual(controlQuery);
    });

    it('create a query filter that contains a menu id and the supplied end / start date', function () {
      $scope.search = {
        menuId: 6
      };
      $scope.dateRange.startDate = '07-14-2015';
      $scope.dateRange.endDate = '07-15-2015';
      var query = MenuRelationshipListCtrl.generateRelationshipQuery();
      var controlQuery = {
        menuId: 6,
        startDate: dateUtility.formatDateForAPI('07-14-2015'),
        endDate: dateUtility.formatDateForAPI('07-15-2015'),
        sortBy: 'ASC',
        limit: 100
      };
      expect(query).toEqual(controlQuery);
    });

  });

  describe('the functionality that associates menus to relationships',
    function () {

      it('should have a associateStationData method', function () {
        expect(MenuRelationshipListCtrl.associateStationData).toBeDefined();
      });

      it(
        'should not have any relations or stations associated to the relationship yet',
        function () {
          expect($scope.relationshipList).toEqual([]);
        });

      it(
        'should associate stations with relationships when the controller inits',
        function () {
          $scope.$digest();
          expect($scope.relationshipList[0].stations).toBeDefined();
          expect($scope.relationshipList[0].stations).toEqual(jasmine.any(
            Array));
        });

      it('should associate (1) station with the first relationship',
        function () {
          $scope.$digest();
          expect($scope.relationshipList[0].stations.length).toEqual(1);
        });

      it('should contain the station data inside the first relationship',
        function () {
          $scope.$digest();
          var stations = [$scope.stationList[0]];
          expect($scope.relationshipList[0].stations).toEqual(stations);
        });

    });

  describe('the functionality that associates menus to relationships',
    function () {

      it('should have a associateMenuData method', function () {
        expect(MenuRelationshipListCtrl.associateMenuData).toBeDefined();
      });

      it(
        'should not have any relations or menus associated to the relationship yet',
        function () {
          expect($scope.relationshipList).toEqual([]);
        });

      it(
        'should associate menu with relationships when the controller inits',
        function () {
          $scope.$digest();
          expect($scope.relationshipList[3].menu).toBeDefined();
        });

      it('should contain the correct menuCode',
        function () {
          $scope.$digest();
          expect($scope.relationshipList[3].menu.menuCode).toEqual(
            'MN14351');
        });

      it('should contain the correct menuName',
        function () {
          $scope.$digest();
          expect($scope.relationshipList[3].menu.menuName).toEqual(
            'MN14351');
        });

    });

});
