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
  .service('companyService', function($resource, ENV) {
    var requestURL = ENV.apiUrl + '/rsvr/api/companies/:id';
    var imagesRequestURL = ENV.apiUrl + '/rsvr/api/companies/images/:id';

    var requestParameters = {
      id: '@id'
    };

    var normalizeLanguages = function(languages) {
      return (languages !== undefined && languages.split(',')[0] !== '') ? languages.split(',').join(', ') : 'N/A';
    };

    var actions = {
      getCompanyList: {
        method: 'GET',
        transformResponse: function(data) {
          data = angular.fromJson(data);
          data.companies.forEach(function(company) {
            company.companyLanguages = normalizeLanguages(company.companyLanguages);
          });

          return data;
        }
      },
      getCompany: {
        method: 'GET'
      },
      getCompanyImages: {
        method: 'GET'
      },
      createCompany: {
        method: 'POST'
      },
      updateCompany: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);
    var imagesRequestResource = $resource(imagesRequestURL, requestParameters, actions);

    var getCompanyList = function(payload) {
      return requestResource.getCompanyList(payload).$promise;
    };

    var getCompanyImages = function(payload) {
      return imagesRequestResource.getCompanyImages(payload).$promise;
    };

    var getCompany = function(id) {
      return requestResource.getCompany({
        id: id
      }).$promise;
    };

    var createCompany = function(payload) {
      return requestResource.createCompany(payload).$promise;
    };

    var updateCompany = function(id, payload) {
      return requestResource.updateCompany({
        id: id
      }, payload).$promise;
    };

    return {
      getCompanyList: getCompanyList,
      getCompany: getCompany,
      createCompany: createCompany,
      updateCompany: updateCompany,
      getCompanyImages: getCompanyImages
    };
  });
