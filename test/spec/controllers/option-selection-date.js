'use strict';

describe('Controller: OptionSelectionDateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  
  var dateUtility;
  var scope;
  var OptionSelectionDateCtrl;
  
  beforeEach(inject(function($controller, $rootScope, $injector) {
	    inject(function() {
	    	dateUtility = $injector.get('dateUtility');
  		});
  
	    scope = $rootScope.$new();
	
	    OptionSelectionDateCtrl = $controller('OptionSelectionDateCtrl', {
	     $scope: scope
	    });
  
  }));
  
  describe('get Date Format By Company', function () {
	    it('should get date format by company ', function () {
	     
	      scope.format = dateUtility.getDateFormatForApp().toLowerCase();
	      
	      scope.format = scope.format.replace('mm', 'MM');

	      expect(scope.format).toContain('MM');
	      
	    });

  });
  
  
});
