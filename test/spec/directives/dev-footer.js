'use strict';

describe('Directive: devFooter', function () {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element,
    scope,
    versionService;

  beforeEach(inject(function ($rootScope, _versionService_) {
    versionService = _versionService_;
    scope = $rootScope.$new();
    spyOn(versionService, 'getProjectInfo').and.returnValue({
      'PROJECT_VERSION': 'fakeProjectVersion',
      'BUILD_NUMBER': '06'
    });
  }));

    beforeEach(inject(function ($compile) {
      element = angular.element('<dev-footer></dev-footer>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have a text element', inject(function () {
      expect(element.find('p').length).toBe(1);
    }));

    it('should have a getProjectInfo function', inject(function () {
      expect(!!scope.getProjectInfo).toBe(true);
    }));

    it('should have a getProjectInfo function', inject(function () {
      scope.getProjectInfo();
      expect(versionService.getProjectInfo).toHaveBeenCalled();
    }));


});
