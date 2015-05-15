// TODO: Add create, edit, delete tests 

'use strict';

describe('Sales Categories Service |', function () {

  // instantiate service
  var salesCategoriesService,
    $httpBackend,
    testObject,
    response,
    salesCategoriesJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/sales-categories.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_salesCategoriesService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedSalesCategories_) {
      salesCategoriesJSON = _servedSalesCategories_;
    });

    salesCategoriesService = _salesCategoriesService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  it('The service should exist', function () {
    expect(salesCategoriesService).toBeDefined();
  });

  // Sales Categories API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(salesCategoriesService, 'getSalesCategoriesList').and.callFake(function () {
        return salesCategoriesJSON;
      });

      // make the mock query call
      response = salesCategoriesService.getSalesCategoriesList();

      // grab first item in list
      testObject = response.salesCategories[0];

    });

    it('should be able call the getSalesCategoriesList method', function () {
      expect(salesCategoriesService.getSalesCategoriesList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should receive a response with a salesCategories array', function () {
      expect(response.salesCategories).toBeDefined();
    });

    it('should have at least one object inside the salesCategories array', function () {
      expect(response.salesCategories.length).toBeGreaterThan(0);
    });

    it('should contain a Sales Category object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Sales Category object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Sales Category object to have an companyId', function () {
      expect(testObject.companyId).toBeDefined();
    });


    it('should expect the Sales Category object to have an parentId', function () {
      expect(testObject.parentId).toBeDefined();
    });

    it('should expect the Sales Category object to have a name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe Sales Categories api

});

