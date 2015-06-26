'use strict';

describe('Filter: dateRange |', function () {

  var itemsJSON, dateRange;

  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list-date-range.json'));

  beforeEach(inject(function ($filter) {
    inject(function (_servedItemsListDateRange_) {
      itemsJSON = _servedItemsListDateRange_.retailItems;
    });

    dateRange = $filter('daterange');
    dateRange.filterItems = function (items, startDateFilter, endDateFilter) {
      return dateRange(items, startDateFilter, endDateFilter);
    };

  }));

  it('should be injected and defined', function () {
    expect(dateRange).toBeDefined();
  });

  it('should have itemsJSON injected and defined for testing', function () {
    expect(itemsJSON).toBeDefined();
  });

  it(
    'should return an identical array of items, if no date filters are passed', function () {
      var items = dateRange(itemsJSON);
      expect(items).toEqual(itemsJSON);
    });

  it('should return an array of filtered items', function () {
    var items = dateRange(itemsJSON, '2015-05-15', '2015-07-15');
    expect(angular.isArray(items)).toBe(true);
  });

  it('should return a an empty array, if dates are entered but faulty', function () {
    var items = dateRange(itemsJSON, '2015-05-15', '2015-05-15');
    expect(items.length).toBe(0);
  });

  it('should return all items, when no date filters passed', function () {
    var items = dateRange(itemsJSON);
    expect(items.length).toBe(50);
  });

  it('should be called with a start date', function () {
    spyOn(dateRange, 'filterItems');
    dateRange.filterItems(itemsJSON, '2015-05-15');
    expect(dateRange.filterItems).toHaveBeenCalledWith(itemsJSON, '2015-05-15');
  });

  it('should be called with a start and an end date', function () {
    spyOn(dateRange, 'filterItems');
    dateRange.filterItems(itemsJSON, '2015-05-15', '2015-07-15');
    expect(dateRange.filterItems).toHaveBeenCalledWith(itemsJSON, '2015-05-15', '2015-07-15');
  });

});
