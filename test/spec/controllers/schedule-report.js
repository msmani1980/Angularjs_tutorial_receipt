'use strict';

describe('Controller: ScheduleReportCtrl', function () {
	
  beforeEach(module('ts5App'));
  
  var scope, $compile;
  var ScheduleReportCtrl;
  
  beforeEach(inject(function($rootScope,  _$compile_, $injector, $q, $controller) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    
    ScheduleReportCtrl = $controller('ScheduleReportCtrl', {
      $scope: scope
    });
    
    scope.$digest();
    
  }));
  
  describe('controller init', function() {	  
    it(' dateRange should be object ', function() {
      expect(Object.prototype.toString.call(scope.dateRange)).toBe('[object Object]');
    });
    
  });
  
});