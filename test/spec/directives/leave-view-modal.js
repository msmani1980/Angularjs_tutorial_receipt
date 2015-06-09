'use strict';

describe('Directive: leaveViewModal', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  beforeEach(inject(function ($compile) {
    element = angular.element(
      '<leave-view-modal></leave-view-modal>');
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should inject the directive', function () {
    expect(element).toBeDefined();
  });

  it('should contain an element with a modal class', function () {
    expect(element.find('.modal')).toBeDefined();
  });

  it('should contain an element with a fade class', function () {
    expect(element.find('.fade')).toBeDefined();
  });

  it('should have a modal-content element', function () {
    expect(element.find('.modal-content')).toBeDefined();
  });

  it('should have a modal-body element', function () {
    expect(element.find('.modal-body')).toBeDefined();
  });

  it('should have a modal-footer element', function () {
    expect(element.find('.modal-footer')).toBeDefined();
  });

  it('should have a leave button', function () {
    expect(element.find('.btn-default')).toBeDefined();
  });

  it('should have a leave button that contains text', function () {
    expect(element.find('.btn-default').text()).toContain(
      'Discard Changes');
  });

  it('should have a save button', function () {
    expect(element.find('.btn-default')).toBeDefined();
  });

  it('should have a save button that contains text', function () {
    expect(element.find('.btn-primary').text()).toContain(
      'Continue Editing');
  });

});
