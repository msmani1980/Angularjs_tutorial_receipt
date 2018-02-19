'use strict';

/**
 * @ngdoc service
 * @name ts5App.accessService
 * @description
 * # accessService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('accessService', function ($localStorage) {

    var isTaskCodeEquals = function (task1, task2) {
      return task1 === task2;
    };
    
    var getFeatureRoles = function() {
      return angular.copy($localStorage.featuresInRole);
    };
		
    this.crudAccessGranted = function (module, submodule, taskCode) {
      var isCrudAcess = false;
      var featuresInRoleJson = getFeatureRoles();
      var featuresInRolemodule = featuresInRoleJson[module];
      var featuresInRoles = featuresInRolemodule[submodule];
      angular.forEach(featuresInRoles, function(featureRole) {
        var permissonCodes = featureRole.permissionCode;
        if (isTaskCodeEquals(featureRole.taskCode, taskCode) && (permissonCodes.indexOf('C') !== -1 || permissonCodes.indexOf('U') !== -1 || 
            permissonCodes.indexOf('D') !== -1)) {
          isCrudAcess = true;
        }

      });
      
      return isCrudAcess;
    };

  });
