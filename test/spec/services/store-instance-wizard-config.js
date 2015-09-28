'use strict';

describe('Service: storeInstanceWizardConfig', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceWizardConfig;
  var mockedConfigDispatch;
  var mockedConfigReplenish;
  var mockedConfigEndInstance;
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
    mockedConfigEndInstance = [
      {
        label: 'End Store Instance',
        uri: '/store-instance-create/end-instance/' + mockId,
      },
      {
        label: 'Inbound Seals',
        uri: '/store-instance-seals/end-instance/' + mockId,
        stepName: '1',
      },
      {
        label: 'Packing',
        uri: '/store-instance-packing/end-instance/' + mockId,
        stepName: '2',
      },
      {
        label: 'Review & End Dispatch',
        uri: '/store-instance-review/end-instance/' + mockId,
        stepName: '3',
      }
    ];
  }));

  it('should return the dispatch wizard steps', function(){
    var configDispatch = storeInstanceWizardConfig.getSteps('dispatch', mockId);
    expect(configDispatch).toEqual(mockedConfigDispatch);
  });

  it('should return the replenish wizard steps', function(){
    var configReplenish = storeInstanceWizardConfig.getSteps('replenish', mockId);
    expect(configReplenish).toEqual(mockedConfigReplenish);
  });

  it('should match mocked end-instance config', function(){
    var configDispatch = storeInstanceWizardConfig.getSteps('end-instance', mockId);
    expect(configDispatch).toEqual(mockedConfigEndInstance);
  });
});
