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
      var steps = {
        'dispatch': [
          {
            label: 'Create Store Instance',
            uri: '/store-instance-create/' + action + (id ? '/' + id : '')
          },
          {
            label: 'Packing',
            uri: '/store-instance-packing/' + action + '/' + id,
            stepName: '1',
          },
          {
            label: 'Assign Seals',
            uri: '/store-instance-seals/' + action + '/' + id,
            stepName: '2',
          },
          {
            label: 'Review & Dispatch',
            uri: '/store-instance-review/' + action + '/' + id,
            stepName: '3',
          }
        ],
        'replenish': [
          {
            label: 'Create Store Replenish',
            uri: '/store-instance-create/' + action + (id ? '/' + id : '')
          },
          {
            label: 'Replenish Packing',
            uri: '/store-instance-packing/' + action + '/' + id,
            stepName: '1',
          },
          {
            label: 'Assign Replenish Seals',
            uri: '/store-instance-seals/' + action + '/' + id,
            stepName: '2',
          },
          {
            label: 'Review & Dispatch Replenish',
            uri: '/store-instance-review/' + action + '/' + id,
            stepName: '3',
          }
        ],
        'end-instance': [
          {
            label: 'End Store Instance',
            uri: '/store-instance-create/' + action + (id ? '/' + id : '')
          },
          {
            label: 'Inbound Seals',
            uri: '/store-instance-seals/' + action + '/' + id,
            stepName: '1',
          },
          {
            label: 'Packing',
            uri: '/store-instance-packing/' + action + '/' + id,
            stepName: '2',
          },
          {
            label: 'Review & End Dispatch',
            uri: '/store-instance-review/' + action + '/' + id,
            stepName: '3',
          }
        ]
      };
      return steps[action];
    }
    return{
      getSteps: getSteps
    };
  });
