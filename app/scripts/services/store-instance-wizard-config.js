'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceWizardConfig
 * @description
 * # storeInstanceWizardConfig
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceWizardConfig', function() {

    var createURL = '/store-instance-create/';
    var packingURL = '/store-instance-packing/';
    var sealsURL = '/store-instance-seals/';
    var reviewURL = '/store-instance-review/';

    function setSteps(action, id) {
      var steps = {
        'dispatch': [{
          label: 'Create Store Instance',
          uri: createURL + action + (id ? '/' + id : ''),
          controllerName: 'Create'
        }, {
          label: 'Packing',
          uri: packingURL + action + '/' + id,
          stepName: '1',
          controllerName: 'Packing'
        }, {
          label: 'Assign Seals',
          uri: sealsURL + action + '/' + id,
          stepName: '2',
          controllerName: 'Seals'
        }, {
          label: 'Review & Dispatch',
          uri: reviewURL + action + '/' + id,
          stepName: '3',
          controllerName: 'Review'
        }],
        'replenish': [{
          label: 'Create Store Replenish',
          uri: createURL + action + (id ? '/' + id : ''),
          controllerName: 'Create'
        }, {
          label: 'Replenish Packing',
          uri: packingURL + action + '/' + id,
          stepName: '1',
          controllerName: 'Packing'
        }, {
          label: 'Assign Replenish Seals',
          uri: sealsURL + action + '/' + id,
          stepName: '2',
          controllerName: 'Seals'
        }, {
          label: 'Review & Dispatch Replenish',
          uri: reviewURL + action + '/' + id,
          stepName: '3',
          controllerName: 'Review'
        }],
        'end-instance': [{
          label: 'End Store Instance',
          uri: createURL + action + (id ? '/' + id : ''),
          stepName: '5',
          controllerName: 'Create'
        }, {
          label: 'Inbound Seals',
          uri: sealsURL + action + '/' + id,
          stepName: '6',
          controllerName: 'Seals'
        }, {
          label: 'Packing',
          uri: packingURL + action + '/' + id,
          stepName: '7',
          controllerName: 'Packing'
        }, {
          label: 'Review & End Dispatch',
          uri: reviewURL + action + '/' + id,
          stepName: '7',
          controllerName: 'Review'
        }],
        'redispatch': [{
          label: 'Create Store Instance',
          uri: createURL + action + (id ? '/' + id : ''),
          stepName: '5',
          controllerName: 'Create'
        }, {
          label: 'Inbound Seals',
          uri: sealsURL + action + '/' + id,
          stepName: '6',
          controllerName: 'Seals'
        }, {
          label: 'Packing',
          uri: packingURL + action + '/' + id,
          stepName: '1',
          controllerName: 'Packing'
        }, {
          label: 'Assign Seals',
          uri: sealsURL + action + '/' + id,
          stepName: '2',
          controllerName: 'Seals'
        }, {
          label: 'Review & Dispatch',
          uri: reviewURL + action + '/' + id,
          stepName: '3',
          controllerName: 'Review'
        }]
      };
      return steps;
    }

    function getSteps(action, id) {
      if (!action) {
        action = 'dispatch';
      }
      var steps = setSteps(action, id);

      return steps[action];
    }
    return {
      getSteps: getSteps
    };
  });
