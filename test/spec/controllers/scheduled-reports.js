'use strict';

describe('Controller: ScheduledReportsCtrl', function () {
	
	  beforeEach(module('ts5App'));
	  beforeEach(module('served/features-in-role-report.json'));
	
	  var featuresInRoleJSON;
	  var scope;
	  var localStorage;
	  var identityAccessFactory;
	  
	  beforeEach(inject(function($controller, $localStorage, $rootScope, $injector) {
		    identityAccessFactory = $injector.get('identityAccessFactory');
		  
	        inject(function() {
			  featuresInRoleJSON = $injector.get('servedFeaturesInRoleReport');
			  $localStorage.featuresInRole= featuresInRoleJSON;
	  		});
	  
		    scope = $rootScope.$new();
		    localStorage = $localStorage;
		    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue({
		        sessionToken: 'fakeSessionToken'
		    });
		    	 
	  }));

	  describe('controller init', function() {

		    it('should define Scope ScheduledReports', function() {
		      expect(localStorage.featuresInRole.REPORT.REPORT[0].featureCode).toEqual('REPORT');
		      expect(identityAccessFactory).toBeDefined();
		    });
	 });
});
