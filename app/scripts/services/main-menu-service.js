'use strict';

/**
 * @ngdoc service
 * @name ts5App.mainMenuService
 * @description
 * # mainMenuService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('mainMenuService', function (lodash) {
    var $this = this;
    var emberURL = '/ember/#/';

    this.getMenu = function (companyTypeId) {
      switch (companyTypeId) {
        case 2:
          return $this.getStockOwnerMenu();
        case 1:
          return $this.getRetailMenu();
      }
    };

    this.getAll = function () {
      return angular.copy($this.getRetailMenu()).concat($this.getStockOwnerMenu());
    };

    var stockOwnerMenu = null;
    this.getStockOwnerMenu = function () {
      if (stockOwnerMenu === null) {
        stockOwnerMenu = [{
        'title': 'Stock Owner Item Management',
        menuItems: [{
          name: 'Manage SO Items',
          route: '/#/stock-owner-item-list',
          icon: 'icon-manage-retail-item',
          className: 'dashboard-managemenuItems',
          role: 'RETAILITEM'
        }, {
          name: 'Create SO Item',
          route: '/#/stock-owner-item-create',
          icon: 'icon-create-retail-item',
          className: 'dashboard-createItem',
          role: 'RETAILITEM'
        }, {
          name: 'Manage SO Categories',
          route: emberURL + 'retail-items/categories',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-manageItemCategories',
          role: 'RETAILITEMCATEGORY'
        }]
      }];
      lodash.forEach(stockOwnerMenu, function(item) {
        item.roles = lodash.map(item.menuItems, function(menuItem) { return menuItem.role; });
      });
     }
     return stockOwnerMenu;
    };

    var retailMenu = null;
    this.getRetailMenu = function () {
      if (retailMenu === null) {
       retailMenu = [{
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
        }]
      }, {
        'title': 'Company Management',
        'menuItems': [{
          name: 'Manage Companies',
          route: '/#/company-list',
          icon: 'icon-manage-company',
          className: 'dashboard-manageCompanies',
          role: 'ORGANIZATION'
        }, {
          name: 'Create Company',
          route: emberURL + 'companies/create',
          icon: 'icon-create-company',
          className: 'dashboard-createCompany',
          role: 'ORGANIZATION'
        }]
      }, {
        title: 'Schedule Management',
        menuItems: [{
          name: 'Manage Schedules',
          route: emberURL + 'schedules',
          icon: 'icon-manage-schedule',
          className: 'dashboard-manageSchedules',
          role: 'SCHEDULE'
        }]
      }, {
        title: 'Tax Management',
        menuItems: [{
          name: 'Manage Taxes',
          route: emberURL + 'tax-rates',
          icon: 'icon-manage-taxes',
          className: 'dashboard-manageTaxes',
          role: 'TAX'
        }]
      }, {
        title: 'Menu Management',
        menuItems: [{
          name: 'Manage Menus',
          route: '/#/menu-list',
          icon: 'icon-manage-menu',
          className: 'dashboard-manageMenus',
          role: 'MENU'
        }, {
          name: 'Create Menu',
          route: '/#/menu/create',
          icon: 'icon-create-menu',
          className: 'dashboard-createMenu',
          role: 'MENU'
        }]
      }, {
        title: 'Menu Assignment',
        menuItems: [{
          name: 'Menu Assignments',
          route: emberURL + 'menu-assignments',
          icon: 'icon-menu-assignment',
          className: 'dashboard-menuAssignments',
          role: 'MENUASSIGNMENT'
        }, {
          name: 'Manage Rules',
          route: emberURL + 'menu-rules',
          icon: 'icon-manage-rules',
          className: 'dashboard-manageRules',
          role: 'RULE'
        }, {
          name: 'Create Rule',
          route: emberURL + 'menu-rules/create',
          icon: 'icon-create-rules',
          className: 'dashboard-createRules',
          role: 'RULE'
        }]
      }, {
        title: 'Menu-Catering Station Relationship',
        menuItems: [{
          name: 'Manage Relationships',
          route: '/#/menu-relationship-list',
          icon: 'icon-menu-assignment',
          className: 'dashboard-menuAssignments',
          role: 'MENUSTATION'
        }, {
          name: 'Create Relationship',
          route: '/#/menu-relationship-create',
          icon: 'icon-create-menu',
          className: 'dashboard-menuAssignments',
          role: 'MENUSTATION'
        }]
      }, {
        title: 'Promotion Management',
        menuItems: [{
          name: 'Manage Promotions',
          route: emberURL + 'promotions',
          icon: 'icon-manage-promotion',
          className: 'dashboard-managePromotions',
          role: 'PROMOTION'
        }, {
          name: 'Create Promotion',
          route: '/#/promotions/create',
          icon: 'icon-create-promotion',
          className: 'dashboard-createPromotion',
          role: 'PROMOTION'
        }, {
          name: 'Promotion Category',
          route: emberURL + 'promotion-categories',
          icon: 'icon-manage-promotion-category',
          className: 'dashboard-managePromotionCategory',
          role: 'PROMOTIONCATEGORY'
        }, {
          name: 'Promotion Catalog',
          route: emberURL + 'promotion-catalogs',
          icon: 'icon-create-catalog',
          className: 'dashboard-createCatalog',
          role: 'PROMOTIONCATALOG'
        }]
      }, {
        title: 'Discount Management',
        menuItems: [{
          name: 'Manage Discounts',
          route: '/#/discount-list',
          icon: 'icon-manage-discount',
          className: 'dashboard-manageDiscount',
          role: 'DISCOUNT'
        }, {
          name: 'Create Discount',
          route: emberURL + 'discounts/create',
          icon: 'icon-create-discount',
          className: 'dashboard-createDiscount',
          role: 'DISCOUNT'
        }]
      }, {
        title: 'Employee Messages',
        menuItems: [{
          name: 'Manage Messages',
          route: emberURL + 'employee-messages',
          icon: 'icon-employee-messages',
          className: 'dashboard-manageEmployeeMessages',
          role: 'EMPLOYEEMESSAGE'
        }]
      }, {
        title: 'Receipt Rule',
        menuItems: [{
          name: 'Manage Rules',
          route: emberURL + 'receipt-rules',
          icon: 'icon-manage-receipt-rules',
          className: 'dashboard-manageReceiptRules',
          role: 'RECEIPTRULE'
        }, {
          name: 'Create Rules',
          route: emberURL + 'receipt-rules/create',
          icon: 'icon-create-receipt-rules',
          className: 'dashboard-createReceiptRule',
          role: 'RECEIPTRULE'
        }]
      }, {
        title: 'Transaction Retrieval',
        menuItems: [{
          name: 'Manage Transactions',
          route: emberURL + 'transactions',
          icon: 'icon-manage-transactions',
          className: 'dashboard-manageTransactions',
          role: 'TRANSACTION'
        }]
      }, {
        title: 'Cash Management',
        menuItems: [{
          name: 'Daily Exchange Rate',
          route: '/#/exchange-rates',
          icon: 'icon-manage-transactions',
          className: 'dashboard-manageDailyExchangeRates',
          role: 'EXCHANGERATE'
        }, {
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
        }, {
          name: 'Retail Company Exchange Rate',
          route: '/#/company-exchange-rate-edit',
          icon: 'icon-manage-transactions',
          className: 'dashboard-companyExchangeRateEdit',
          role: 'EXCHANGERATE'
        }]
      }, {
        title: 'Post Trip Data',
        menuItems: [{
          name: 'Manage Post Trip Data',
          route: '/#/post-trip-data-list',
          icon: 'icon-manage-menu',
          className: 'dashboard-postTripDataList',
          role: 'POSTTRIP'
        }, {
          name: 'Create Post Trip Data',
          route: '/#/post-trip-data/create',
          icon: 'icon-create-menu',
          className: 'dashboard-postTripData',
          role: 'POSTTRIP'
        }]
      }, {
        title: 'Employee Commission',
        menuItems: [{
          name: 'Employee Commission',
          route: '/#/employee-commission-list',
          icon: 'icon-manage-schedule',
          className: 'dashboard-employeeCommission',
          role: 'EMLOYEECOMMISSION'
        },{
          name: 'Commission Data Table',
          route: '/#/commission-data-table',
          icon: 'icon-manage-schedule',
          className: 'dashboard-CommissionDataTable',
          role: 'EMLOYEECOMMISSION'
        }]
      }, {
        title: 'Reason',
        menuItems: [{
          name: 'Global Reason',
          route: '/#/global-reason-code',
          icon: 'icon-manage-schedule',
          className: 'dashboard-globalReasonCode',
          role: 'REASONGLOBAL'
        }, {
          name: 'Company Reason',
          route: '/#/company-reason-code',
          icon: 'icon-manage-schedule',
          className: 'dashboard-companyReasonCode',
          role: 'REASONCOMPANY'
        }]
      }, {
        title: 'Station Operations',
        menuItems: [{
          name: 'Store Dispatch',
          route: '/#/store-instance-create/dispatch',
          icon: 'icon-manage-schedule',
          className: 'dashboard-storeDispatch',
          role: 'STOREDISPATCH'
        }, {
          name: 'Store Instance Dashboard',
          route: '/#/store-instance-dashboard',
          icon: 'icon-manage-schedule',
          className: 'dashboard-storeInstanceDashboard',
          role: 'STOREINSTANCEDASHBOARD'
        }]
      }, {
        title: 'Stock Manager',
        menuItems: [{
          name: 'Stock Dashboard',
          route: '/#/stock-dashboard',
          icon: 'icon-manage-schedule',
          className: 'dashboard-stockDashboard',
          role: 'STOCKITEM'
        }, {
          name: 'Stock Take Report',
          route: '/#/stock-take-report',
          icon: 'icon-manage-schedule',
          className: 'dashboard-stockTakeReport',
          role: 'STOCKDASHBOARD'
        }, {
          name: 'Manage Goods Received',
          route: '/#/manage-goods-receican you ved',
          icon: 'icon-manage-schedule',
          className: 'dashboard-manageGoodsReceived',
          role: 'RECEIVE'
        }, {
          name: 'Create Delivery Note',
          route: '/#/lmp-delivery-note/create',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-deliveryNote',
          role: 'DELIVERYNOTES'
        }]
      }, {
        title: 'Manage Store Number',
        menuItems: [{
          name: 'Store Number Create',
          route: '/#/store-number',
          icon: 'icon-create-company',
          className: 'dashboard-storeNumberCreate',
          role: 'STORENUMBER'
        }]
      }];
      lodash.forEach(retailMenu, function(item) {
        item.roles = lodash.map(item.menuItems, function(menuItem) { return menuItem.role; });
      });
     }
     return retailMenu;
    };

  });
