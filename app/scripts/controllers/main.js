'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MainCtrl', function ($scope, companiesFactory, GlobalMenuService) {
    var $this = this;
    var emberURL = '/ember/#/';
    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
    var companyId = GlobalMenuService.company.get();
    $scope.viewName = 'TS5 Dashboard';

    // changes the navigation depeneding on what company type you have
    function updateNavigationPerCompanyType() {
      companiesFactory.getCompany(companyId).then(function (response) {
        var companyTypeId = response.companyTypeId;

        switch (companyTypeId) {
        case 2:
          $scope.dashboardMenu = $this.stockOwnerMenu;
          break;
        default:
          $scope.dashboardMenu = $this.retailMenu;
          break;
        }
      });
    }

    updateNavigationPerCompanyType();

    this.stockOwnerMenu = [{
      'title': 'Stock Owner Item Management',
      menuItems: [{
        name: 'Manage SO Items',
        route: '/#/stock-owner-item-list',
        icon: 'icon-manage-retail-item',
        className: 'dashboard-managemenuItems'
      }, {
        name: 'Create SO Item',
        route: '/#/stock-owner-item-create',
        icon: 'icon-create-retail-item',
        className: 'dashboard-createItem'
      }, {
        name: 'Manage SO Categories',
        route: emberURL + 'retail-items/categories',
        icon: 'icon-manage-retail-category',
        className: 'dashboard-manageItemCategories'
      }]
    }];
    this.retailMenu = [{
      'title': 'Retail Item Management',
      menuItems: [{
        name: 'Manage Items',
        route: '/#/item-list',
        icon: 'icon-manage-retail-item',
        className: 'dashboard-managemenuItems'
      }, {
        name: 'Create Item',
        route: '/#/item-create',
        icon: 'icon-create-retail-item',
        className: 'dashboard-createItem'
      }, {
        name: 'Manage Categories',
        route: emberURL + 'retail-items/categories',
        icon: 'icon-manage-retail-category',
        className: 'dashboard-manageItemCategories'
      }]
    }, {
      'title': 'Company Management',
      'menuItems': [{
        name: 'Manage Companies',
        route: '/#/company-list',
        icon: 'icon-manage-company',
        className: 'dashboard-manageCompanies'
      }, {
        name: 'Create Company',
        route: emberURL + 'companies/create',
        icon: 'icon-create-company',
        className: 'dashboard-createCompany'
      }]
    }, {
      title: 'Schedule Management',
      menuItems: [{
        name: 'Manage Schedules',
        route: emberURL + 'schedules',
        icon: 'icon-manage-schedule',
        className: 'dashboard-manageSchedules'
      }]
    }, {
      title: 'Tax Management',
      menuItems: [{
        name: 'Manage Taxes',
        route: emberURL + 'tax-rates',
        icon: 'icon-manage-taxes',
        className: 'dashboard-manageTaxes'
      }]
    }, {
      title: 'Menu Management',
      menuItems: [{
        name: 'Manage Menus',
        route: '/#/menu-list',
        icon: 'icon-manage-menu',
        className: 'dashboard-manageMenus'
      }, {
        name: 'Create Menu',
        route: emberURL + 'menus/create',
        icon: 'icon-create-menu',
        className: 'dashboard-createMenu'
      }, ]
    }, {
      title: 'Menu Assignment',
      menuItems: [{
        name: 'Menu Assignments',
        route: emberURL + 'menu-assignments',
        icon: 'icon-menu-assignment',
        className: 'dashboard-menuAssignments'
      }, {
        name: 'Manage Rules',
        route: emberURL + 'menu-rules',
        icon: 'icon-manage-rules',
        className: 'dashboard-manageRules'
      }, {
        name: 'Create Rule',
        route: emberURL + 'menu-rules/create',
        icon: 'icon-create-rules',
        className: 'dashboard-createRules'
      }]
    }, {
      title: 'Menu-Catering Station Relationship',
      menuItems: [{
        name: 'Manage Relationships',
        route: '/#/menu-relationship-list',
        icon: 'icon-menu-assignment',
        className: 'dashboard-menuAssignments'
      }, {
        name: 'Create Relationship',
        route: '/#/menu-relationship-create',
        icon: 'icon-create-menu',
        className: 'dashboard-menuAssignments'
      }, ]
    }, {
      title: 'Promotion Management',
      menuItems: [{
        name: 'Manage Promotions',
        route: emberURL + 'promotions',
        icon: 'icon-manage-promotion',
        className: 'dashboard-managePromotions'
      }, {
        name: 'Create Promotion',
        route: emberURL + 'promotions/create',
        icon: 'icon-create-promotion',
        className: 'dashboard-createPromotion'
      }, {
        name: 'Promotion Category',
        route: emberURL + 'category',
        icon: 'icon-manage-promotion-category',
        className: 'dashboard-managePromotionCategory'
      }, {
        name: 'Promotion Catalog',
        route: emberURL + 'promotion-catalogs',
        icon: 'icon-create-catalog',
        className: 'dashboard-createCatalog'
      }]
    }, {
      title: 'Discount Management',
      menuItems: [{
        name: 'Manage Discounts',
        route: emberURL + 'discounts',
        icon: 'icon-manage-discount',
        className: 'dashboard-manageDiscount'
      }, {
        name: 'Create Discount',
        route: emberURL + 'discounts/create',
        icon: 'icon-create-discount',
        className: 'dashboard-createDiscount'
      }]
    }, {
      title: 'Employee Messages',
      menuItems: [{
        name: 'Manage Messages',
        route: emberURL + 'employee-messages',
        icon: 'icon-employee-messages',
        className: 'dashboard-manageEmployeeMessages'
      }]
    }, {
      title: 'Receipt Rule',
      menuItems: [{
        name: 'Manage Rules',
        route: emberURL + 'receipt-rules',
        icon: 'icon-manage-receipt-rules',
        className: 'dashboard-manageReceiptRules'
      }, {
        name: 'Create Rules',
        route: emberURL + 'receipt-rules/create',
        icon: 'icon-create-receipt-rules',
        className: 'dashboard-createReceiptRule'
      }]
    }, {
      title: 'Transaction Retrieval',
      menuItems: [{
        name: 'Manage Transactions',
        route: emberURL + 'transactions',
        icon: 'icon-manage-transactions',
        className: 'dashboard-manageTransactions'
      }]
    }, {
      title: 'Cash Management',
      menuItems: [{
        name: 'Daily Exchange Rate',
        route: '/#/exchange-rates',
        icon: 'icon-manage-transactions',
        className: 'dashboard-manageDailyExchangeRates'
      }, {
        name: 'Manage Cash Bag',
        route: '/#/cash-bag-list',
        icon: 'icon-create-receipt-rules',
        className: 'dashboard-manageCashBag'
      }, {
        name: 'Cash Bag Submission',
        route: emberURL + 'cash-bag-submission',
        icon: 'icon-manage-retail-category',
        className: 'dashboard-cashBagSubmission'
      }]
    }, {
      title: 'Post Trip Data',
      menuItems: [{
        name: 'Manage Post Trip Data',
        route: '/#/post-trip-data-list',
        icon: 'icon-manage-menu',
        className: 'dashboard-postTripDataList'
      }, {
        name: 'Create Post Trip Data',
        route: '/#/post-trip-data/create',
        icon: 'icon-create-menu',
        className: 'dashboard-postTripData'
      }]
    }, {
      title: 'Employee Commission',
      menuItems: [{
        name: 'Employee Commission',
        route: '/#/employee-commission-list',
        icon: 'icon-manage-schedule',
        className: 'dashboard-employeeCommission'
      }]
    }, {
      title: 'Reason',
      menuItems: [{
        name: 'Global Reason',
        route: '/#/global-reason-code',
        icon: 'icon-manage-schedule',
        className: 'dashboard-globalReasonCode'
      }, {
        name: 'Company Reason',
        route: '/#/company-reason-code',
        icon: 'icon-manage-schedule',
        className: 'dashboard-companyReasonCode'
      }]
    }, {
        title: 'Station Operations',
        menuItems: [{
          name: 'Manage LMP Locations',
          route: '/#/lmp-locations-list',
          icon: 'icon-manage-schedule',
          className: 'dashboard-lmpLocationsList'
        }]
    }, {
        title: 'Stock Manager',
        menuItems: [{
	      name: 'Stock Dashboard',
	      route: '/#/stock-dashboard',
	      icon: 'icon-manage-schedule',
	      className: 'dashboard-stockDashboard'
      	},{
          name: 'Manage Goods Received',
          route: '/#/manage-goods-received',
          icon: 'icon-manage-schedule',
          className: 'dashboard-manageGoodsReceived'
        }, {
          name: 'Create Delivery Note',
          route: '/#/delivery-note',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-deliveryNote'
        }]
  	}, {
      title: 'Manage Store Number',
      menuItems: [{
        name: 'Store Number Create',
        route: '/#/store-number-create',
        icon: 'icon-create-company',
        className: 'dashboard-storeNumberCreate'
      }]
    }];

  });
