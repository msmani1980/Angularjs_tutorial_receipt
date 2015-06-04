'use strict';

describe('Service: transactionService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/transactions.json'));


  var transactionService,
    $httpBackend,
    transactionsJSON;

  beforeEach(inject(function (_transactionService_, $injector) {
    inject(function (_servedTransactions_) {
      transactionsJSON = _servedTransactions_;
    });

    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/transactions/).respond(transactionsJSON);
    transactionService = _transactionService_;
  }));

  it('should do something', function () {
    expect(!!transactionService).toBe(true);
  });

  describe('API calls', function () {

    describe('getTransactionList', function () {
      var dataToTestFromAPI;

      beforeEach(function () {
        $httpBackend.expectGET(/transactions/);
        transactionService.getTransactionList().then(function (dataFromAPI) {
          dataToTestFromAPI = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should exist', function () {
        expect(!!transactionService.getTransactionList).toBe(true);
      });

      it('should return a transactions array', function () {
        expect(dataToTestFromAPI.transactions).toEqual([]);
      });

      it('should return a meta object', function () {
        expect(dataToTestFromAPI.meta).toEqual(transactionsJSON.meta);
      });

    });

    describe('error handling for getTransactionList', function () {
      var errorDataFromAPI,
        successDataFromAPI;
      beforeEach(function () {
        $httpBackend.whenGET(/transactions/).respond(404, '');
        transactionService.getTransactionList().then(
          function (dataFromAPI) {
            successDataFromAPI = dataFromAPI;
          }, function (dataFromAPI) {
            errorDataFromAPI = dataFromAPI;
          });
        $httpBackend.flush();
      });

      it('should return 404', function () {
        //console.log(successDataFromAPI, errorDataFromAPI);
        //expect(errorDataFromAPI).toEqual([]);
      });

    });

  });

});
