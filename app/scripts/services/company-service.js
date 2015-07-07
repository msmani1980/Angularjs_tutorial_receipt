// TODO: Add delete method
'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyService
 * @description
 * # companyService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/companies/:id/:action';
    var requestParameters = {
      id: '@id',
      action: '@action'
    };

    var actions = {
      getCompanyList: {
        method: 'GET',
        transformResponse: function (data/*, headers*/) {
          data = angular.fromJson(data);
          data.companies.forEach(function (company) {
            company.companyLanguages = normalizeLanguages(company.companyLanguages);
          });

          return data;
        }
      },
      getCompany: {
        method: 'GET'
      },
      createCompany: {
        method: 'POST'
      },
      updateCompany: {
        method: 'PUT'
      },
      createStore: {
        method: 'POST'
      }

    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var normalizeLanguages = function (languages) {
      return (languages.split(',')[0] !== '') ? languages.split(',').join(', ') : 'N/A';
    };

    var getCompanyList = function (payload) {
      return requestResource.getCompanyList(payload).$promise;
    };

    var getCompany = function (id) {
      return requestResource.getCompany({id: id}).$promise;
    };

    var createCompany = function (payload) {
      return requestResource.createCompany(payload).$promise;
    };

    var updateCompany = function (payload) {
      return requestResource.updateCompany(payload).$promise;
    };

    var createStore = function (payload) {
      return requestResource.createStore(payload).$promise;
    };

    return {
      getCompanyList: getCompanyList,
      getCompany: getCompany,
      createCompany: createCompany,
      updateCompany: updateCompany,
      createStore: createStore
    };
  });
