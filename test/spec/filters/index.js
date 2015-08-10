'use strict';

describe('Filter: index', function() {

  // load the filter's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json'));

  // initialize a new instance of the filter before each test
  var index, itemsListJSON, indexedItems;
  beforeEach(inject(function($filter, _servedItemsList_) {
    index = $filter('index');
    itemsListJSON = _servedItemsList_.retailItems;
  }));

  it('should be injected and defined', function() {
    expect(index).toBeDefined();
  });

  it('should be false if no array is defined', function() {
    indexedItems = index(null, true);
    expect(indexedItems).toBeFalsy();
  });

  it('should inject itemsList and be defined', function() {
    indexedItems = index(itemsListJSON, true);
    expect(indexedItems).toBeDefined();
  });

  it('should inject itemsList length to equal itemsListJSON length', function() {
    indexedItems = index(itemsListJSON, true);
    expect(indexedItems.length).toEqual(itemsListJSON.length);
  });

  it('should inject itemsList with index passed by custom filter', function() {
    indexedItems = index(itemsListJSON, true);
    expect(indexedItems[0].index).toBeDefined();
  });

});
