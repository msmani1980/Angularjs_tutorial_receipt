'use strict';

describe('Items Service', function (baseUrl) {

  // instantiate service
  var itemsService,
    $httpBackend,
    responseHandler,
    url,
    itemListJSON,
    retailItemsList;

  url = baseUrl + '/api/retail-items1';

  // load the service's module
  beforeEach(module('ts5App'));

  beforeEach(inject(function (_itemsService_, $injector) {

    itemListJSON = {
     'retailItems':[
        {
           'companyId':326,
           'itemCode':'98765',
           'itemName':'CokeDietSilver',
           'itemTypeName':'Regular',
           'itemTypeId':1,
           'categoryName':'Drinks',
           'salesCategoryId':179,
           'sellingPoint':null,
           'stockOwnerCode':null,
           'onBoardName':'Diet Coke',
           'currentPrice':null,
           'description':'Silve can',
           'imageUrl':null,
           'startDate':'2015-04-15',
           'endDate':'2015-05-09',
           'keywords':null,
           'isPrintReceipt':'false',
           'id':'332',
           'subViewItems':[
              {
                 'characteristicId':null,
                 'allergenId':null,
                 'substitutionId':null,
                 'recommendedId':null,
                 'gtnType':null,
                 'gtnValue':null,
                 'mfgPartNumber':null,
                 'skuNumber':null,
                 'price':null,
                 'priceStartDate':'2015-04-16 00:00:00.0',
                 'priceEndDate':'2015-05-09 00:00:00.0',
                 'tagId':null,
                 'companyCurrencyId':null
              }
           ]
        },
        {
           'companyId':326,
           'itemCode':'max123',
           'itemName':'MaxItem',
           'itemTypeName':'Regular',
           'itemTypeId':1,
           'categoryName':'Drinks',
           'salesCategoryId':179,
           'sellingPoint':'',
           'stockOwnerCode':null,
           'onBoardName':'Max\'s Item',
           'currentPrice':null,
           'description':'coolest',
           'imageUrl':null,
           'startDate':'2015-04-17',
           'endDate':'2015-05-17',
           'keywords':'',
           'isPrintReceipt':'false',
           'id':'333',
           'subViewItems':[
              {
                 'characteristicId':null,
                 'allergenId':null,
                 'substitutionId':null,
                 'recommendedId':null,
                 'gtnType':null,
                 'gtnValue':null,
                 'mfgPartNumber':null,
                 'skuNumber':null,
                 'price':null,
                 'priceStartDate':'2015-04-17 00:00:00.0',
                 'priceEndDate':'2015-05-17 00:00:00.0',
                 'tagId':null,
                 'companyCurrencyId':null
              }
           ]
        }
      ]
    };


    itemsService = _itemsService_;

    $httpBackend = $injector.get('$httpBackend');
    responseHandler = $httpBackend.whenGET(/retail-items1/);
  
  })); // before inject

  it('should exist', function () {
    expect(!!itemsService).toBe(true);
  });

  describe('Items List API', function () {

    beforeEach(function() {

      $httpBackend.expectGET(/retail-items1/);

      spyOn(itemsService.items, 'query').and.callFake(function() {
        return itemListJSON;
      });

      retailItemsList = itemsService.items.query(); 

    });

    it('should be able call the query method', function() {
      expect(itemsService.items.query).toHaveBeenCalled();
    });

    it('should fetch a list of items', function () {
      expect(retailItemsList.retailItems).toBeDefined();
    });
     
    it('should have return atleast one item inside of retailItems', function () {
      expect(retailItemsList.retailItems.length).toBeGreaterThan(0);
    }); 


  }); // describe api calls

}); // describe item service
