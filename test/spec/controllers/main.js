'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/features-in-role.json'));

  var MainCtrl;
  var identityAccessService;
  var featuresInRoleJSON;
  var featuresInRoleDeferred;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedFeaturesInRole_) {
      featuresInRoleJSON = _servedFeaturesInRole_;
    });

    featuresInRoleDeferred = $q.defer();
    featuresInRoleDeferred.resolve(featuresInRoleJSON);

    identityAccessService = $injector.get('identityAccessService');
    spyOn(identityAccessService, 'featuresInRole').and.returnValue(featuresInRoleDeferred.promise);
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  fdescribe('controller init', function () {
    it('should call featuresInRole', function () {
      expect(identityAccessService.featuresInRole).toHaveBeenCalled();
    });
    it('should define scope.dashboardMenu', function () {
      var emberURL = '/ember/#/';

      scope.$digest();
      expect(scope.dashboardMenu).toEqual([
        {
         'title': 'Retail Item Management',
         menuItems: [{
           name: 'Manage Items',
           route: '/#/item-list',
           icon: 'icon-manage-retail-item',
           className: 'dashboard-managemenuItems',
           role: 'RETAILITEM'
         }, {
           name: 'Create Item',
           route: '/#/item-create',
           icon: 'icon-create-retail-item',
           className: 'dashboard-createItem',
           role: 'RETAILITEM'
         }, {
           name: 'Manage Categories',
           route: emberURL + 'retail-items/categories',
           icon: 'icon-manage-retail-category',
           className: 'dashboard-manageItemCategories',
           role: 'RETAILITEMCATEGORY'
         }],
         roles: [ 'RETAILITEM', 'RETAILITEMCATEGORY' ]
       },{
         title: 'Cash Management',
         menuItems: [{
           name: 'Manage Cash Bag',
           route: '/#/cash-bag-list',
           icon: 'icon-create-receipt-rules',
           className: 'dashboard-manageCashBag',
           role: 'CASHBAG'
         }, {
           name: 'Cash Bag Submission',
           route: emberURL + 'cash-bag-submission',
           icon: 'icon-manage-retail-category',
           className: 'dashboard-cashBagSubmission',
           role: 'CASHBAGSUBMIT'
         }, {
           name: 'Currency Setup',
           route: '/#/currency-edit',
           icon: 'icon-manage-retail-category',
           className: 'dashboard-currencySetup',
           role: 'CASHBAGSUBMIT'
         }],
         roles: [ 'EXCHANGERATE', 'CASHBAG', 'CASHBAGSUBMIT' ]
       }
      ]);
    });
  });

});
