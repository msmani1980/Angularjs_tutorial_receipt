'use strict';

describe('Service: socketIO', function () {

  beforeEach(module('ts5App'));

  var socketIO;
  beforeEach(inject(function (_socketIO_) {
    socketIO = _socketIO_;
  }));

  it('should do something', function () {
    expect(!!socketIO).toBe(true);
  });

});
