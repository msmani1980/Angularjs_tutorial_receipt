'use strict';

describe('Service: transactionService', function () {

  beforeEach(module('ts5App'));

  var transactionService,
    $httpBackend,
    transactionsJSON;

  beforeEach(inject(function (_transactionService_, $injector) {
    //TODO: put proper JSON
    transactionsJSON = {
      'transactions': [],
      'meta': {
        'count': 0,
        'limit': 0,
        'start': 0
      }
    };
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/transactions/).respond(transactionsJSON);
    transactionService = _transactionService_;
  }));

  it('should do something', function () {
    expect(!!transactionService).toBe(true);
  });

  describe('API calls', function () {

    describe('getTransactionList', function () {

      it('should exist', function () {
        expect(!!transactionService.getTransactionList).toBe(true);
      });

      it('should make a request to /api/transactions', function () {
        $httpBackend.expectGET(/transactions/);
        transactionService.getTransactionList();
        $httpBackend.flush();
      });

      it('should return a transactions array', function () {
        $httpBackend.expectGET(/transactions/);
        transactionService.getTransactionList().then(function (dataFromAPI) {
          expect(dataFromAPI.transactions).toEqual([]);
        });
        $httpBackend.flush();
      });

      it('should return a meta object', function () {
        $httpBackend.expectGET(/transactions/);
        transactionService.getTransactionList().then(function (dataFromAPI) {
          expect(dataFromAPI.meta).toEqual(transactionsJSON.meta);
        });
        $httpBackend.flush();
      });

      it('should return a the count of transactions in the meta object', function () {
        transactionsJSON.meta.count = 10;
        $httpBackend.expectGET(/transactions/);
        transactionService.getTransactionList().then(function (dataFromAPI) {
          expect(dataFromAPI.meta.count).toEqual(10);
        });
        $httpBackend.flush();
      });

    });

  });

});
