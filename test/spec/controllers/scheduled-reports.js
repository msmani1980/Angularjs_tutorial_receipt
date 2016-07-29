'use strict';

describe('Controller: ScheduledReportsCtrl', function () {
	  beforeEach(module('ts5App'));
	  beforeEach(module('served/features-in-role-report.json'));
	
	  var ScheduledReportsCtrl;
	  var featuresInRoleJSON;
	  var scope;
	  var featuresInRole;
	  var localStorage;
	  	  
	  beforeEach(inject(function($controller, $localStorage, $rootScope, $injector, $q) {
	        inject(function() {
			  featuresInRoleJSON = $injector.get('servedFeaturesInRoleReport');
			  $localStorage.featuresInRole= featuresInRoleJSON;
	  		});
	  
		    scope = $rootScope.$new();
		    localStorage = $localStorage;
		    
		    ScheduledReportsCtrl = $controller('ScheduledReportsCtrl', {
		     $scope: scope,
		     $localStorage: localStorage
		    });
	 
	  }));

	  describe('controller init', function() {

		    it('should define Scope Report', function() {
		      expect(localStorage.featuresInRole.REPORT.REPORT[0].featureCode).toEqual('REPORT');
		    });
	 });
});
