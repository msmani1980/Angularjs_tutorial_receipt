'use strict';

describe('Filter: index', function() {

  // load the filter's module
  beforeEach(module('ts5App'));

  // initialize a new instance of the filter before each test
  var index;
  beforeEach(inject(function($filter) {
    index = $filter('index');
  }));

  it('should return the input prefixed with "index filter:"', function() {
    var text = 'angularjs';
    expect(index(text)).toBe(text);
  });

});
