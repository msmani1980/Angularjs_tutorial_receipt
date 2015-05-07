'use strict';

/**
 * @ngdoc service
 * @name ts5App.tagsService
 * @description
 * # tagsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('tagsService', function ($resource, baseUrl,GlobalMenuService) {

  	var company = GlobalMenuService.company.get();

    var requestURL = baseUrl + '/api/companies/'+company.id+'/tags/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getTagsList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getTagsList = function (payload) {
      return requestResource.getTagsList(payload).$promise;
    };

    return {
      getTagsList: getTagsList
    };

});