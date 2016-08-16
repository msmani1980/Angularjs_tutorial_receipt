'use strict';

describe('Controller: ScheduleReportCtrl', function () {
	
	  beforeEach(module('ts5App'));
	  beforeEach(module('served/report-template.json'));
	  beforeEach(module('served/report-schedule.json'));
	  
	  var scope;
	  var modalInstance;
	  
	  var templateService;
	  var templateServiceGetDeferred;
	  var templateServiceJSON;
	  var templateId = 10;
	  
	  var scheduleReportService;
	  var ScheduleReportServiceGetDeffered;
	  var ScheduleReportSaveServiceJSON;
	  var ScheduleReportCtrl;
	  var scheduledReportId = '';
	    
	  beforeEach(inject(function($rootScope, $injector, $q, $location, $controller) {
	    
	    inject(function(_servedReportTemplate_, _servedReportSchedule_) {
	    	templateServiceJSON = _servedReportTemplate_;
	    	ScheduleReportSaveServiceJSON = _servedReportSchedule_;
		});
	    
	    scope = $rootScope.$new();
	    
	    modalInstance = {
	            close: jasmine.createSpy('modalInstance.close'),
	            dismiss: jasmine.createSpy('modalInstance.dismiss'),
	            result: {
	              then: jasmine.createSpy('modalInstance.result.then')
	            }
	          };
	    
	    templateService = $injector.get('templateService');
	    scheduleReportService = $injector.get('scheduleReportService');
	    
	    templateServiceGetDeferred = $q.defer();
	    templateServiceGetDeferred.resolve(templateServiceJSON);
	    
	    ScheduleReportServiceGetDeffered = $q.defer();
	    ScheduleReportServiceGetDeffered.resolve(ScheduleReportSaveServiceJSON);
	   
	    spyOn(templateService, 'get').and.returnValue(templateServiceGetDeferred.promise);
	    spyOn(scheduleReportService, 'saveReport').and.returnValue(ScheduleReportServiceGetDeffered.promise);
	    
	    ScheduleReportCtrl = $controller('ScheduleReportCtrl', {
	        $scope: scope,
	        $modalInstance: modalInstance,
	        scheduledReportId: scheduledReportId,
	        templateId: templateId
	    });
	    
	    scope.$digest();
	    
	  }));  
	 
	 describe('ScheduleReport', function () {
	    it('should call with params with dateRange var', function () {
	    	scope.$digest();
	    	var dateRangeLength = scope.dateRange.length;
	    	expect(dateRangeLength).toBe(3);
	    });
	  });
  
});