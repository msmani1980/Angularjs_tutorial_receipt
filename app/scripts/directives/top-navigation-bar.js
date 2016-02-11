'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:topNavigationBar
 * @description
 * # topNavigationBar
 */
angular.module('ts5App')
  .directive('topNavigationBar', function (identityAccessFactory, lodash) {

    function topNavigationBarController($scope) {

      $scope.pickedCompany = [];

      function hideNavBar() {
        $scope.isAuthorized = false;
      }

      function showNavBar() {
        $scope.isAuthorized = true;
      }

      $scope.logout = function () {
        identityAccessFactory.logout();
        $scope.$emit('logout');
      };

      $scope.selectCompany = function (companyType) {
        var companyTypeIndex = Object.keys($scope.pickedCompany);
        lodash.forEach(companyTypeIndex, function (company) {
          if (company !== companyType) {
            delete $scope.pickedCompany[company];
          }
        });
      };

      $scope.setSelectedCompany = function () {
        var companyType = Object.keys($scope.pickedCompany);
        $scope.selectedCompany = $scope.pickedCompany[companyType];
        identityAccessFactory.setSelectedCompany(angular.copy($scope.selectedCompany));
        angular.element('#userSettingsModal').modal('hide');
      };

      function groupUserCompanies() {
        return lodash.chain($scope.userObject.userCompanies).groupBy('type.companyTypeName').map(function (value, key) {
          return {
            type: key,
            companies: value
          };
        }).value();
      }

      function setModalValues(selectedCompany) {
        if (!selectedCompany.type) {
          return;
        }

        $scope.pickedCompany[selectedCompany.type.companyTypeName] = selectedCompany;
        if (!$scope.userSettingsForm) {
          return;
        }

        if (!$scope.userSettingsForm.hasOwnProperty(selectedCompany.type.companyTypeName)) {
          return;
        }

        $scope.userSettingsForm[selectedCompany.type.companyTypeName].$setViewValue(selectedCompany);
        $scope.userSettingsForm[selectedCompany.type.companyTypeName].$render();
      }

      function getSelectedCompany() {
        $scope.pickedCompany = [];
        var selectedCompany = {};
        lodash.forEach($scope.userCompanies, function (companyObject) {
          var company = lodash.where(companyObject.companies, { id: $scope.userObject.companyData.id })[0];
          selectedCompany = company || selectedCompany;
        });

        setModalValues(selectedCompany);

        return selectedCompany;
      }

      function showCompanyInfo() {
        $scope.isAuthorized = identityAccessFactory.isAuthorized();
        $scope.userObject = identityAccessFactory.getSessionObject();
        $scope.userCompanies = groupUserCompanies();
        $scope.selectedCompany = getSelectedCompany();
      }

      $scope.$on('unauthorized', hideNavBar);
      $scope.$on('logout', hideNavBar);
      $scope.$on('authorized', showNavBar);
      $scope.$on('company-fetched', showCompanyInfo);
      angular.element('#userSettingsModal').on('shown.bs.modal', getSelectedCompany);
      showCompanyInfo();
    }

    return {
      templateUrl: '/views/directives/top-navigation-bar.html',
      restrict: 'E',
      scope: true,
      controller: topNavigationBarController
    };

  });
