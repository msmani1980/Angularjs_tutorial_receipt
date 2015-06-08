'use strict';

describe('Filter: dateRange |', function () {

  // load the filter's module
  beforeEach(module('ts5App'));

  it('should be injected and defined', inject(function ($filter) {
    var dateRange = $filter('daterange');
    expect(dateRange).toBeDefined();
  }));

});
