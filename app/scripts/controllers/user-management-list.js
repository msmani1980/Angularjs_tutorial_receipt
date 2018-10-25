'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:UserManagementListCtrl
 * @description
 * # UserManagementListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('UserManagementListCtrl', function($scope, $location, accessService, userManagementFactory, dateUtility, globalMenuService, identityAccessService) {
	
  var $this = this;
  $scope.viewName = 'User Management';
  $scope.userList = [];
  $scope.companyIds = [];
  $scope.fUserName = '';
  
  function showLoadingModal() {
    angular.element('.loading-more').show();
  }

  function hideLoadingModal() {
    angular.element('.loading-more').hide();
    angular.element('.modal-backdrop').remove();
  }

  $this.appendUsersToList = function(userListFromAPI) {
    $scope.userList = userListFromAPI;
    hideLoadingModal();
  };

  $scope.viewUser = function(user) {
    $location.path('/user-view/' + user.id);
  };

  $scope.editUser = function(user) {
    $location.path('/user-edit/' + user.id);
  };

  this.getUserListSuccess = function(dataFromAPI) {
    if (dataFromAPI !== null && dataFromAPI.length > 0) {
      $scope.userList = dataFromAPI;
    }

    hideLoadingModal();
  };

  $scope.getUpdatedOn = function (user) {
    return user.updateDate ?  dateUtility.formatTimestampForApp(user.updateDate) : '';
  };

  $scope.getExpiredDate = function (user) {
    return user.expiredDate ?  dateUtility.formatTimestampForApp(user.expiredDate) : '';
  };

  $scope.loadUsers = function() {
    var payload = $scope.companyIds;
    showLoadingModal();
    userManagementFactory.getUserList(payload).then($this.getUserListSuccess);
  };

  this.initSuccess = function(dataFromAPI) {
    if (angular.isDefined(dataFromAPI.companies)) {
      angular.forEach(dataFromAPI.companies, function(company) {
        $scope.companyIds.push(company.id);
      });
    }

    $scope.loadUsers();
  };

  this.init = function() {
    $scope.fUserName = '';
    $scope.isCRUD = accessService.crudAccessGranted('USERMANAGEMENT', 'USERMANAGEMENT', 'USRM');
    identityAccessService.getUserCompanies().then($this.initSuccess);
  };

  this.init();
});
