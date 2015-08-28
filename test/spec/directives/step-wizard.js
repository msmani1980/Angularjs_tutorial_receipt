'use strict';

describe('The Step Wizard directive', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element,
    $scope,
    stepsContainer,
    steps;

  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope.$new();
  }));

  function renderDirective($compile) {
    var template = '<step-wizard></step-wizard>';
    element = angular.element(template);
    element = $compile(element)($scope);
    $scope.$digest();
    stepsContainer = angular.element(element.find('.steps-container')[0]);
    steps = angular.element(stepsContainer.find('.step'));
  }

  describe('when the controller sets the steps in the directives scope', function(){

    beforeEach(inject(function ($compile) {
      renderDirective($compile);
    }));

    it('should have a steps set in the scope', function(){
      expect($scope.steps).toBeDefined();
      expect($scope.steps).toEqual(jasmine.any(Array));
    });

    it('should contain mock data (for now)', function(){
      var mockData = [
        {
          label: 'Create Store Instance'
        },
        {
          label: 'Packing'
        },
        {
          label: 'Assign Seals'
        },
        {
          label: 'Review & Dispatch'
        }
      ];
      expect($scope.steps[0].label).toEqual(mockData[0].label);
      expect($scope.steps[3].label).toEqual(mockData[3].label);
    });

  });

  describe('when the directive is rendered', function () {

    beforeEach(inject(function ($compile) {
      renderDirective($compile);
    }));

    it('should create a steps-container element', function () {
      expect(stepsContainer).toBeDefined();
    });

    it('should generate the same amount of .step elements as steps in the scope', function () {
      expect(steps.length).toEqual($scope.steps.length);
    });

    describe('step element', function () {
      var step;
      beforeEach(function () {
        step = angular.element(steps[0]);
      });

      it('should be present in the DOM', function () {
        expect(step).toBeDefined();
      });

      it('should have a .step class', function () {
        expect(step.hasClass('step')).toBeTruthy();
      });

      describe('.badge element', function() {

        var badge;
        beforeEach(function () {
          badge = angular.element(step.find('.badge')[0]);
        });

        it('should be present in the DOM', function () {
          expect(badge).toBeDefined();
        });

        it('should display the correct step number', function () {
          expect(badge.text().trim()).toEqual('1');
        });

      });

      describe('.step-label element', function() {

        var label;
        beforeEach(function () {
          label = angular.element(step.find('.step-label')[0]);
        });

        it('should be present in the DOM', function () {
          expect(label).toBeDefined();
        });

        it('should display the correct step number', function () {
          expect(label.text().trim()).toEqual($scope.steps[0].label);
        });

      });

      describe('.chevron element', function() {

        var chevron;
        beforeEach(function () {
          chevron = angular.element(step.find('.chevron')[0]);
        });

        it('should be present in the DOM', function () {
          expect(chevron).toBeDefined();
        });

      });

    });

  });

});
