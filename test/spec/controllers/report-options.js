'use strict';

fdescribe('Controller: ReportOptionsCtrl', function () {
	
  beforeEach(module('ts5App'));
  beforeEach(module('served/report-template.json'));
  beforeEach(module('served/report-run.json'));
  var scope;
  var ReportOptionsCtrl;
  var jobService;
  var jobServiceRunDeferred;
  
  var modalInstance = { close: function() {}, dismiss: function() {} };
  var templateService;
  var templateServiceGetDeferred;
  var templateServiceJSON;
  var templateRunServiceJSON;
  
  var templateId;
  
  beforeEach(inject(function($rootScope, $injector, $q, $controller, _$modal_) {
    
    inject(function(_servedReportTemplate_, _servedReportRun_) {
    	templateServiceJSON = _servedReportTemplate_;
    	templateRunServiceJSON = _servedReportRun_;
	});
    
    scope = $rootScope.$new();
    modalInstance = _$modal_;
    
    jobService = $injector.get('jobService');
    templateService = $injector.get('templateService');
   
    jobServiceRunDeferred = $q.defer();
    jobServiceRunDeferred.resolve('');
    
    templateServiceGetDeferred = $q.defer();
    templateServiceGetDeferred.resolve(templateServiceJSON);
    
    
    modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);
    ReportOptionsCtrl = $controller('ReportOptionsCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      templateId: templateId
    });
    
  }));  
 
 describe('run', function () {
    it('should call with params with emailMe var', function () {
    });
  });
 
});