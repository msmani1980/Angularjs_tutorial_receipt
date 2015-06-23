'use strict';

describe('Menu Relationship List Controller', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json', 'served/caterer-stations.json'));

  var MenuRelationshipListCtrl,
    $scope,
    getMenuListDeffered,
    menuService,
    menuListJSON,
    stationListJSON,
    location,
    httpBackend,
    authRequestHandler;

  beforeEach(inject(function ($q, $controller, $rootScope, _menuService_,
    $location, $httpBackend) {
    inject(function (_servedMenus_, _servedCatererStations_) {
      menuListJSON = _servedMenus_;
      stationListJSON = _servedCatererStations_;
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

    MenuRelationshipListCtrl = $controller('MenuRelationshipListCtrl', {
      $scope: $scope
    });

    spyOn(MenuRelationshipListCtrl, 'getMenuList');

    MenuRelationshipListCtrl.getMenuList();

    $scope.$digest();

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a getMenuList method', function () {
    expect(MenuRelationshipListCtrl.getMenuList).toBeDefined();
  });

  it('should call the getMenuList method', function () {
    expect(MenuRelationshipListCtrl.getMenuList).toHaveBeenCalled();
  });

  describe('menus list', function () {

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

  describe('station list', function () {

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

    it('should attach currentPage to the scope', function () {
      expect($scope.currentPage).toBeDefined();
      expect($scope.currentPage).toEqual(1);
    });

    it('should attach itemsPerPage to the scope', function () {
      expect($scope.menusPerPage).toBeDefined();
      expect($scope.menusPerPage).toEqual(10);
    });

  });

  /* E2E Tests

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
      it('should have (3) buttons inside the controls', function () {
        expect(controls.find('.btn').length).toEqual(3);
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
          it('should contain an input field', function () {
            expect(formGroup.find('input')[0]).toBeDefined();
          });
          it('should contain .form-control class', function () {
            expect(formGroup.find('input').hasClass(
              'form-control')).toBeTruthy();
          });
          it(
            'should contain an input field with the correct ng-model',
            function () {
              expect(formGroup.find('input').attr(
                  'ng-model'))
                .toEqual('search.menuCode');
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
          it('should contain an input field', function () {
            expect(formGroup.find('input')[0]).toBeDefined();
          });
          it('should contain .form-control class', function () {
            expect(formGroup.find('input').hasClass(
              'form-control')).toBeTruthy();
          });
          it(
            'should contain an input field with the correct ng-model',
            function () {
              expect(formGroup.find('input').attr(
                  'ng-model'))
                .toEqual('search.menuName');
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
                .toEqual('Caterer Stations');
            });
          it('should contain an select element', function () {
            expect(formGroup.find('select')[0]).toBeDefined();
          });
          it('should contain .form-control class', function () {
            expect(formGroup.find('select').hasClass(
              'form-control')).toBeTruthy();
          });
          it('should be a multiple select input', function () {
            expect(formGroup.find('select').attr(
              'multiple')).toBeTruthy();
          });
          it(
            'should contain an input field with the correct ng-model',
            function () {
              expect(formGroup.find('select').attr(
                  'ng-model'))
                .toEqual('search.menuStation');
            });
          it(
            'should contain all stations in apiResponse as options',
            function () {
              expect(formGroup.find('option').length).toEqual(
                $scope.stationList.length);
            });

          describe('catering station option', function () {
            var option;
            beforeEach(function () {
              option = angular.element(formGroup
                .find('option')[0]);
            });
            it(
              'should have a value set from the stationList',
              function () {
                expect(option.val()).toEqual($scope.stationList[
                  0].code);
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

      describe('search functionality', function () {
        var table;
        beforeEach(function () {
          table = angular.element(view.find('table')[0]);
        });

        describe('menu code filter', function () {
          var menuCodeInput;
          beforeEach(function () {
            menuCodeInput = angular.element(view.find(
              'input[ng-model="search.menuCode"]')[
              0]);
          });
          it(
            'should return all items in the table when the menu code is not set ',
            function () {
              menuCodeInput.val('');
              $scope.$digest();
              menuCodeInput.triggerHandler('input');
              expect(table.find('tbody tr').length).toEqual(
                $scope.menuList.length);
            });
          it(
            'should contain (1) item in the table when the menu code is filtered by "M" ',
            function () {
              menuCodeInput.val('M');
              $scope.$digest();
              menuCodeInput.triggerHandler('input');
              expect(table.find('tbody tr').length).toEqual(
                1);
            });
        });

        describe('menu name filter', function () {
          var menuNameInput;
          beforeEach(function () {
            menuNameInput = angular.element(view.find(
              'input[ng-model="search.menuName"]')[
              0]);
          });
          it(
            'should return all items in the table when the menu name is not set ',
            function () {
              menuNameInput.val('');
              $scope.$digest();
              menuNameInput.triggerHandler('input');
              expect(table.find('tbody tr').length).toEqual(
                $scope.menuList.length);
            });
          it(
            'should contain (1) item in the table when the menu name is filtered by "Name" ',
            function () {
              menuNameInput.val('Name');
              $scope.$digest();
              menuNameInput.triggerHandler('input');
              expect(table.find('tbody tr').length).toEqual(
                1);
            });
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
        it('should contain a Caterer Station column',
          function () {
            testHeader = angular.element(thead.find(
              'th')[2]);
            expect(testHeader.text().trim()).toEqual(
              'Caterer Stations');
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
          'should contain a list tr element which is the same length as the menu list ',
          function () {
            expect(tbody.find('tr').length).toEqual(
              $scope.menuList
              .length);
          });

        describe('first row', function () {
          var testRow,
            testCell,
            testMenuData;
          beforeEach(function () {
            testMenuData = menuListJSON.menus[
              0];
            testRow = angular.element(tbody.find(
              'tr')[
              0]);
          });
          it('should contain ng-repeat', function () {
            expect(testRow.attr('ng-repeat')).toContain(
              '(key,menu) in menuList');
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
                testMenuData.menuCode);
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
                testMenuData.menuName);
            });
          it(
            'should contain a Caterer Stations cell',
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
                testMenuData.startDate);
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
                testMenuData.endDate);
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
              'should have an ng-href to view the menu',
              function () {
                var testObject = $scope.menuList[0];
                var testUrl = '#/menu-view/' +
                  testObject.id;
                expect(viewButton.attr('ng-href')).toEqual(
                  testUrl);
              });

          });

          describe('edit button', function () {
            var editButton;
            beforeEach(function () {
              testCell = angular.element(testRow.find(
                'td')[5]);
              editButton = angular.element(
                testCell
                .find('.btn-edit'));
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
                var testObject = $scope.menuList[
                  0];
                var testUrl = '#/menu-edit/' +
                  testObject.id;
                expect(editButton.attr('ng-href'))
                  .toEqual(
                    testUrl);
              });
            it(
              'should be disabled if the menu is inactive',
              function () {
                var testObject = $scope.menuList[0];
                var itemIsInactive = $scope.isItemInactive(
                  testObject.endDate);
                expect(itemIsInactive).toBeTruthy();
                expect(editButton.attr('disabled')).toEqual(
                  'disabled');
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
              'should have ng-click with removeMenu function',
              function () {
                expect(deleteButton.attr(
                  'ng-click')).toEqual(
                  'removeMenu(menu.id,key)');
              });
            it(
              'should be disabled if the menu is active',
              function () {
                var testObject = $scope.menuList[0];
                var itemIsActive = $scope.isItemActive(
                  testObject.endDate);
                expect(itemIsActive).toBeTruthy();
                expect(deleteButton.attr('disabled'))
                  .toEqual(
                    'disabled');
              });
            it(
              'should be disabled if the menu is inactive',
              function () {
                var testObject = $scope.menuList[0];
                var itemIsInactive = $scope.isItemInactive(
                  testObject.endDate);
                expect(itemIsInactive).toBeTruthy();
                expect(deleteButton.attr('disabled'))
                  .toEqual(
                    'disabled');
              });
          });
        });
      });
    });
  });
  */
});
