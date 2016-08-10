'use strict';

describe('Controller: ReportOptionsCtrl', function () {
	
  beforeEach(module('ts5App'));
  var scope, $compile;
  var ReportOptionsCtrl;
  var jobService;
  var jobServiceRunDeferred;
  var jobServiceRunResponseJSON;
  
  beforeEach(inject(function($rootScope,  _$compile_, $injector, $q, $controller) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    jobService = $injector.get('jobService');
    jobServiceRunResponseJSON = {};
    jobServiceRunDeferred = $q.defer();
    jobServiceRunDeferred.resolve(jobServiceRunResponseJSON);
    spyOn(jobService, 'run').and.returnValue(jobServiceRunDeferred.promise);
    ReportOptionsCtrl = $controller('ReportOptionsCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));  
 
 describe('run', function () {
    it('should call with params with emailMe var', function () {
      scope.emailMe = true;
      scope.run();
      var expectedParams = jasmine.objectContaining({
        emailMe: true
      });
      expect(jobService.run).toHaveBeenCalledWith(expectedParams);
    });
  });
 
});