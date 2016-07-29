'use strict';

describe('Controller: ReportsCtrl', function () {
	  beforeEach(module('ts5App'));
	  beforeEach(module('served/features-in-role-report.json'));
	
	  var ReportsCtrl;
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
		    
		    ReportsCtrl = $controller('ReportsCtrl', {
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
