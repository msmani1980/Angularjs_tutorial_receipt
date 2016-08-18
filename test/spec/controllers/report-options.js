'use strict';

describe('Controller: ReportOptionsCtrl', function () {
	
  beforeEach(module('ts5App'));
  beforeEach(module('served/report-template.json'));
  beforeEach(module('served/report-run.json'));
  var scope;
  var jobService;
  var jobServiceRunDeferred;
  
  var modalInstance;
  var templateService;
  var templateServiceGetDeferred;
  var templateServiceJSON;
  var templateRunServiceJSON;
  var templateId = 10;
  var ReportOptionsCtrl;
  
  beforeEach(inject(function($rootScope, $injector, $q, $location, $controller) {
    
    inject(function(_servedReportTemplate_, _servedReportRun_) {
    	templateServiceJSON = _servedReportTemplate_;
    	templateRunServiceJSON = _servedReportRun_;
	});
    
    scope = $rootScope.$new();
    
    modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
              then: jasmine.createSpy('modalInstance.result.then')
            }
          };
    
    jobService = $injector.get('jobService');
    templateService = $injector.get('templateService');
   
    jobServiceRunDeferred = $q.defer();
    jobServiceRunDeferred.resolve(templateRunServiceJSON);
    
    templateServiceGetDeferred = $q.defer();
    templateServiceGetDeferred.resolve(templateServiceJSON);
    
    spyOn(jobService, 'run').and.returnValue(jobServiceRunDeferred.promise);
    
    ReportOptionsCtrl = $controller('ReportOptionsCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        templateId: templateId
    });
    
      
  }));  
 
 describe('run', function () {
    it('should call with params with emailMe var', function () {
    	expect(scope.emailMe).toBeDefined();
    });
  });
 
});