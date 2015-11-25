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

  describe('controller init', function () {
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
           package: 'RETAIL',
           role: 'RETAILITEM'
         }, {
           name: 'Create Item',
           route: '/#/item-create',
           icon: 'icon-create-retail-item',
           className: 'dashboard-createItem',
           package: 'RETAIL',
           role: 'RETAILITEM',
           permissions: [{
             apiName: '/api/retail-items',
             permissionCodes: ['C']
           }]
         }, {
           name: 'Manage Categories',
           route: emberURL + 'retail-items/categories',
           icon: 'icon-manage-retail-category',
           className: 'dashboard-manageItemCategories',
           package: 'RETAIL',
           role: 'RETAILITEMCATEGORY'
         }]
       },{
         title: 'Promotion Management',
         menuItems: [{
           name: 'Promotion Catalog',
           route: emberURL + 'promotion-catalogs',
           icon: 'icon-create-catalog',
           className: 'dashboard-createCatalog',
           package: 'PROMOTION',
           role: 'PROMOTIONCATALOG',
           permissions: [{
             apiName: '/api/company-promotion-catalogs',
             permissionCodes: ['C']
           }]
         }]
       },{
         title: 'Post Trip Data',
         menuItems: [{
           name: 'Manage Post Trip Data',
           route: '/#/post-trip-data-list',
           icon: 'icon-manage-menu',
           className: 'dashboard-postTripDataList',
           package: 'POSTTRIP',
           role: 'POSTTRIP'
         }]
       },{
         title: 'Stock Manager',
         menuItems: [{
           name: 'Stock Dashboard',
           route: '/#/stock-dashboard',
           icon: 'icon-manage-schedule',
           className: 'dashboard-stockDashboard',
           package: 'STOCKMANAGER',
           role: 'STOCKDASHBOARD'
         }, {
           name: 'Stock Take Report',
           route: '/#/stock-take-report',
           icon: 'icon-manage-schedule',
           className: 'dashboard-stockTakeReport',
           package: 'STOCKMANAGER',
           role: 'STOCKREPORT'
         }, {
           name: 'Manage Goods Received',
           route: '/#/manage-goods-received',
           icon: 'icon-manage-schedule',
           className: 'dashboard-manageGoodsReceived',
           package: 'STATIONOPERATIONS',
           role: 'RECEIVE'
         }
       ]}
      ]);
    });
  });

});
