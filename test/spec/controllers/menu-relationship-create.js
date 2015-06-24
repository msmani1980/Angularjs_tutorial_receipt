'use strict';

describe('Controller: MenuRelationshipCreateCtrl', function () {

  var $rootScope,
    $scope,
    $controller,
    $location,
    MenuRelationshipCreateCtrl,
    menuAPIResponse,
    stationAPIResponse;

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/menus.json', 'served/caterer-stations.json'));

  beforeEach(inject(function (_$rootScope_, _$controller_, $injector,
    _servedMenus_, _servedCatererStations_) {
    $location = $injector.get('$location');
    $location.path('/menu-relationship-create');
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    MenuRelationshipCreateCtrl = $controller(
      'MenuRelationshipCreateCtrl', {
        '$rootScope': $rootScope,
        '$scope': $scope
      });
    menuAPIResponse = _servedMenus_;
    stationAPIResponse = _servedCatererStations_;
  }));

  describe('The MenuRelationshipCreateCtrl', function () {
    it('should be defined', function () {
      expect(MenuRelationshipCreateCtrl).toBeDefined();
    });
    it('should have a the route /menu-relationship-create', function () {
      expect($location.path()).toBe('/menu-relationship-create');
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
          'Create Menu Relationship');
      });
      it('should have (2) buttons inside the controls', function () {
        expect(controls.find('.btn').length).toEqual(2);
      });

      describe('save button', function () {
        var saveButton;
        beforeEach(function () {
          saveButton = angular.element(controls.find(
            '.btn-primary')[0]);
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
            .toEqual('Cancel');
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
          fieldSet = angular.element(form.find('fieldset')[
            0]);
        });
        it('should be defined', function () {
          expect(fieldSet[0]).toBeDefined();
        });
        it(
          'should contain ng-disabled with specific expression',
          function () {
            expect(fieldSet.attr('ng-disabled')).toContain(
              'viewOnly || menuIsActive');
          });
        it('should contain a row', function () {
          var fieldSetRow = fieldSet.find('.row')[0];
          expect(fieldSetRow).toBeDefined();
        });
      });
    });
  });
});
