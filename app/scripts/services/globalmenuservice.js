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

    // TODO: User switch or logout only?
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

    // TODO: Add more if need be.
    // TODO: Move out to json?
    var languageModel = {
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
      '326': {
        id: 326,
        name: 'TS5 QA'
      },
      '2': {
        id: 2,
        name: 'JetBlue'
      },
      '403': {
        id: 403,
        name: 'British Airways'
      },
      '213': {
        id: 213,
        name: 'Acme'
      }
    };

    var defaults = {};
    defaults.user = userModel['1'];
    defaults.language = languageModel['1'];
    defaults.company = 2;

    $localStorage.$default(defaults);

    $rootScope.user = $localStorage.user;
    $rootScope.language = $localStorage.language;
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

    // Language
    function getLanguage() {
      return $localStorage.language;
    }

    function setLanguage(_language_) {
      var languageObj = languageModel[_language_];

      $localStorage.language = languageObj;
      $rootScope.language = $localStorage.language;

    }

    // Company
    function getCompany() {
      return $localStorage.company;
    }

    function setCompany(_company_) {
      var companyObj = companyModel[_company_];

      $localStorage.company = _company_;
      $rootScope.company = $localStorage.company;

    }

    // Public API here
    return {
      'user': {
        'get': getUser,
        'set': setUser,
        'getModel': userModel
      },
      'language': {
        'get': getLanguage,
        'set': setLanguage,
        'getModel': languageModel
      },
      'company': {
        'get': getCompany,
        'set': setCompany,
        'getModel': companyModel
      }
    };
  });
