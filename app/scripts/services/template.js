'use strict';

/**
 * @ngdoc service
 * @name ts5App.template
 * @description
 * # template
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('templateService', function ($resource, ENV) {
    return $resource(ENV.apiUrl + '/report-api/templates/:templateId', { templateId:'@id' });
  });
