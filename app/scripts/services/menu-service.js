'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuService
 * @description
 * # menuService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('menuService', function ($rootScope, $resource, ENV, Upload, dateUtility, $http, globalMenuService, currencyFactory, lodash) {

    $rootScope.cashbagRestrictUse = true;
    $rootScope.showManageCashBag = true;
    $rootScope.showCashBagSubmission = true;

    function transformRequest(data) {
      data = angular.fromJson(data);
      if (data && data.startDate) {
        data.startDate = dateUtility.formatDateForAPI(data.startDate);
      }

      if (data && data.endDate) {
        data.endDate = dateUtility.formatDateForAPI(data.endDate);
      }

      return angular.toJson(data);
    }

    function transformResponse(data) {
      data = angular.fromJson(data);
      if (data && data.startDate) {
        data.startDate = dateUtility.formatDateForApp(data.startDate);
      }

      if (data && data.endDate) {
        data.endDate = dateUtility.formatDateForApp(data.endDate);
      }

      return data;
    }

    var appendTransform = function appendTransform(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    };

    var requestURL = ENV.apiUrl + '/rsvr/api/menus/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getMenuList: {
        method: 'GET'
      },
      getMenu: {
        method: 'GET',
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      createMenu: {
        method: 'POST',
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest),
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      updateMenu: {
        method: 'PUT',
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest),
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      deleteMenu: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getMenuList = function (payload, shouldLimit) {
      shouldLimit = angular.isDefined(shouldLimit) ? shouldLimit : true;
      requestParameters.limit = (shouldLimit) ? 50 : 0;
      return requestResource.getMenuList(payload).$promise;
    };

    var getMenu = function (menuId) {
      return requestResource.getMenu({
        id: menuId
      }).$promise;
    };

    var deleteMenu = function (menuId) {
      return requestResource.deleteMenu({
        id: menuId
      }).$promise;
    };

    var updateMenu = function (payload) {
      return requestResource.updateMenu(payload).$promise;
    };

    var createMenu = function (payload) {
      return requestResource.createMenu(payload).$promise;
    };

    var importFromExcel = function (companyId, file) {
      var uploadRequestURL = ENV.apiUrl + '/services/companies/' + companyId + '/file/menu';
      return Upload.upload({
        url: uploadRequestURL,
        file: file
      });
    };

    function getCompanyPreferenceBy(preferences, choiceName, optionName) {
      var result = null;
      angular.forEach(preferences, function (preference) {
        if (result === null && preference.choiceName === choiceName && preference.optionName === optionName && dateUtility.isTodayOrEarlier(preference.startDate)) {
          result = preference;
        }
      });

      return result;
    }

    function setCashbagRestrictUse(companyPreferencesData) {
      var orderedPreferences = lodash.sortByOrder(angular.copy(companyPreferencesData.preferences), 'startDate', 'desc');
      var cmpCashbagRestrictUse = getCompanyPreferenceBy(orderedPreferences, 'Restrict Cash Bag', 'Restrict Cash Bag Use');

      $rootScope.cashbagRestrictUse = (cmpCashbagRestrictUse && cmpCashbagRestrictUse.isSelected !== null) ? cmpCashbagRestrictUse.isSelected : true;
    }

    function isMenuCashbagRestrictUse() {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };
      var companyId = globalMenuService.getCompanyData().companyId;

      return currencyFactory.getCompanyPreferences(payload, companyId).then(setCashbagRestrictUse);
    }

    function setShowManageCashBag(dailyExchangeRatesData) {

      $rootScope.showManageCashBag = (!$rootScope.cashbagRestrictUse || (dailyExchangeRatesData && dailyExchangeRatesData.isSubmitted !== null)) ? true : false;

    }

    function isShowManageCashBagOrCashBagSubmission(isManageCashBag) {
      var todayDate = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
      var companyId = globalMenuService.getCompanyData().companyId;
      var companyData = globalMenuService.getCompanyData();
      var retailCompanyId = (companyData && companyData.chCompany) ? companyData.chCompany.companyId : -1;

      if (retailCompanyId === -1) {
        return false;
      }

      if (isManageCashBag) {
        return currencyFactory.getDailyExchangeRatesForCmp(companyId, retailCompanyId, todayDate).then(setShowManageCashBag);
      }

      return currencyFactory.getDailyExchangeRatesForCmp(companyId, retailCompanyId, todayDate).then(setShowCashBagSubmission);
    }

    function isShowManageCashBag() {

      return isShowManageCashBagOrCashBagSubmission(true);
    }

    function setShowCashBagSubmission(dailyExchangeRatesData) {

      $rootScope.showCashBagSubmission = (!$rootScope.cashbagRestrictUse || (dailyExchangeRatesData &&
      dailyExchangeRatesData.isSubmitted !== null &&
      dailyExchangeRatesData.isSubmitted)) ? true : false;
      console.log($rootScope.cashbagRestrictUse, dailyExchangeRatesData.isSubmitted, $rootScope.showCashBagSubmission);
    }

    function isShowCashBagSubmission() {

      return isShowManageCashBagOrCashBagSubmission(false);
    }

    return {
      getMenuList: getMenuList,
      deleteMenu: deleteMenu,
      getMenu: getMenu,
      updateMenu: updateMenu,
      createMenu: createMenu,
      importFromExcel: importFromExcel,
      isMenuCashbagRestrictUse: isMenuCashbagRestrictUse,
      isShowManageCashBag: isShowManageCashBag,
      isShowCashBagSubmission: isShowCashBagSubmission
    };
  });
