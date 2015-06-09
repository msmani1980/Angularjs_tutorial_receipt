'use strict';

/**
 * @ngdoc service
 * @name ts5App.AuthService
 * @description
 * # AuthService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('GlobalMenuService', function ($localStorage, $rootScope) {

    var userModel = {
      '1': {
        id: 1,
        name: 'Ali Karbassi'
      },
      '2': {
        id: 2,
        name: 'Rodrigo Curiel'
      },
      '3': {
        id: 3,
        name: 'Max Felker'
      }
    };

    var settingsModel = {
      '1': {
        id: 1,
        name: 'English',
        shortName: 'en'
      },
      '2': {
        id: 2,
        name: 'Spanish',
        shortName: 'es'
      },
      '3': {
        id: 3,
        name: 'German',
        shortName: 'de'
      }
    };

    // TODO: Should pull from a factory at some point.
    var companyModel = {
      '403': {
        id: 403,
        name: 'EasyJet'
      },
      '413': {
        id: 413,
        name: 'Stock Owner'
      }
    };

    var defaults = {};
    defaults.user = userModel['1'];
    defaults.settings = settingsModel['1'];

    // TODO: Set company object instead of just number, need to refactor so ember will be happy
    defaults.company = 2;

    $localStorage.$default(defaults);

    $rootScope.user = $localStorage.user;
    $rootScope.settings = $localStorage.settings;
    $rootScope.company = $localStorage.company;

    // User
    function getUser() {
      return $localStorage.user;
    }

    function setUser(_user_) {
      var userObj = userModel[_user_];

      $localStorage.user = userObj;
      $rootScope.user = $localStorage.user;

    }

    // settings
    function getsettings() {
      return $localStorage.settings;
    }

    function setsettings(_settings_) {
      var settingsObj = settingsModel[_settings_];

      $localStorage.settings = settingsObj;
      $rootScope.settings = $localStorage.settings;

    }

    // Company
    function getCompany() {
      return $localStorage.company;
    }

    function setCompany(companyId) {
      $localStorage.company = companyId;
      $rootScope.company = $localStorage.company;
    }

    // Public API here
    return {
      'user': {
        'get': getUser,
        'set': setUser,
        'getModel': userModel
      },
      'settings': {
        'get': getsettings,
        'set': setsettings,
        'getModel': settingsModel
      },
      'company': {
        'get': getCompany,
        'set': setCompany,
        'getModel': companyModel
      }
    };
  });
