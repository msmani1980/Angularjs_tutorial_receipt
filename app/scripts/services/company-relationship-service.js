// TODO: Complete
'use strict';
/*global moment:false */

/**
 * @ngdoc service
 * @name ts5App.companyRelationshipService
 * @description
 * # companyRelationshipService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyRelationshipService', function ($resource, $http, ENV) {
    var requestURL = ENV.apiUrl + '/api/companies/:id/relationships';
    var typeRequestURL = ENV.apiUrl + '/api/company-relation/:id';
    var requestParameters = {
      id: '@id'
    };

    function formatDate(dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    }

    function transformResponse(data) {
      data = angular.fromJson(data);
      data.companyRelationships.forEach(function (companyRelationship) {
        normalizeDateForApp(companyRelationship);
      });
      return data;
    }

    function transformRequest(data) {
      if (data) {
        data = angular.fromJson(data);
        data.companyRelationships.forEach(function (companyRelationship) {
          normalizeDateForAPI(companyRelationship);
        });
      }
      return data;
    }

    // this function is from the docs: https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
    var appendTransform = function appendTransform(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    };

    var actions = {
      getCompanyRelationshipListByCompany: {
        method: 'GET',
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse),
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest)
      },
      getCompanyRelationshipList: {
        method: 'GET',
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse),
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest)
      },
      getCompanyRelationship: {
        method: 'GET'
      },
      getCompanyRelationshipTypeList: {
        method: 'GET'
      },
      createCompanyRelationship: {
        method: 'POST'
      },
      updateCompanyRelationship: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);
    var typeRequestResource = $resource(typeRequestURL, requestParameters, actions);

    var normalizeDateForApp = function (dataFromAPI, startDateKey, endDateKey) {
      var dateFromAPIFormat = 'YYYY-MM-DD';
      var dateForAppFormat = 'MM/DD/YYYY';
      startDateKey = startDateKey || 'startDate';
      endDateKey = endDateKey || 'endDate';

      dataFromAPI[startDateKey] = formatDate(dataFromAPI[startDateKey], dateFromAPIFormat, dateForAppFormat);
      dataFromAPI[endDateKey] = formatDate(dataFromAPI[endDateKey], dateFromAPIFormat, dateForAppFormat);

      return dataFromAPI;
    };

    var normalizeDateForAPI = function (dataFromAPI, startDateKey, endDateKey) {
      var dateFromAppFormat = 'MM/DD/YYYY';
      var dateForAPIFormat = 'YYYY-MM-DD';
      startDateKey = startDateKey || 'startDate';
      endDateKey = endDateKey || 'endDate';

      dataFromAPI[startDateKey] = formatDate(dataFromAPI[startDateKey], dateFromAppFormat, dateForAPIFormat);
      dataFromAPI[endDateKey] = formatDate(dataFromAPI[endDateKey], dateFromAppFormat, dateForAPIFormat);

      return dataFromAPI;
    };

    var getCompanyRelationshipList = function (payload) {
      return requestResource.getCompanyRelationshipList(payload).$promise;
    };

    var getCompanyRelationshipListByCompany = function (id) {
      return requestResource.getCompanyRelationshipListByCompany({id: id}).$promise;
    };

    var getCompanyRelationship = function (id) {
      return requestResource.getCompanyRelationship({id: id}).$promise;
    };

    var getCompanyRelationshipTypeList = function (id) {
      return typeRequestResource.getCompanyRelationshipTypeList({id: id}).$promise;
    };

    var createCompanyRelationship = function (payload) {
      return requestResource.createCompanyRelationship(payload).$promise;
    };

    var updateCompanyRelationship = function (payload) {
      return requestResource.updateCompanyRelationship(payload).$promise;
    };

    return {
      getCompanyRelationshipListByCompany: getCompanyRelationshipListByCompany,
      getCompanyRelationshipList: getCompanyRelationshipList,
      getCompanyRelationship: getCompanyRelationship,
      getCompanyRelationshipTypeList: getCompanyRelationshipTypeList,
      createCompanyRelationship: createCompanyRelationship,
      updateCompanyRelationship: updateCompanyRelationship
    };
  });