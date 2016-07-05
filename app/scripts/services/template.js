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
<<<<<<< HEAD
    return $resource(ENV.apiUrl + '/report-api/templates/:templateId', { templateId:'@id' });
=======
    return $resource(ENV.apiUrl + '/report-api/templates/:templateId', { templateId: '@id' });
>>>>>>> remotes/origin/master
  });
