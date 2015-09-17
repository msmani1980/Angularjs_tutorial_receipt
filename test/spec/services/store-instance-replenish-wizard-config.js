'use strict';

describe('Service: storeInstanceReplenishWizardConfig', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceReplenishWizardConfig;
  var mockConfig;
  var mockId;
  beforeEach(inject(function (_storeInstanceReplenishWizardConfig_) {
    storeInstanceReplenishWizardConfig = _storeInstanceReplenishWizardConfig_;
    mockId = 12;
    mockConfig = [
      {
        label: 'Create Store Replenish',
        uri: '/store-instance-create/' + mockId + '/replenish'
      },
      {
        label: 'Replenish Packing',
        uri: '/store-instance-packing/' + mockId + '/replenish'
      },
      {
        label: 'Assign Replenish Seals',
        uri: '/store-instance-seals/' + mockId + '/replenish'
      },
      {
        label: 'Review & Dispatch Replenish',
        uri: '/store-instance-review/' + mockId + '/replenish'
      }
    ];
  }));

  it('should match mocked replenish config', function(){
    var config = storeInstanceReplenishWizardConfig.getSteps(mockId);
    expect(config).toEqual(mockConfig);
  });
});
