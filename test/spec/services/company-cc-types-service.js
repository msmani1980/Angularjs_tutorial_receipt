'use strict';

describe('Service: companyCcTypesService', function () {

  beforeEach(module('ts5App'));

  var companyCcTypesService,
    responseFromAPI,
    $httpBackend;

  beforeEach(inject(function (_companyCcTypesService_, $injector) {
    responseFromAPI = {'companyCCTypes':[{'id':17,'ccTypeCode':'AmEx','ccTypeId':1,'ccTypeName':'AMEX','description':'American Express','startDate':'2015-05-05','endDate':'2050-01-01','companyId':403,'companyCreditCardTypePayments':[{'id':50,'ccPaymentMethodId':1,'companyCcTypeId':17,'paymentMethod':'Magnetic Stripe'},{'id':51,'ccPaymentMethodId':3,'companyCcTypeId':17,'paymentMethod':'Contactless'},{'id':52,'ccPaymentMethodId':4,'companyCcTypeId':17,'paymentMethod':'Chip&Pin/Signature'},{'id':53,'ccPaymentMethodId':5,'companyCcTypeId':17,'paymentMethod':'Key Entry'}]},{'id':18,'ccTypeCode':'Visa','ccTypeId':19,'ccTypeName':'Visa','description':'Visa','startDate':'2015-05-05','endDate':'2050-01-01','companyId':403,'companyCreditCardTypePayments':[{'id':54,'ccPaymentMethodId':1,'companyCcTypeId':18,'paymentMethod':'Magnetic Stripe'},{'id':55,'ccPaymentMethodId':3,'companyCcTypeId':18,'paymentMethod':'Contactless'},{'id':56,'ccPaymentMethodId':4,'companyCcTypeId':18,'paymentMethod':'Chip&Pin/Signature'},{'id':57,'ccPaymentMethodId':5,'companyCcTypeId':18,'paymentMethod':'Key Entry'}]},{'id':19,'ccTypeCode':'MasterCard','ccTypeId':20,'ccTypeName':'MasterCard','description':'MasterCard','startDate':'2015-05-05','endDate':'2050-01-01','companyId':403,'companyCreditCardTypePayments':[{'id':58,'ccPaymentMethodId':1,'companyCcTypeId':19,'paymentMethod':'Magnetic Stripe'},{'id':59,'ccPaymentMethodId':3,'companyCcTypeId':19,'paymentMethod':'Contactless'},{'id':60,'ccPaymentMethodId':4,'companyCcTypeId':19,'paymentMethod':'Chip&Pin/Signature'},{'id':61,'ccPaymentMethodId':5,'companyCcTypeId':19,'paymentMethod':'Key Entry'}]}],'meta':{'count':3,'limit':3,'start':0}};
    $httpBackend = $injector.get('$httpBackend');
    companyCcTypesService = _companyCcTypesService_;
  }));

  it('should exist', function () {
    expect(!!companyCcTypesService).toBe(true);
  });

  it('should have a getCCtypes function', function () {
    expect(!!companyCcTypesService.getCCtypes).toBe(true);
  });

  describe('API calls', function(){

    beforeEach(function () {
      $httpBackend.whenGET(/company-credit-card-types/).respond(responseFromAPI);
    });

    it('should return a object containing a companyCCTypes array', function () {
      var resultFromFunction = companyCcTypesService.getCCtypes();
      expect(Object.prototype.toString.call(resultFromFunction.companyCCTypes)).toBe('[object Array]');
    });

    it('should make a request to /company-credit-card-types', function () {
      var resultFromFunction = companyCcTypesService.getCCtypes();

    });

  });

});
