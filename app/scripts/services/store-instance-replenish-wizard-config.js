'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceReplenishWizardConfig
 * @description
 * # storeInstanceReplenishWizardConfig
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceReplenishWizardConfig', function () {
    function getSteps(id){
      return [
        {
          label: 'Create Store Replenish',
          uri: '/store-instance-create/' + id + '/replenish'
        },
        {
          label: 'Replenish Packing',
          uri: '/store-instance-packing/' + id + '/replenish'
        },
        {
          label: 'Assign Replenish Seals',
          uri: '/store-instance-seals/' + id + '/replenish'
        },
        {
          label: 'Review & Dispatch Replenish',
          uri: '/store-instance-review/' + id + '/replenish'
        }
      ];
    }
    return{
      getSteps: getSteps
    };
  });
