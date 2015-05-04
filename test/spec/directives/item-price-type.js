'use strict';

describe('Directive: itemPriceType', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should be inject into the DOM', inject(function ($compile) {

    element = angular.element('<item-price-type></item-price-type>');

    element = $compile(element)(scope);

    expect(element).toBeDefined(); 

  }));

});
