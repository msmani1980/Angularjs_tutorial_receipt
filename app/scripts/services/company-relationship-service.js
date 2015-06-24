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
    var companyRelationshipRequestURL = ENV.apiUrl + '/api/companies/:id/relationships/:companyRelationshipId';
    var companyTypeRequestURL = ENV.apiUrl + '/api/company-relation/:id/types';
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

    function transformResponseCompanyRelationshipType(data) {
      data = angular.fromJson(data);
      data.companyRelationships.forEach(function (companyRelationship) {
        normalizeDateForApp(companyRelationship);
      });
      return data;
    }

    function transformRequest(data) {
      data = angular.fromJson(data);
      normalizeDateForAPI(data);

      //Hack for BE
      //data.relativeCompanyId = parseInt(data.companyId) || parseInt(data.relativeCompanyId);
      delete data.companyId;
      delete data.companyType;
      delete data.companyName;
      delete data.companyTypeName;
      delete data.id;
      delete data.relativeCompany;
      delete data.relativeCompanyType;

      return angular.toJson(data);
    }

    // this function is from the docs: https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
    var appendTransform = function appendTransform(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    };

    var actions = {
      getCompanyRelationshipListByCompany: {
        method: 'GET',
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      getCompanyRelationshipList: {
        method: 'GET',
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      getCompanyRelationship: {
        method: 'GET'
      },
      getCompanyRelationshipTypeList: {
        //transformResponse: appendTransform($http.defaults.transformResponse, transformResponseCompanyRelationshipType),
        method: 'GET'
      },
      createCompanyRelationship: {
        method: 'POST',
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest)
      },
      updateCompanyRelationship: {
        method: 'PUT',
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest)
      }
    };

    var companyRelationshipRequestURL = $resource(companyRelationshipRequestURL, requestParameters, actions);
    var typeRequestResource = $resource(companyTypeRequestURL, requestParameters, actions);

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
      return companyRelationshipRequestURL.getCompanyRelationshipList(payload).$promise;
    };

    var getCompanyRelationshipListByCompany = function (id) {
      return companyRelationshipRequestURL.getCompanyRelationshipListByCompany({id: id}).$promise;
    };

    var getCompanyRelationship = function (id) {
      return companyRelationshipRequestURL.getCompanyRelationship({id: id}).$promise;
    };

    var getCompanyRelationshipTypeList = function (id) {
      return typeRequestResource.getCompanyRelationshipTypeList({id: id}).$promise;
    };

    var createCompanyRelationship = function (payload) {
      return companyRelationshipRequestURL.createCompanyRelationship({id: payload.companyId}, payload).$promise;
    };

    var updateCompanyRelationship = function (payload) {
      return companyRelationshipRequestURL.updateCompanyRelationship({
        id: payload.companyId,
        companyRelationshipId: payload.id
      }, payload).$promise;
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