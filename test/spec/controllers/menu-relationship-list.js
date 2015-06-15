'use strict';
/* global moment */
describe('Controller: MenuRelationshipListCtrl', function () {

  var $rootScope,
    $scope,
    $controller,
    $location,
    MenuRelationshipListCtrl,
    menuAPIResponse;

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/menus.json'));

  beforeEach(inject(function (_$rootScope_, _$controller_, $injector,
    _servedMenus_) {
    $location = $injector.get('$location');
    $location.path('/menu-relationship-list');
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    MenuRelationshipListCtrl = $controller('MenuRelationshipListCtrl', {
      '$rootScope': $rootScope,
      '$scope': $scope
    });
    menuAPIResponse = _servedMenus_;
  }));

  describe('The MenuRelationshipListCtrl', function () {

    it('should be defined', function () {
      expect(MenuRelationshipListCtrl).toBeDefined();
    });

    it('should have a the route /menu-relationship-list', function () {
      expect($location.path()).toBe('/menu-relationship-list');
    });

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
        expect($scope.menuList).toEqual(menuAPIResponse.menus);
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

      it('should have a companyId and it is a number', function () {
        expect(menuObject.companyId).toBeDefined();
        expect(menuObject.companyId).toEqual(jasmine.any(Number));
      });

      it('should have a menuCode and it is a number', function () {
        expect(menuObject.menuCode).toBeDefined();
        expect(menuObject.menuCode).toEqual(jasmine.any(String));
      });

      it('should have a menuName and it is a string', function () {
        expect(menuObject.menuName).toBeDefined();
        expect(menuObject.menuName).toEqual(jasmine.any(String));
      });

    });

  });

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
      expect(view).toBeDefined();
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

      it('should have (2) buttons inside the control', function () {
        expect(controls.find('button.btn').length).toEqual(
          2);
      });

      describe('search button', function () {
        var searchButton;
        beforeEach(function () {
          searchButton = angular.element(controls.find(
            '.btn')[0]);
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
                .toEqual('Catering Station');
            });

          it('should contain an select element', function () {
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
                .toEqual('search.menuStation');
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
            '.btn')[1]);
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
            testMenuData = menuAPIResponse.menus[
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

          it('should have a view item button defined',
            function () {
              testCell = angular.element(testRow.find(
                'td')[4]);
              var viewItemBtn = testCell.find('.btn-info');
              expect(viewItemBtn).toBeDefined();
            });

          it(
            'should have a icon inside the item edit button',
            function () {
              testCell = angular.element(testRow.find(
                'td')[4]);
              var viewItemBtn = testCell.find('.btn-info');
              expect(viewItemBtn.find('.fa-file')).toBeDefined();
            });

          it('should have a edit item button defined',
            function () {
              testCell = angular.element(testRow.find(
                'td')[4]);
              var viewItemBtn = testCell.find(
                '.btn-primary');
              expect(viewItemBtn).toBeDefined();
            });

          it(
            'should have a icon inside the item edit button',
            function () {
              testCell = angular.element(testRow.find(
                'td')[4]);
              var viewItemBtn = testCell.find(
                '.btn-primary');
              expect(viewItemBtn.find('.fa-pencil')).toBeDefined();
            });

          it('should have a delete item button defined',
            function () {
              testCell = angular.element(testRow.find(
                'td')[4]);
              var viewItemBtn = testCell.find(
                '.btn-danger');
              expect(viewItemBtn).toBeDefined();
            });

          it(
            'should have a icon inside the item delete button',
            function () {
              testCell = angular.element(testRow.find(
                'td')[4]);
              var viewItemBtn = testCell.find(
                '.btn-danger');
              expect(viewItemBtn.find('.fa-trash')).toBeDefined();
            });

          it(
            'should have ng-click with removeMenu function',
            function () {
              testCell = angular.element(testRow.find(
                'td')[5]);
              var viewItemBtn = testCell.find(
                '.btn-danger');
              expect(viewItemBtn.attr('ng-click')).toEqual(
                'removeMenu(menu.id,key)');
            });

        });

      });

    });

  });

});
