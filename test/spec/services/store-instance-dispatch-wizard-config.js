'use strict';

describe('Service: storeInstanceDispatchWizardConfig', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceDispatchWizardConfig;
  var mockedConfigDispatch;
  var mockedConfigReplenish;
  var mockId;
  beforeEach(inject(function (_storeInstanceDispatchWizardConfig_) {
    storeInstanceDispatchWizardConfig = _storeInstanceDispatchWizardConfig_;
    mockId = 7;
    mockedConfigDispatch = [
      {
        label: 'Create Store Instance',
        uri: '/store-instance-create/dispatch/' + mockId
      },
      {
        label: 'Packing',
        uri: '/store-instance-packing/dispatch/' + mockId
      },
      {
        label: 'Assign Seals',
        uri: '/store-instance-seals/dispatch/' + mockId
      },
      {
        label: 'Review & Dispatch',
        uri: '/store-instance-review/dispatch/' + mockId
      }
    ];
    mockedConfigReplenish = [
      {
        label: 'Create Store Replenish',
        uri: '/store-instance-create/replenish/' + mockId
      },
      {
        label: 'Replenish Packing',
        uri: '/store-instance-packing/replenish/' + mockId
      },
      {
        label: 'Assign Replenish Seals',
        uri: '/store-instance-seals/replenish/' + mockId
      },
      {
        label: 'Review & Dispatch Replenish',
        uri: '/store-instance-review/replenish/' + mockId
      }
    ];
  }));

  it('should match mocked dispatch config', function(){
    var configDispatch = storeInstanceDispatchWizardConfig.getSteps('dispatch', mockId);
    expect(configDispatch).toEqual(mockedConfigDispatch);
    var configReplenish = storeInstanceDispatchWizardConfig.getSteps('replenish', mockId);
    expect(configReplenish).toEqual(mockedConfigReplenish);
  });
});
