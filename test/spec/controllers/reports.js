'use strict';

describe('Controller: ReportsCtrl', function () {
	  beforeEach(module('ts5App'));
	  beforeEach(module('served/features-in-role-report.json'));
	
	  var featuresInRoleJSON;
	  var scope;
	  var localStorage;
	  var identityAccessFactory;
	  var ReportsCtrl;
	  
	  beforeEach(inject(function($controller, $localStorage, $rootScope, $injector) {
		    identityAccessFactory = $injector.get('identityAccessFactory');
		  
	        inject(function() {
			  featuresInRoleJSON = $injector.get('servedFeaturesInRoleReport');
			  $localStorage.featuresInRole= featuresInRoleJSON;
	  		});
	  
		    scope = $rootScope.$new();
		    localStorage = $localStorage;
		    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue({
		        sessionToken: 'fakeSessionToken',companyData: '[{companyTypeId : 1, baseCurrencyId: 2}]'
		    });
		    
		    ReportsCtrl = $controller('ReportsCtrl', {
		        $scope: scope,
		    });
		    	 
	  }));

	  describe('controller init', function() {

		    it('should define Scope Reports', function() {
		      expect(localStorage.featuresInRole.REPORT.REPORT[0].featureCode).toEqual('REPORT');
		      expect(identityAccessFactory).toBeDefined();
		      expect(identityAccessFactory.getSessionObject).toHaveBeenCalled();
		      expect(identityAccessFactory.getSessionObject().companyData).toBeDefined();
		    });
	 });
	
});
