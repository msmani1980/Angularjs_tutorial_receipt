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
      var dataToTestFromAPI;

      beforeEach(function(){
        $httpBackend.expectGET(/transactions/);
        transactionService.getTransactionList().then(function (dataFromAPI) {
          dataToTestFromAPI = dataFromAPI
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

  });

});
