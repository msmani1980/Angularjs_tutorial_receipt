'use strict';

/**
 * @ngdoc service
 * @name ts5App.imageLogo
 * @description
 * # imageLogo
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('imageLogoService', function($resource, ENV) {

    var imageLogoRequestURL = ENV.apiUrl + '/rsvr/api/companies/images/:id';
    var imageLogoActions = {
      getImageLogo: {
        method: 'GET',
        headers: {}
      }
    };

    var requestParameters = {
      id: '@id'
    };

    var imageLogoActionsResource = $resource(imageLogoRequestURL, requestParameters, imageLogoActions);

    function getImageLogo(id) {
      requestParameters.id = id;
      return imageLogoActionsResource.getImageLogo(id).$promise;
    };

    return {
      getImageLogo: getImageLogo
    };

  });
