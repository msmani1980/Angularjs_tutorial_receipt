'use strict';

describe('Controller: ReportOptionsCtrl', function () {
	
	  beforeEach(module('ts5App'));
	
	  var scope, $compile;
	  	  
	  beforeEach(inject(function($rootScope,  _$compile_) {
	  
		    scope = $rootScope.$new();
		    $compile = _$compile_;
		    
	  }));

	  describe('controller init', function() {

		    it('should define Scope Report emailMe', function() {
		      scope.emailMe = true;
		      scope.$digest();
		      expect(scope.emailMe).toBe(true);
		    });
	 });
});
