'use strict';

describe('Directive: eulaModal', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element;
  var scope;
  var eulaService;

  beforeEach(inject(function($rootScope, _eulaService_) {
    var fakeEULA = {
      eula: 'END USER LICENSE AGREEMENT',
      version: 1
    };
    eulaService = _eulaService_;
    scope = $rootScope.$new();

    spyOn(eulaService, 'getCurrentEULA').and.returnValue({
      then: function() {
        return fakeEULA;
      }
    });
  }));

  beforeEach(inject(function($compile) {
    element = angular.element('<eula-modal></eula-modal>');
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should have a text element', inject(function() {
    expect(element.find('p').length).toBe(2);
  }));

  it('should have a showEULA function', inject(function() {
    expect(!!scope.showEULA).toBe(true);
  }));

  it('should have a getCurrentEULA and it should be called', inject(function() {
    scope.showEULA();
    expect(eulaService.getCurrentEULA).toHaveBeenCalled();
  }));

  it('should not call getCurrentEULA if cached', inject(function() {
    scope.eulaLoaded = true;
    scope.showEULA();
    expect(eulaService.getCurrentEULA).not.toHaveBeenCalled();
  }));

});
