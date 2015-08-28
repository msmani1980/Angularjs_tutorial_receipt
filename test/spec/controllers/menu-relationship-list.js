'use strict';
/* global moment */
describe('Menu Relationship List Controller', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json', 'served/catering-stations.json',
    'served/menu-catering-stations.json'));
  beforeEach(module('template-module'));

  var MenuRelationshipListCtrl,
    $scope,
    getMenuListDeffered,
    menuService,
    menuListJSON,
    stationListJSON,
    catererStationService,
    getCatererStationListDeffered,
    getRelationshipListDeffered,
    menuCatererStationListJSON,
    menuCatererStationsService,
    location,
    httpBackend,
    authRequestHandler,
    dateUtility;

  beforeEach(inject(function ($q, $controller, $rootScope, _menuService_,
    $location, $httpBackend, _catererStationService_,
    _menuCatererStationsService_,$injector) {
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
    expect(MenuRelationshipListCtrl.getRelationshipList).toBeDefined();
  });

  it('should have a setMenuList method', function () {
    expect(MenuRelationshipListCtrl.setMenuList).toBeDefined();
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
    expect(MenuRelationshipListCtrl.setCatererStationList).toBeDefined();
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

  describe('The Pagination', function () {

    beforeEach(function () {
      $scope.$digest();
    });

    it('should attach currentPage to the scope', function () {
      expect($scope.currentPage).toBeDefined();
      expect($scope.currentPage).toEqual(1);
    });

    it('should attach relationshipsPerPage to the scope', function () {
      expect($scope.relationshipsPerPage).toBeDefined();
      expect($scope.relationshipsPerPage).toEqual(10);
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
      spyOn(MenuRelationshipListCtrl,'searchRelationshipList').and.callThrough();
      $scope.$digest();
    });

    it('should have a clearSearchFilters() method attached to the scope',  function () {
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

    it('should call searchRelationshipList when the user clears the filters',  function () {
      $scope.clearSearchFilters();
      expect(MenuRelationshipListCtrl.searchRelationshipList).toHaveBeenCalled();
    });

  });

  describe('generating the query filter', function () {
    var todaysDate;
    beforeEach(function () {
      todaysDate = dateUtility.formatDateForAPI(dateUtility.now(), 'x');
      spyOn(MenuRelationshipListCtrl,'generateRelationshipQuery').and.callThrough();
      $scope.$digest();
    });

    it('should call generateRelationshipQuery when the user searches',  function () {
      MenuRelationshipListCtrl.searchRelationshipList();
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
        '/views/menu-relationship-list.html');
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
          '.fluid-container')[0]);
      });
      it('should be defined', function () {
        expect(container).toBeDefined();
      });
    });

    describe('list controls', function () {
      var controls;
      beforeEach(function () {
        controls = angular.element(view.find(
          '.list-controls')[0]);
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
          'Menu Relationship List');
      });
      it('should have (4) buttons inside the controls', function () {
        expect(controls.find('.btn').length).toEqual(4);
      });

      describe('create button', function () {
        var createButton;
        beforeEach(function () {
          createButton = angular.element(controls.find(
            '.btn-create')[0]);
        });
        it('should be defined', function () {
          expect(createButton[0]).toBeDefined();
        });
        it('should contain a plus icon', function () {
          expect(createButton.find('span.fa-plus')).toBeDefined();
        });
        it('should contain text', function () {
          expect(createButton.text().trim()).toEqual(
            'Create Menu Relationship');
        });
      });

      describe('search button', function () {
        var searchButton;
        beforeEach(function () {
          searchButton = angular.element(controls.find(
            '.btn-search')[0]);
        });
        it('should be defined', function () {
          expect(searchButton[0]).toBeDefined();
        });
        it('should contain a search icon', function () {
          expect(searchButton.find('span.fa-search')).toBeDefined();
        });
        it('should contain text', function () {
          expect(searchButton.find('.btn-label').text().trim())
            .toEqual('Search');
        });
      });

      describe('search container', function () {
        var searchContainer;
        beforeEach(function () {
          searchContainer = angular.element(controls.find(
            '#search-collapse')[0]);
        });
        it('should be defined', function () {
          expect(searchContainer).toBeDefined();
        });
        it('should have the class .collapse', function () {
          expect(searchContainer.hasClass('collapse')).toBeTruthy();
        });
        it('should contain a form', function () {
          expect(searchContainer.find('form')[0]).toBeDefined();
        });
        it('should contain a form with a row', function () {
          expect(searchContainer.find('form .row')[0]).toBeDefined();
        });
        it('should contain (5) columns', function () {
          expect(searchContainer.find(
            'form .row > .col-xs-12').length).toEqual(5);
        });

        describe('menu code form group', function () {
          var formGroup;
          beforeEach(function () {
            formGroup = angular.element(searchContainer
              .find('.form-group')[0]);
          });
          it('should be defined', function () {
            expect(formGroup[0]).toBeDefined();
          });
          it('should contain a label', function () {
            expect(formGroup.find('label')[0]).toBeDefined();
          });
          it('should contain a label with the correct text',
            function () {
              expect(formGroup.find('label').text().trim())
                .toEqual('Menu Code');
            });
          it('should contain an select', function () {
            expect(formGroup.find('select')[0]).toBeDefined();
          });
          it('should contain .form-control class', function () {
            expect(formGroup.find('select').hasClass(
              'form-control')).toBeTruthy();
          });
          it(
            'should contain an select field with the correct ng-model',
            function () {
              expect(formGroup.find('select').attr(
                  'ng-model'))
                .toEqual('search.menuId');
            });
        });

        describe('menu name form group', function () {
          var formGroup;
          beforeEach(function () {
            formGroup = angular.element(searchContainer
              .find('.form-group')[1]);
          });
          it('should be defined', function () {
            expect(formGroup[0]).toBeDefined();
          });
          it('should contain a label', function () {
            expect(formGroup.find('label')[0]).toBeDefined();
          });
          it('should contain a label with the correct text',
            function () {
              expect(formGroup.find('label').text().trim())
                .toEqual('Menu Name');
            });
          it('should contain an select field', function () {
            expect(formGroup.find('select')[0]).toBeDefined();
          });
          it('should contain .form-control class', function () {
            expect(formGroup.find('select').hasClass(
              'form-control')).toBeTruthy();
          });
          it(
            'should contain an input field with the correct ng-model',
            function () {
              expect(formGroup.find('select').attr(
                  'ng-model'))
                .toEqual('search.menuId');
            });
        });

        describe('catering station form group', function () {
          var formGroup;
          beforeEach(function () {
            formGroup = angular.element(searchContainer
              .find('.form-group')[2]);
          });
          it('should be defined', function () {
            expect(formGroup[0]).toBeDefined();
          });
          it('should contain a label', function () {
            expect(formGroup.find('label')[0]).toBeDefined();
          });
          it('should contain a label with the correct text',
            function () {
              expect(formGroup.find('label').text().trim())
                .toEqual('Catering Stations');
            });
          it('should contain an select element', function () {
            expect(formGroup.find('select')[0]).toBeDefined();
          });
          it(
            'should contain an input field with the correct ng-model',
            function () {
              expect(formGroup.find('select').attr(
                  'ng-model'))
                .toEqual('search.catererStationId');
            });
          it(
            'should contain all stations in apiResponse as options',
            function () {
              expect(formGroup.find('option').length).toEqual(
                $scope.stationList.length + 1);
            });

          describe('catering station option', function () {
            var option;
            beforeEach(function () {
              option = angular.element(formGroup
                .find('option')[1]);
            });
            it(
              'should have a value set from the stationList',
              function () {
                expect(option.val()).toEqual($scope.stationList[
                  0].id.toString());
              });
          });
        });

        describe('date-picker directive', function () {
          var datePicker;
          beforeEach(function () {
            datePicker = searchContainer.find(
              '.datepicker-container');
          });
          it('should be defined', function () {
            expect(datePicker[0]).toBeDefined();
          });
          // TODO: Test directive element injection, talk to Rodrigo about replace
        });
      });

      describe('clear button', function () {
        var clearButton;
        beforeEach(function () {
          clearButton = angular.element(controls.find(
            '.btn-search-clear')[0]);
        });
        it('should be defined', function () {
          expect(clearButton[0]).toBeDefined();
        });
        it('should contain text', function () {
          expect(clearButton.find('.btn-label').text().trim())
            .toEqual('Clear');
        });
        it('should contain an ng-click', function () {
          expect(clearButton.attr('ng-click')).toEqual(
            'clearSearchFilters()');
        });
      });
    });

    describe('menu table', function () {
      var table;
      beforeEach(function () {
        table = angular.element(view.find('table')[0]);
      });
      it('should be defined', function () {
        expect(table).toBeDefined();
      });
      it('should have a thead element', function () {
        expect(table.find('thead')).toBeDefined();
      });

      describe('table header', function () {
        var thead,
          testHeader;
        beforeEach(function () {
          thead = angular.element(table.find('thead')[
            0]);
        });
        it('should contain 6 columns', function () {
          expect(thead.find('th').length).toEqual(6);
        });
        it('should contain a Menu Code column', function () {
          testHeader = angular.element(thead.find(
            'th')[0]);
          expect(testHeader.text().trim()).toEqual(
            'Menu Code');
        });
        it('should contain a Menu Name column', function () {
          testHeader = angular.element(thead.find(
            'th')[1]);
          expect(testHeader.text().trim()).toEqual(
            'Menu Name');
        });
        it('should contain a Catering Station column',
          function () {
            testHeader = angular.element(thead.find(
              'th')[2]);
            expect(testHeader.text().trim()).toEqual(
              'Catering Stations');
          });
        it('should contain a Start Date column', function () {
          testHeader = angular.element(thead.find(
            'th')[3]);
          expect(testHeader.text().trim()).toEqual(
            'Start Date');
        });
        it('should contain a End Date column', function () {
          testHeader = angular.element(thead.find(
            'th')[4]);
          expect(testHeader.text().trim()).toEqual(
            'End Date');
        });
        it('should contain an Actions column', function () {
          testHeader = angular.element(thead.find(
            'th')[5]);
          expect(testHeader.text().trim()).toEqual(
            'Actions');
        });
      });

      describe('table body', function () {
        var tbody;
        beforeEach(function () {
          tbody = angular.element(table.find('tbody')[
            0]);
        });
        it(
          'should contain a list tr element which is the same length as the relationship list ',
          function () {
            expect(tbody.find('tr').length).toEqual(
              $scope.relationshipList.length);
          });

        describe('first row', function () {
          var testRow,
            testCell,
            testRelationshipData;
          beforeEach(function () {
            testRelationshipData =
              $scope.relationshipList[0];
            testRow = angular.element(tbody.find('tr')[
              0]);
          });
          it('should contain ng-repeat', function () {
            expect(testRow.attr('ng-repeat')).toContain(
              '(key,relationship) in paginatedRelationships'
            );
          });
          it('should contain a Menu Code cell',
            function () {
              testCell = angular.element(testRow.find(
                'td')[0]);
              expect(testCell).toBeDefined();
            });
          it(
            'should have a Menu Code cell that matches the api data',
            function () {
              testCell = angular.element(testRow.find(
                'td')[0]);
              expect(testCell.text().trim()).toEqual(
                testRelationshipData.menu.menuCode);
            });
          it('should contain a Menu Name cell',
            function () {
              testCell = angular.element(testRow.find(
                'td')[1]);
              expect(testCell).toBeDefined();
            });
          it(
            'should have a Menu Name cell that matches the api data',
            function () {
              testCell = angular.element(testRow.find(
                'td')[1]);
              expect(testCell.text().trim()).toEqual(
                testRelationshipData.menu.menuName);
            });
          it(
            'should contain a Catering Stations cell',
            function () {
              testCell = angular.element(testRow.find(
                'td')[2]);
              expect(testCell).toBeDefined();
            });
          it('should contain a Start Date cell',
            function () {
              testCell = angular.element(testRow.find(
                'td')[3]);
              expect(testCell).toBeDefined();
            });
          it(
            'should have a Start Date cell that matches the api data',
            function () {
              testCell = angular.element(testRow.find(
                'td')[3]);

              var formattedDate = moment(testCell.text()
                  .trim(),
                  'MM/DD/YYYY').format('YYYY-MM-DD')
                .toString();
              expect(
                formattedDate).toEqual(
                testRelationshipData.startDate);
            });
          it('should contain a End Date cell',
            function () {
              testCell = angular.element(testRow.find(
                'td')[4]);
              expect(testCell).toBeDefined();
            });
          it(
            'should have a End Date cell that matches the api data',
            function () {
              testCell = angular.element(testRow.find(
                'td')[4]);
              var formattedDate = moment(testCell.text()
                  .trim(),
                  'MM/DD/YYYY').format('YYYY-MM-DD')
                .toString();
              expect(formattedDate).toEqual(
                testRelationshipData.endDate);
            });

          describe('view button', function () {
            var viewButton;
            beforeEach(function () {
              testCell = angular.element(testRow.find(
                'td')[5]);
              viewButton = angular.element(testCell
                .find('.btn-view'));
            });

            it('should be defined', function () {
              expect(viewButton[0]).toBeDefined();
            });
            it('should have a file icon', function () {
              expect(viewButton.find('.fa-file')[0])
                .toBeDefined();
            });
            it('should have the btn-info class',
              function () {
                expect(viewButton.hasClass('btn-info'))
                  .toBeTruthy();
              });
            it(
              'should have an ng-href to view the relationship',
              function () {
                var testObject = $scope.relationshipList[
                  0];
                var testUrl =
                  '#/menu-relationship-view/' +
                  testObject.id;
                expect(viewButton.attr('ng-href')).toEqual(
                  testUrl);
              });

          });

          describe('edit button', function () {
            var editButton,
              testObject;
            beforeEach(function () {
              testCell = angular.element(testRow.find(
                'td')[5]);
              editButton = angular.element(
                testCell
                .find('.btn-edit')[0]);
              testObject = $scope.relationshipList[
                0];
            });
            it('should be defined', function () {
              expect(editButton[0]).toBeDefined();
            });
            it('should have a pencil icon', function () {
              expect(editButton.find('.fa-pencil')[
                0]).toBeDefined();
            });
            it('should have the btn-primary class',
              function () {
                expect(editButton.hasClass(
                  'btn-primary')).toBeTruthy();
              });
            it(
              'should have an ng-href to edit the menu',
              function () {
                var testUrl =
                  '#/menu-relationship-edit/' +
                  testObject.id;
                expect(editButton.attr('ng-href'))
                  .toEqual(testUrl);
              });
            it(
              'should be shown if the menu is  inactive',
              function () {
                testObject.endDate = '2050-08-08';
                var menuIsInactive = $scope.isRelationshipInactive(
                  testObject.endDate);
                expect(menuIsInactive).toBeFalsy();
              });
          });

          describe('delete button', function () {
            var deleteButton;
            beforeEach(function () {
              testCell = angular.element(
                testRow.find(
                  'td')[5]);
              deleteButton = angular.element(
                testCell
                .find('.btn-delete'));
            });
            it('should be defined', function () {
              expect(deleteButton[0]).toBeDefined();
            });
            it('should have a trash icon', function () {
              expect(deleteButton.find(
                '.fa-trash')[0]).toBeDefined();
            });
            it('should have the btn-danger class',
              function () {
                expect(deleteButton.hasClass(
                  'btn-danger')).toBeTruthy();
              });
            it(
              'should have ng-click with deleteRecordDialog function',
              function () {
                expect(deleteButton.attr(
                  'ng-click')).toEqual(
                  'deleteRecordDialog(relationship)'
                );
              });
            it(
              'should be hidden if the menu is active',
              function () {
                var testObject = $scope.menuList[0];
                var menuIsActive = $scope.isRelationshipActive(
                  testObject.endDate);
                expect(menuIsActive).toBeTruthy();
                expect(deleteButton.attr('ng-hide')).toBeTruthy();
              });
            it(
              'should be hidden if the menu is inactive',
              function () {
                var testObject = $scope.menuList[0];
                var menuIsInactive = $scope.isRelationshipInactive(
                  testObject.endDate);
                expect(menuIsInactive).toBeTruthy();
                expect(deleteButton.attr('ng-hide')).toBeTruthy();
              });
          });
        });
      });
    });
  });

});
