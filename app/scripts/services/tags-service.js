'use strict';

/**
 * @ngdoc service
 * @name ts5App.tagsService
 * @description
 * # tagsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('tagsService', function ($resource, ENV, GlobalMenuService) {

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice

    var requestURL = ENV.apiUrl + '/api/companies/:companyId/tags/:id';
    var requestParameters = {
      id: '@id',
      companyId: '@companyId'
    };

    var actions = {
      getTagsList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getTagsList = function (payload) {
      payload = payload || {};
      payload.companyId = GlobalMenuService.company.get();
      return requestResource.getTagsList(payload).$promise;
    };

    return {
      getTagsList: getTagsList
    };

  });
