'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceWizardConfig
 * @description
 * # storeInstanceWizardConfig
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceWizardConfig', function () {
    function getSteps(action, id){
      if (!action) {
        action = 'dispatch';
      }
      return {
        dispatch:
          [
            {
              label: 'Create Store Instance',
              uri: '/store-instance-create/' + action + (id ? '/' + id : '')
            },
            {
              label: 'Packing',
              uri: '/store-instance-packing/' + action + '/' + id
            },
            {
              label: 'Assign Seals',
              uri: '/store-instance-seals/' + action + '/' + id
            },
            {
              label: 'Review & Dispatch',
              uri: '/store-instance-review/' + action + '/' + id
            }
          ],
        replenish:
        [
          {
            label: 'Create Store Replenish',
            uri: '/store-instance-create/' + action + (id ? '/' + id : '')
          },
          {
            label: 'Replenish Packing',
            uri: '/store-instance-packing/' + action + '/' + id
          },
          {
            label: 'Assign Replenish Seals',
            uri: '/store-instance-seals/' + action + '/' + id
          },
          {
            label: 'Review & Dispatch Replenish',
            uri: '/store-instance-review/' + action + '/' + id
          }
        ]
      }[action];
    }
    return{
      getSteps: getSteps
    };
  });
