'use strict';

/**
 * @ngdoc service
 * @name ts5App.userManagementFactory
 * @description
 * # userManagementFactory
 * Factory in the ts5App.
 */
angular.module('ts5App').factory('userManagementFactory', function (userManagementService) {

  function getUser (id) {
    return userManagementService.getUser(id);
  }

  function getUserList (payload) { 
    return userManagementService.userList(payload);
  }

  return {
    getUser: getUser,
    getUserList: getUserList
  };

});

