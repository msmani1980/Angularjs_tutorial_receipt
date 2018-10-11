'use strict';
/*jshint maxcomplexity:6 */
/**
 * @ngdoc function
 * @name ts5App.controller:UserCreateCtrl
 * @description
 * # UserCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('UserCreateCtrl', function ($localStorage, $scope, $compile, ENV, $resource, $location, $anchorScroll, dateUtility, $routeParams, globalMenuService, $q, $filter, lodash, userManagementService, identityAccessFactory) {
    $scope.formData = {
      id:null,
      oldUserName: '',
      userName: '',
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      organizationId:'',
      allowAllStations:false,
      eulaVersion: null,
      enabled: false,
      expiredDate: '',
      roles: [],
      companies: [],
      stations: []
    };

    $scope.viewName = 'Create User';
    $scope.buttonText = 'Create';
    $scope.userIsActive = false;
    $scope.userIsInactive = false;
    $scope.viewOnly = false;
    $scope.editingUser = false;
    $scope.creatingUser = false;
    $scope.displayError = false;
    $scope.organizations = [];
    $scope.allRolesList = [];
    $scope.adminAndUserLevelRolesList = [];
    $scope.adminLevelRolesList = [];
    $scope.userLevelRolesList = [];
    $scope.egateLevelRolesList = [];
    $scope.userRolesList = [];
    $scope.selectedRoles = [];
    $scope.userPrivilegeList = [{ id:1, name:'All' }, { id:2, name:'User Level' }, { id:3, name:'Admin Level' }, { id:4, name:'eGate Level' }];
    $scope.userPrivilege = { id:1, name:'All' };
    $scope.selectedCompanies = [];
    $scope.allActiveCompaniesList = [];
    $scope.allStationsList = [];
    $scope.selectedStations = [];
    var $this = this;

    $scope.getClassForAccordionArrows = function (accordionFlag) {
      return (accordionFlag) ? 'fa-chevron-down' : 'fa-chevron-right';
    };

    $scope.changeUserPrivilege = function (id) {
      $scope.allRoleCheckboxesSelected = false;
      $scope.userPrivilege.id =  id;

      if (id === 1) {
        $scope.allRolesList = $scope.adminAndUserLevelRolesList; 
      }

      if (id === 2) {
        $scope.allRolesList = $scope.userLevelRolesList; 
      }

      if (id === 3) {
        $scope.allRolesList = $scope.adminLevelRolesList; 
      }

      if (id === 4) {
        $scope.allRolesList = $scope.egateLevelRolesList; 
      }

      $scope.roleSelectionToggled();
    };

    $scope.setUserPrivilege = function (userPrivilegeId) {
      if (userPrivilegeId === 1) {
        $scope.userPrivilege = { id:1, name:'All' }; 
      }

      if (userPrivilegeId === 2) {
        $scope.userPrivilege = { id:2, name:'User Level' }; 
      }

      if (userPrivilegeId === 3) {
        $scope.userPrivilege = { id:3, name:'Admin Level' }; 
      }

      if (userPrivilegeId === 4) {
        $scope.userPrivilege = { id:4, name:'eGate Level' }; 
      }
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.errorHandler = function(dataFromAPI) {
      $this.hideLoadingModal();
      if (angular.isDefined(dataFromAPI.data) && dataFromAPI.data !== null && dataFromAPI.data !== '') {
        showCustomError('', dataFromAPI.data);
      } else {
        $scope.displayError = true;
        $scope.errorResponse = angular.copy(dataFromAPI);
      }  
    };

    function showCustomError(errorField, errorMessage) {
      $scope.errorCustom = [{ field: errorField, value: errorMessage }];
      $scope.displayError = true;
    }

    this.validateForm = function() {
      $scope.displayError = !$scope.form.$valid;
      return $scope.form.$valid;
    };

    this.submitFormSuccess = function() {
      angular.element('#loading').modal('hide');
      angular.element('#update-success').modal('show');
    };

    this.createSubmitFormSuccess = function(response) {
      var promises = [
        userManagementService.updateUserRoles($scope.selectedRoles, response.id),
        userManagementService.updateUserCompanies($scope.selectedCompanies, response.id),
        userManagementService.updateUserStations($scope.selectedStations, response.id)
      ];

      $q.all(promises).then($this.submitFormSuccess, $this.errorHandler);
    };

    $scope.roleSelectionToggled = function () {
      $scope.selectedRoles = [];
      lodash.forEach($scope.allRolesList, function (role) {
        if (role.selected) {
          $scope.selectedRoles.push(role.id);
        }
      });
    };

    $scope.companySelectionToggled = function () {
      $scope.selectedCompanies = [];
      lodash.forEach($scope.allActiveCompaniesList, function (company) {
        if (company.selected) {
          $scope.selectedCompanies.push(company.id);
        }
      });
    };

    $scope.stationSelectionToggled = function () {
      $scope.selectedStations = [];
      lodash.forEach($scope.allStationsList, function (station) {
        if (station.selected) {
          $scope.selectedStations.push(station.id);
        }
      });
    };

    $scope.toggleAllRoleCheckboxes = function () {
      $scope.allRoleCheckboxesSelected = $scope.allRoleCheckboxesSelected ? false : true;
      angular.forEach($scope.allRolesList, function (role) {
        role.selected = $scope.allRoleCheckboxesSelected;
      });

      $scope.roleSelectionToggled();
    };

    $scope.toggleAllCompanyCheckboxes = function () {
      $scope.allCompanyCheckboxesSelected = $scope.allCompanyCheckboxesSelected ? false : true;
      angular.forEach($scope.allActiveCompaniesList, function (company) {
        company.selected = $scope.allCompanyCheckboxesSelected;
      });

      $scope.companySelectionToggled();
    };

    $scope.toggleAllStationCheckboxes = function () {
      $scope.allStationCheckboxesSelected = $scope.allStationCheckboxesSelected ? false : true;
      angular.forEach($scope.allStationsList, function (station) {
        station.selected = $scope.allStationCheckboxesSelected;
      });

      $scope.stationSelectionToggled();
    };

    $scope.submitForm = function(formData) {
      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm()) {
        var userData = angular.copy(formData);
        var expiredDate = ((userData.expiredDate === '' || userData.expiredDate === null) ? '' : dateUtility.formatDateForAPI(userData.expiredDate, null, 'YYYY-MM-DD'));
        var person = {
          id: userData.id, 
          userName: userData.userName,
          allowStations: userData.allowAllStations, 
          enabled: userData.enabled, 
          organizationId: userData.organization.id, 
          expired: expiredDate,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        };

        if ($scope.editingUser) {
          var promises = [
            userManagementService.updateUser(person),
            userManagementService.updateUserRoles($scope.selectedRoles, person.id),
            userManagementService.updateUserCompanies($scope.selectedCompanies, person.id),
            userManagementService.updateUserStations($scope.selectedStations, person.id)
          ];
          $q.all(promises).then($this.submitFormSuccess, $this.errorHandler);
        }

        if ($scope.creatingUser) {
          userManagementService.createUser(person).then($this.createSubmitFormSuccess, $this.errorHandler);
        }
      }
    };

    this.checkFormState = function() {
      var path = $location.path();
      if (path.search('/user-edit') !== -1 && $routeParams.user) {
        $scope.editingUser = true;
        $scope.buttonText = 'Save';
        $scope.viewName = 'Editing User ' + $scope.formData.userName;
      } else if (path.search('/user-view') !== -1 && $routeParams.user) {
        $scope.viewOnly = true;
        $scope.viewName = 'Viewing User ' + $scope.formData.userName;
      } else if (path.search('/user-create') !== -1) {
        $scope.creatingUser = true;
      }
    };

    this.getPromises = function() {
      var sessionObject = identityAccessFactory.getSessionObject();
      var promises = [
        userManagementService.userById($routeParams.user),
        userManagementService.getOrganizations(),
        userManagementService.getAllRoles(),
        userManagementService.getUserRoles($routeParams.user),
        userManagementService.getUserCompanies($routeParams.user),
        userManagementService.getAllActiveCompanies(),
        userManagementService.getUserStations($routeParams.user),
        userManagementService.getUserAllStations(sessionObject.userId)
      ];

      return promises;
    };

    this.getDependenciesPromises = function() {
      var sessionObject = identityAccessFactory.getSessionObject();
      var promises = [
        userManagementService.getOrganizations(),
        userManagementService.getAllRoles(),
        userManagementService.getAllActiveCompanies(),
        userManagementService.getUserAllStations(sessionObject.userId)
      ];

      return promises;
    };

    this.getUserData = function() {
      $this.showLoadingModal('We are loading user data!');
      var path = $location.path();
      if (path.search('/user-create') !== -1) {
        $scope.creatingUser = true;
      }

      if ($scope.creatingUser) {
        var dependenciesPromises = $this.getDependenciesPromises();
        $q.all(dependenciesPromises).then($this.initDependenciesSuccess, $this.errorHandler);
      }else {
        var promises = $this.getPromises();
        $q.all(promises).then($this.initSuccess, $this.errorHandler);
      }
    };  
  
    this.initDependenciesSuccess = function(response) {
      var organizationList = angular.copy(response[0]);
      angular.forEach(organizationList, function (organztn) {
        var organization = { id:organztn.id, name:organztn.name };
        $scope.organizations.push(organization);
      });

      $this.initRoles(angular.copy(response[1]));
      $scope.allRolesList = $scope.adminAndUserLevelRolesList;
      $scope.setUserPrivilege(1);

      $this.initActiveCompanies(angular.copy(response[2]));
      $this.initStations(angular.copy(response[3]));
      
      $this.hideLoadingModal();
    };

    this.initSuccess = function(response) {
      $this.hideLoadingModal();
      var userData = angular.copy(response[0]);
      $this.initOrganizations(angular.copy(response[1]));
      $this.initRoles(angular.copy(response[2]));
      $this.initUserRoles(angular.copy(response[3]));
      $this.initActiveCompanies(angular.copy(response[5]));
      setSelectedCompanies(angular.copy(response[4]));
      $this.initStations(angular.copy(response[7]));
      setSelectedStations(angular.copy(response[6]));
      $this.initUI(userData);  
    };

    this.initOrganizations = function (organizationList) {
      angular.forEach(organizationList, function (organztn) {
        var organization = { id:organztn.id, name:organztn.name };
        $scope.organizations.push(organization);
      });
    };

    this.initRoles = function (rolesDataList) {
      angular.forEach(rolesDataList, function (roleData) {
        var role = {
          id: roleData.id,
          admin: roleData.admin,
          roleName: roleData.roleName,
          selected: false
        };
        if (!roleData.admin) {
          $scope.adminAndUserLevelRolesList.push(role);
          if (roleData.roleName.endsWith('Admin')) {
            $scope.adminLevelRolesList.push(role);
          }

          if (roleData.roleName.endsWith('User')) {
            $scope.userLevelRolesList.push(role);
          }
        }else {
          $scope.egateLevelRolesList.push(role);
        }
      });
    };

    this.initUserRoles = function (rolesDataList) {
      var isAdminRole = false;
      var isUserRole = false;
      var isEgateRole = false;
      var userPrivilegeId = 1;
      var userRoles = []; 
      angular.forEach(rolesDataList, function (roleData) {
        var role = {
          id:roleData.id,
        };
        if (!roleData.admin) {
          if (roleData.roleName.endsWith('Admin')) {
            isAdminRole = true;	
          }

          if (roleData.roleName.endsWith('User')) {
            isUserRole = true;	
          }
        }else {
          isEgateRole = true;
        }

        userRoles.push(role);
      });

      if (isEgateRole) {
        userPrivilegeId = 4;
        $scope.allRolesList = $scope.egateLevelRolesList;
      }else if (isAdminRole && !isUserRole) {
        userPrivilegeId = 3;
        $scope.allRolesList = $scope.adminLevelRolesList;
      }else if (!isAdminRole && isUserRole) {
        userPrivilegeId = 2;
        $scope.allRolesList = $scope.userLevelRolesList;
      }else {
        userPrivilegeId = 1;
        $scope.allRolesList = $scope.adminAndUserLevelRolesList;
      }

      setSelectedRoles(userRoles);
      $scope.roleSelectionToggled();
      $scope.setUserPrivilege(userPrivilegeId);
    };

    function setSelectedRoles (userRoles) {
      angular.forEach(userRoles, function (userRole) {
        $scope.selectedRoles.push(userRole.id);
        angular.forEach($scope.allRolesList, function (role) {
          if (role.id === userRole.id) {
            role.selected = true;
          }
        });
      });
    }

    this.initActiveCompanies = function (cmpList) {
      angular.forEach(cmpList, function (company) {
        var cpm = {
          id: company.id,
          companyCode: company.companyCode,
          companyName: company.companyName,
          selected: false
        };

        $scope.allActiveCompaniesList.push(cpm);
      });
    };

    this.initStations = function (stationList) {
      angular.forEach(stationList, function (station) {
        var st = {
          id: station.id,
          code: station.stationCode,
          name: station.stationName,
          city: station.city.cityName,
          region: station.city.region.regionName,
          country: '[ ' + station.country.countryCode.trim() + ' ] ' + station.country.countryName,
          selected: false
        };
        $scope.allStationsList.push(st);
      });
    };

    function setSelectedCompanies (userCompanies) {
      angular.forEach(userCompanies, function (userCmp) {
        $scope.selectedCompanies.push(userCmp.company.id);
        angular.forEach($scope.allActiveCompaniesList, function (cmp) {
          if (cmp.id === userCmp.company.id) {
            cmp.selected = true;
          }
        });
      });
    }

    function setSelectedStations (userStations) {
      angular.forEach(userStations, function (userSt) {
        $scope.selectedStations.push(userSt.station.id);
        angular.forEach($scope.allStationsList, function (st) {
          if (st.id === userSt.station.id) {
            st.selected = true;
          }
        });
      });
    }

    $scope.backToList = function() {
      $location.path('/user-list/');
    };

    this.initUI = function(userData) {
      $scope.formData.id = userData.id;
      $scope.formData.userName = userData.userName;
      $scope.formData.oldUserName = userData.userName;
      $scope.formData.email = userData.email;
      $scope.formData.firstName = userData.firstName;
      $scope.formData.lastName = userData.lastName;
      $scope.formData.company = getUserCompany(userData);
      $scope.formData.organizationId = userData.organizationId;
      $scope.formData.organization = getUserOrganization(userData.organizationId);
      $scope.formData.allowAllStations = userData.allowStations;
      $scope.formData.eulaVersion = userData.eulaVersion;
      $scope.formData.enabled = userData.enabled;
      $scope.formData.expiredDate = ((userData.expired === '' || userData.expired === null) ? '' : dateUtility.formatDateForApp(userData.expired));
    };
  
    function getUserOrganization (organizationId) {
      var usrOrg = lodash.findWhere($scope.organizations, {
        id: organizationId
      });
      return usrOrg;
    }

    function getUserCompany (userData) {
      var company = '';
      if (angular.isDefined(userData.companiesView) && userData.companiesView !== null && userData.companiesView.length > 0) {
        var usrCmp = lodash.findWhere(userData.companiesView, {
          id: userData.companyId
        });

        if (angular.isDefined(usrCmp.id) && angular.isDefined(usrCmp.companyCode) && angular.isDefined(usrCmp.companyName)) { 
          company = usrCmp.id + ' [' + usrCmp.companyCode + '] ' + usrCmp.companyName;
        }
      }

      return company;
    }
  
    this.init = function() {
      $scope.allRoleCheckboxesSelected = false;
      $scope.allCompanyCheckboxesSelected = false;
      $scope.allStationCheckboxesSelected = false;
      $this.getUserData();
      $this.checkFormState();
    };

    $this.init(); 
  });
  