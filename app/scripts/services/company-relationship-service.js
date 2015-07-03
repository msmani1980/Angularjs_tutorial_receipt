// TODO: Complete
'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyRelationshipService
 * @description
 * # companyRelationshipService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyRelationshipService', function ($resource, $http, ENV, dateUtility) {
    var companyRelationshipRequestURL = ENV.apiUrl + '/api/companies/:id/relationships/:companyRelationshipId';
    var companyTypeRequestURL = ENV.apiUrl + '/api/company-relation/:id/types';
    var requestParameters = {
      id: '@id'
    };

    function transformResponse(data) {
      data = angular.fromJson(data);
      data.companyRelationships.forEach(function (companyRelationship) {
        companyRelationship.startDate = dateUtility.formatDateForApp(companyRelationship.startDate, 'YYYY-MM-DD');
        companyRelationship.endDate = dateUtility.formatDateForApp(companyRelationship.endDate, 'YYYY-MM-DD');
      });
      return data;
    }

    function transformRequest(data) {
      data = angular.fromJson(data);

      data.startDate = dateUtility.formatDateForAPI(data.startDate);
      data.endDate = dateUtility.formatDateForAPI(data.endDate);

      //Hack for BE
      //data.relativeCompanyId = parseInt(data.companyId) || parseInt(data.relativeCompanyId);
      delete data.original;
      delete data.isEditing;
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
        method: 'GET'
      },
      createCompanyRelationship: {
        method: 'POST',
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest)
      },
      updateCompanyRelationship: {
        method: 'PUT',
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest)
      },
      deleteCompanyRelationship: {
        method: 'DELETE'
      }
    };

    var companyRelationshipRequestResource = $resource(companyRelationshipRequestURL, requestParameters, actions);
    var typeRequestResource = $resource(companyTypeRequestURL, requestParameters, actions);

    var getCompanyRelationshipList = function (payload) {
      return companyRelationshipRequestResource.getCompanyRelationshipList(payload).$promise;
    };

    var getCompanyRelationshipListByCompany = function (id) {
      return companyRelationshipRequestResource.getCompanyRelationshipListByCompany({id: id}).$promise;
    };

    var getCompanyRelationship = function (id) {
      return companyRelationshipRequestResource.getCompanyRelationship({id: id}).$promise;
    };

    var getCompanyRelationshipTypeList = function (id) {
      return typeRequestResource.getCompanyRelationshipTypeList({id: id}).$promise;
    };

    var createCompanyRelationship = function (payload) {
      return companyRelationshipRequestResource.createCompanyRelationship({
        id: payload.companyId,
      }, payload).$promise;
    };

    var updateCompanyRelationship = function (payload) {
      return companyRelationshipRequestResource.updateCompanyRelationship({
        id: payload.companyId,
        companyRelationshipId: payload.id
      }, payload).$promise;
    };

    var deleteCompanyRelationship = function (payload) {
      return companyRelationshipRequestResource.deleteCompanyRelationship({
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
      updateCompanyRelationship: updateCompanyRelationship,
      deleteCompanyRelationship: deleteCompanyRelationship
    };
  });