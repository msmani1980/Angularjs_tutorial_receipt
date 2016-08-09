'use strict';

describe('Controller: ScheduleReportCtrl', function () {
	
	  beforeEach(module('ts5App'));
	
	  var scope, $compile;
	  	  
	  beforeEach(inject(function($rootScope,  _$compile_) {
	  
		    scope = $rootScope.$new();
		    $compile = _$compile_;
		    
	  }));

	  describe('controller init', function() {

		    it('should define Scope Report DateRange', function() {
		      scope.dateRange = [{ name: 'Previous Day', value: 'Previous Day' }, { name: 'Previous 7 days', value: 'Previous 7 days' }, { name: 'Previous Month', value: 'Previous Month' }];
		      scope.$digest();
		      expect(scope.dateRange[0].name).toEqual('Previous Day');
		    });
	 });
});
