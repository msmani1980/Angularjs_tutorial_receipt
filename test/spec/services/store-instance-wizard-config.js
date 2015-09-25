'use strict';

describe('Service: storeInstanceWizardConfig', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceWizardConfig;
  var mockedConfigDispatch;
  var mockedConfigReplenish;
  var mockId;
  beforeEach(inject(function (_storeInstanceWizardConfig_) {
    storeInstanceWizardConfig = _storeInstanceWizardConfig_;
    mockId = 7;
    mockedConfigDispatch = [
      {
        label: 'Create Store Instance',
        uri: '/store-instance-create/dispatch/' + mockId
      },
      {
        label: 'Packing',
        uri: '/store-instance-packing/dispatch/' + mockId,
        stepName:'1'
      },
      {
        label: 'Assign Seals',
        uri: '/store-instance-seals/dispatch/' + mockId,
        stepName:'2'
      },
      {
        label: 'Review & Dispatch',
        uri: '/store-instance-review/dispatch/' + mockId,
        stepName:'3'
      }
    ];
    mockedConfigReplenish = [
      {
        label: 'Create Store Replenish',
        uri: '/store-instance-create/replenish/' + mockId
      },
      {
        label: 'Replenish Packing',
        uri: '/store-instance-packing/replenish/' + mockId,
        stepName:'1'
      },
      {
        label: 'Assign Replenish Seals',
        uri: '/store-instance-seals/replenish/' + mockId,
        stepName:'2'
      },
      {
        label: 'Review & Dispatch Replenish',
        uri: '/store-instance-review/replenish/' + mockId,
        stepName:'3'
      }
    ];
  }));

  it('should match mocked dispatch config', function(){
    var configDispatch = storeInstanceWizardConfig.getSteps('dispatch', mockId);
    expect(configDispatch).toEqual(mockedConfigDispatch);
    var configReplenish = storeInstanceWizardConfig.getSteps('replenish', mockId);
    expect(configReplenish).toEqual(mockedConfigReplenish);
  });
});
