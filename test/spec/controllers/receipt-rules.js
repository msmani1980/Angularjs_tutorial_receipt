'use strict';

describe('Controller: ReceiptRulesCtrl', function () {

	  beforeEach(module('ts5App'));
	  beforeEach(module('served/company-currency-globals.json'));
	  beforeEach(module('served/country-list.json'));

	  var ReceiptRulesCtrl;
	  var scope;
	  var companyId;
	  var receiptsFactory;
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
	    receiptsFactory = $injector.get('receiptsFactory');
	    dateUtility = $injector.get('dateUtility');
	    scope = $rootScope.$new();

	    stationsListDeferred = $q.defer();
	    stationsListDeferred.resolve(stationsResponseJSON);

	    countrieListDeferred = $q.defer();
	    countrieListDeferred.resolve(countrieResponseJSON);

	    spyOn(receiptsFactory, 'getCompanyGlobalStationList').and.returnValue(stationsListDeferred.promise);
	    spyOn(receiptsFactory, 'getCountriesList').and.returnValue(countrieListDeferred.promise);
	    spyOn(receiptsFactory, 'getCompanyId').and.returnValue('fakeCompanyId');

	    companyId = receiptsFactory.getCompanyId();
	    
	    ReceiptRulesCtrl = $controller('ReceiptRulesCtrl', {
	        $scope: scope
	    });
	    
	    scope.$digest();
	  }));

	  describe('scope globals', function() {
	    it('should have ReceiptRule attached to scope', function() {
	      expect(scope.globalStationList).toBeDefined();
	    });

	    it('should have viewName attached to scope', function() {
	        expect(scope.viewName).toBeDefined();
	    });

	  });


	});

