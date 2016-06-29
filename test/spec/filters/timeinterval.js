'use strict';

describe('Filter: timeinterval', function () {

  // load the filter's module
  beforeEach(module('ts5App'));

  // initialize a new instance of the filter before each test
  var timeinterval;
  beforeEach(inject(function ($filter) {
    timeinterval = $filter('timeinterval');
  }));

  it('should return the input prefixed with "timeinterval filter:"', function () {
    var text = 'angularjs';
    //expect(timeinterval(text)).toBe('timeinterval filter: ' + text);
  });

});
