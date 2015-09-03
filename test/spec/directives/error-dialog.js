'use strict';

describe('Directive: errorDialog', function() {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element;
  var scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  describe('When the error-dialog directive is compiled, it', function() {

    beforeEach(inject(function($compile) {
      element = angular.element('<error-dialog></error-dialog>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should be defined', function() {
      expect(element).toBeDefined();
    });

  });

});
