'use strict';

describe('Controller: ScheduleReportCtrl', function () {
	
  beforeEach(module('ts5App'));
  
  var scope, $compile;
  var ScheduleReportCtrl;
  var templateId;
  var scheduledReportId;
  var modalInstance = { close: function() {}, dismiss: function() {} };
  
  beforeEach(inject(function($rootScope,  _$compile_, $injector, $q, $controller, _$modal_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    modalInstance = _$modal_;
    modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);
    ScheduleReportCtrl = $controller('ScheduleReportCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      scheduledReportId: scheduledReportId,
      templateId: templateId
    });
    
  }));
  
  describe('controller init', function() {	  
    it(' dateRange should be object ', function() {
    });
    
  });
  
});