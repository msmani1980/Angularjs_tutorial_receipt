'use strict';

describe('The Item Price Type directive', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element,
    $scope,
    panel;

  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope.$new();
  }));

  function renderDirective($compile) {
    element = angular.element('<item-price-type></item-price-type>');
    element = $compile(element)($scope);
    $scope.$digest();
    panel = angular.element(element.find('.panel')[0]);
  }

  describe('when the directive is rendered', function () {
    beforeEach(inject(function ($compile) {
      renderDirective($compile);
    }));

    it('should render a .panel component', function () {
      expect(panel).toBeDefined();
    });

  });

});
