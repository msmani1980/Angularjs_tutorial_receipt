'use strict';

describe('Controller: EmployeeListCtrl', function () {

	  beforeEach(module('ts5App'));
	  beforeEach(module('served/company-currency-globals.json'));
	  beforeEach(module('served/country-list.json'));

	  var EmployeeListCtrl;
	  var scope;
	  var companyId;
	  var employeesFactory;
	  var location;
	  var dateUtility;

	  var stationsListDeferred;
	  var countrieListDeferred;

	  var stationsResponseJSON;
	  var countrieResponseJSON;

	  beforeEach(inject(function($controller, $rootScope, $injector, $q, $location) {
	    inject(function(_servedCompanyCurrencyGlobals_, _servedCountryList_) {
	      stationsResponseJSON = _servedCompanyCurrencyGlobals_;
	      countrieResponseJSON = _servedCountryList_;
	    });

	    location = $location;
	    employeesFactory = $injector.get('employeesFactory');
	    dateUtility = $injector.get('dateUtility');
	    scope = $rootScope.$new();

	    stationsListDeferred = $q.defer();
	    stationsListDeferred.resolve(stationsResponseJSON);

	    countrieListDeferred = $q.defer();
	    countrieListDeferred.resolve(countrieResponseJSON);

	    spyOn(employeesFactory, 'getCompanyGlobalStationList').and.returnValue(stationsListDeferred.promise);
	    spyOn(employeesFactory, 'getCountriesList').and.returnValue(countrieListDeferred.promise);
	    spyOn(employeesFactory, 'getCompanyId').and.returnValue('fakeCompanyId');

	    companyId = receiptsFactory.getCompanyId();
	    
	    EmployeeListCtrl = $controller('EmployeeListCtrl', {
	        $scope: scope
	    });
	    
	    scope.$digest();
	  }));

	  describe('scope globals', function() {
	    it('should have Employee attached to scope', function() {
	      expect(scope.globalStationList).toBeDefined();
	    });

	    it('should have viewName attached to scope', function() {
	        expect(scope.viewName).toBeDefined();
	    });

	  });


	});
