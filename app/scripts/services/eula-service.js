'use strict';

/**
 * @ngdoc service
 * @name ts5App.eulaService
 * @description
 * # eulaService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('eulaService', function($resource, ENV, $rootScope) {

    var requestURL = ENV.apiUrl + '/api/eula/:version';

    var requestParameters = {
      version: '@version'
    };

    var actions = {
      getEULAList: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      getEULA: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getEULAList = function() {
      return requestResource.getEULAList().$promise;
    };

    var getEULA = function(version) {
      return requestResource.getEULA({
        version: version
      }).$promise;
    };

    function setEULA(eulaList) {
      $rootScope.eula = decodeURI(eulaList.response[0].eula);
    }

    function getCurrentEULA() {
      return getEULAList().then(setEULA);
    }

    function showEULAConfirmation() {
      getCurrentEULA();
      angular.element('#eula-confirmation-modal').modal('show');
      angular.element('#loading').modal('hide');
    }

    return {
      getEULAList: getEULAList,
      getEULA: getEULA,
      showEULAConfirmation: showEULAConfirmation,
      getCurrentEULA: getCurrentEULA
    };

  });
