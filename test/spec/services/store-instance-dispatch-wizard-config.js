'use strict';

describe('Service: storeInstanceDispatchWizardConfig', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceDispatchWizardConfig;
  var mockedConfig;
  var mockId;
  beforeEach(inject(function (_storeInstanceDispatchWizardConfig_) {
    storeInstanceDispatchWizardConfig = _storeInstanceDispatchWizardConfig_;
    mockId = 7;
    mockedConfig = [
      {
        label: 'Create Store Instance',
        uri: '/store-instance-create'
      },
      {
        label: 'Packing',
        uri: '/store-instance-packing/' + mockId
      },
      {
        label: 'Assign Seals',
        uri: '/store-instance-seals/' + mockId
      },
      {
        label: 'Review & Dispatch',
        uri: '/store-instance-review/' + mockId + '/dispatch'
      }
    ];
  }));

  it('should match mocked dispatch config', function(){
    var config = storeInstanceDispatchWizardConfig.getSteps(mockId);
    expect(config).toEqual(mockedConfig);
  });
});
