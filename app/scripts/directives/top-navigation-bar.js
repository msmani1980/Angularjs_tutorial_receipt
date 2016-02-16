'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:topNavigationBar
 * @description
 * # topNavigationBar
 */
angular.module('ts5App')
  .directive('topNavigationBar', function (identityAccessFactory, companyRelationshipFactory, lodash) {

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

      function setRetailForCHModel(companyListFromAPI) {
        $scope.cashHandlerRetailCompanyList = angular.copy(companyListFromAPI.companyRelationships);
      }

      $scope.selectCHRetailCompany = function (companyType) {
        if ($scope.pickedCompany[companyType].chCompany) {
          $scope.shouldDisableChangeCompany = false;
        }
      };

      $scope.selectCompany = function (companyType) {
        $scope.shouldDisableChangeCompany = false;
        var companyTypeIndex = Object.keys($scope.pickedCompany);
        lodash.forEach(companyTypeIndex, function (company) {
          if (company !== companyType) {
            delete $scope.pickedCompany[company];
          }
        });

        if (companyType === 'Cash Handler') {
          $scope.shouldDisableChangeCompany = true;
          var pickedCompany = $scope.pickedCompany[companyType];
          companyRelationshipFactory.getCompanyRelationshipListByCompany(pickedCompany.id).then(setRetailForCHModel);
        }
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

        var companyTypeName = selectedCompany.type.companyTypeName;
        $scope.pickedCompany[companyTypeName] = selectedCompany;

        if (companyTypeName === 'Cash Handler') {
          companyRelationshipFactory.getCompanyRelationshipListByCompany(selectedCompany.id).then(function (companyList) {
            setRetailForCHModel(companyList);
            $scope.pickedCompany[companyTypeName].chCompany = lodash.where($scope.cashHandlerRetailCompanyList,
              { companyId: $scope.userObject.companyData.chCompany.companyId })[0];
          });
        }

      }

      function getSelectedCompany() {
        var selectedCompany = {};
        $scope.shouldDisableChangeCompany = true;
        $scope.pickedCompany = [];
        $scope.cashHandlerRetailCompanyList = [];
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

      $scope.setSelectedCompany = function () {
        var companyType = Object.keys($scope.pickedCompany);
        var selectedCompany = $scope.pickedCompany[companyType];
        identityAccessFactory.setSelectedCompany(angular.copy(selectedCompany));
        angular.element('#userSettingsModal').modal('hide');
        showCompanyInfo();
      };

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
