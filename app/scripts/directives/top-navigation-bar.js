'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:topNavigationBar
 * @description
 * # topNavigationBar
 */
angular.module('ts5App')
  .directive('topNavigationBar', function (identityAccessFactory, companyRelationshipFactory, lodash, $location) {

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

      $scope.changePassword = function () {
        $location.url('/change-password');
      };

      function correctRelativeCompanyData(company) {
        var selectedCompanyName = $scope.pickedCompany['Cash Handler'].companyName;
        if (selectedCompanyName === company.companyName) {
          var placeholderCompany = angular.copy(company);
          company.companyName = company.relativeCompany;
          company.companyTypeName = company.relativeCompanyType;
          company.companyId = company.relativeCompanyId;

          company.relativeCompany = placeholderCompany.companyName;
          company.relativeCompanyType = placeholderCompany.companyTypeName;
          company.relativeCompanyId = placeholderCompany.companyId;
        }
      }

      function setRetailForCHModel(companyListFromAPI) {
        var retailCompanyList = lodash.findWhere($scope.userCompanies, { type: 'Retail' });
        var selectedCompanyName = ($scope.pickedCompany['Cash Handler']) ? $scope.pickedCompany['Cash Handler'].companyName : null;
        if (!retailCompanyList || !selectedCompanyName) {
          return [];
        }

        $scope.cashHandlerRetailCompanyList = lodash.filter(angular.copy(companyListFromAPI.companyRelationships), function (company) {
          correctRelativeCompanyData(company);
          return lodash.findIndex(retailCompanyList.companies, { companyName: company.companyName }) >= 0 && company.companyTypeName === 'Retail';
        });

      }

      $scope.selectCHRetailCompany = function (companyType) {
        if ($scope.pickedCompany[companyType].chCompany) {
          $scope.shouldDisableChangeCompany = false;
        }
      };

      $scope.selectCompany = function (companyType) {
        $scope.shouldDisableChangeCompany = false;
        $scope.shouldDisableCHSelect = true;
        var companyTypeIndex = Object.keys($scope.pickedCompany);
        lodash.forEach(companyTypeIndex, function (company) {
          if (company !== companyType) {
            delete $scope.pickedCompany[company];
          }
        });

        if (companyType === 'Cash Handler') {
          $scope.shouldDisableCHSelect = false;
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

      function setRelationForCH(companyList, companyTypeName) {
        setRetailForCHModel(companyList);
        if ($scope.userObject.companyData.chCompany) {
          $scope.pickedCompany[companyTypeName].chCompany = lodash.where($scope.cashHandlerRetailCompanyList,
            { relativeCompanyId: $scope.userObject.companyData.id })[0];
        }
      }

      function setCHModelValues(selectedCompany) {
        var companyTypeName = selectedCompany.type.companyTypeName;
        $scope.shouldDisableCHSelect = false;
        companyRelationshipFactory.getCompanyRelationshipListByCompany(selectedCompany.id).then(function (companyList) {
          setRelationForCH(companyList, companyTypeName);
        });
      }

      function setModalValues(selectedCompany) {
        if (!selectedCompany.type) {
          return;
        }

        var companyTypeName = selectedCompany.type.companyTypeName;
        $scope.pickedCompany[companyTypeName] = selectedCompany;

        if (companyTypeName === 'Cash Handler') {
          setCHModelValues(selectedCompany);
        }

      }

      function getSelectedCompany() {
        var selectedCompany = {};
        $scope.shouldDisableChangeCompany = true;
        $scope.shouldDisableCHSelect = true;
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

      $scope.closeModal = function () {
        showCompanyInfo();
        angular.element('#userSettingsModal').modal('hide');
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
