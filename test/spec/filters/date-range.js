'use strict';

describe('Filter: dateRange |', function () {

  var itemsJSON, dateRange;

  beforeEach(module('ts5App'));

  beforeEach(module('served/items-list.json'));

  beforeEach(inject(function($filter) {
    dateRange = $filter('daterange');

    dateRange.filterItems = function(items, startDateFilter, endDateFilter){
      return dateRange(items, startDateFilter, endDateFilter);
    };

    inject(function (_servedItemsList_) {
      itemsJSON = _servedItemsList_.retailItems;
    });

  }));

  it('should be injected and defined', inject(function () {
    expect(dateRange).toBeDefined();
  }));

  it('should return an identical array of items, if no date filters are passed', inject(function () {
    var items = dateRange(itemsJSON);
    expect(items).toEqual(itemsJSON);
  }));

  it('should be called with a start and an end date', inject(function () {
    spyOn(dateRange, 'filterItems');
    dateRange.filterItems(itemsJSON, '2015-05-15', '2015-07-15');
    expect(dateRange.filterItems).toHaveBeenCalledWith(itemsJSON, '2015-05-15', '2015-07-15');
  }));

  it('should return an array of filtered items', inject(function () {
    var items = dateRange(itemsJSON, '2015-05-15', '2015-07-15');
    expect(items.length).toBe(8);
  }));

  it('should return a an empty array, if dates criteria are not met', inject(function () {
    var items = dateRange(itemsJSON, '2015-05-15', '2015-05-15');
    expect(items.length).toBe(0);
  }));

});
