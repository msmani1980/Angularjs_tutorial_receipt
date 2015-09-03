'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceDispatchWizardConfig
 * @description
 * # storeInstanceDispatchWizardConfig
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceDispatchWizardConfig', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    function getSteps(id){
      return [
        {
          label: 'Create Store Instance',
          uri: '/store-instance-create'
        },
        {
          label: 'Packing',
          uri: '/store-instance-packing/' + id
        },
        {
          label: 'Assign Seals',
          uri: '/store-instance-seals/' + id
        },
        {
          label: 'Review & Dispatch',
          uri: '/store-instance-review/' + id
        }

      ];
    }
    return{
      getSteps: getSteps
    };
  });
