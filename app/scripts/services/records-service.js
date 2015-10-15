'use strict';

/**
 * @ngdoc service
 * @name ts5App.recordsService
 * @description
 * # recordsService
 * Service in the ts5App.
 */

angular.module('ts5App')
  .service('recordsService', function ($resource, $http, ENV) {

    var requestURL = ENV.apiUrl + '/api/records/:api';
    var requestParameters = {
      api: '@api'
    };
    var actions = {
      getCrewBaseTypes: {
        method: 'GET',
        isArray: true
      },
      getCommissionPayableTypes: {
        method: 'GET',
        isArray: true
      },
      getDiscountTypes: {
        method: 'GET',
        isArray: true
      },
      getStoreStatusList: {
        method: 'GET',
        isArray: true
      },
      getBenefitTypes: {
        method: 'GET',
        isArray: true
      },
      getPromotionTypes: {
        method: 'GET',
        isArray: true
      },
      getDiscountApplyTypes: {
        method: 'GET',
        isArray: true
      },
      getItemTypes: {
        method: 'GET',
        isArray: true
      },
      getCharacteristics: {
        method: 'GET',
        isArray: true
      },
      getFeatures: {
        method: 'GET',
        isArray: true
      },
      getCountTypes: {
        method: 'GET',
        isArray: true
      }
    };
    var requestResource = $resource(requestURL, requestParameters, actions);

    function getCrewBaseTypes() {
      requestParameters.api = 'crew-base-types';
      return requestResource.getCrewBaseTypes().$promise;
    }

    function getCommissionPayableTypes() {
      requestParameters.api = 'commission-payable-types';
      return requestResource.getCommissionPayableTypes().$promise;
    }

    function getDiscountTypes() {
      requestParameters.api = 'discount-types';
      return requestResource.getDiscountTypes().$promise;
    }

    function getStoreStatusList() {
      requestParameters.api = 'store-status';
      return requestResource.getStoreStatusList().$promise;
    }

    function getBenefitTypes() {
      requestParameters.api = 'benefit-types';
      return requestResource.getBenefitTypes().$promise;
    }

    function getPromotionTypes() {
      requestParameters.api = 'promotion-types';
      return requestResource.getPromotionTypes().$promise;
    }

    function getDiscountApplyTypes() {
      requestParameters.api = 'discount-apply-types';
      return requestResource.getDiscountApplyTypes().$promise;
    }

    function getItemTypes() {
      requestParameters.api = 'item-types';
      return requestResource.getItemTypes().$promise;
    }

    function getCharacteristics() {
      requestParameters.api = 'characteristics';
      return requestResource.getCharacteristics().$promise;
    }

    function getFeatures() {
      requestParameters.api = 'features';
      return requestResource.getFeatures().$promise;
    }

    function getCountTypes() {
      requestParameters.api = 'count-types';
      return requestResource.getCountTypes().$promise;
    }

    return {
      getCrewBaseTypes: getCrewBaseTypes,
      getCommissionPayableTypes: getCommissionPayableTypes,
      getDiscountTypes: getDiscountTypes,
      getStoreStatusList: getStoreStatusList,
      getBenefitTypes: getBenefitTypes,
      getPromotionTypes: getPromotionTypes,
      getDiscountApplyTypes: getDiscountApplyTypes,
      getItemTypes: getItemTypes,
      getCharacteristics: getCharacteristics,
      getFeatures: getFeatures,
      getCountTypes: getCountTypes
    };
  });
