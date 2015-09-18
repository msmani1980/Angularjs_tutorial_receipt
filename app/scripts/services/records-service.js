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

    return {
      getCrewBaseTypes: getCrewBaseTypes,
      getCommissionPayableTypes: getCommissionPayableTypes,
      getDiscountTypes: getDiscountTypes,
      getStoreStatusList: getStoreStatusList,
      getBenefitTypes: getBenefitTypes
    };
  });
