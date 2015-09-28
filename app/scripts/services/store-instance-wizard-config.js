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

    var createURL = '/store-instance-create/';
    var packingURL = '/store-instance-packing/';
    var sealsURL = '/store-instance-seals/';
    var reviewURL = '/store-instance-review/';

    function getSteps(action, id){
      if (!action) {
        action = 'dispatch';
      }
      var steps = {
        'dispatch': [
          {
            label: 'Create Store Instance',
            uri: createURL + action + (id ? '/' + id : '')
          },
          {
            label: 'Packing',
            uri: packingURL + action + '/' + id,
            stepName: '1',
          },
          {
            label: 'Assign Seals',
            uri: sealsURL + action + '/' + id,
            stepName: '2',
          },
          {
            label: 'Review & Dispatch',
            uri: reviewURL + action + '/' + id,
            stepName: '3',
          }
        ],
        'replenish': [
          {
            label: 'Create Store Replenish',
            uri: createURL + action + (id ? '/' + id : '')
          },
          {
            label: 'Replenish Packing',
            uri: packingURL + action + '/' + id,
            stepName: '1',
          },
          {
            label: 'Assign Replenish Seals',
            uri: sealsURL + action + '/' + id,
            stepName: '2',
          },
          {
            label: 'Review & Dispatch Replenish',
            uri: reviewURL + action + '/' + id,
            stepName: '3',
          }
        ],
        'end-instance': [
          {
            label: 'End Store Instance',
            uri: createURL + action + (id ? '/' + id : '')
          },
          {
            label: 'Inbound Seals',
            uri: sealsURL + action + '/' + id,
            stepName: '1',
          },
          {
            label: 'Packing',
            uri: packingURL + action + '/' + id,
            stepName: '2',
          },
          {
            label: 'Review & End Dispatch',
            uri: reviewURL + action + '/' + id,
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
