'use strict';

describe('Service: transactionFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var transactionFactory,
    transactionService;

  beforeEach(inject(function (_transactionFactory_, _transactionService_) {
    transactionFactory = _transactionFactory_;
    transactionService = _transactionService_;

    spyOn(transactionService, 'getTransactionList');
  }));

  it('should call getCatererStation', function() {
    var payload = {id: 1};
    transactionFactory.getTransactionList(payload);

    expect(transactionService.getTransactionList).toHaveBeenCalledWith(payload);
  });
});
