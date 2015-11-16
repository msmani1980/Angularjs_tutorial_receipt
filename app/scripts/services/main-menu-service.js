'use strict';

/**
 * @ngdoc service
 * @name ts5App.mainMenuService
 * @description
 * # mainMenuService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('mainMenuService', function () {
    var emberURL = '/ember/#/';

    var retailMenu = null;
    this.getMenu = function () {
      if (retailMenu === null) {
       retailMenu = [{
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
      }, {
        'title': 'Company Management',
        'menuItems': [{
          name: 'Manage Companies',
          route: '/#/company-list',
          icon: 'icon-manage-company',
          className: 'dashboard-manageCompanies',
          package: 'COMPANY',
          role: 'ORGANIZATION'
        }, {
          name: 'Create Company',
          route: emberURL + 'companies/create',
          icon: 'icon-create-company',
          className: 'dashboard-createCompany',
          package: 'COMPANY',
          role: 'ORGANIZATION',
          permissions: [{
            apiName: '/api/companies',
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Schedule Management',
        menuItems: [{
          name: 'Manage Schedules',
          route: emberURL + 'schedules',
          icon: 'icon-manage-schedule',
          className: 'dashboard-manageSchedules',
          package: 'SCHEDULE',
          role: 'SCHEDULE'
        }]
      }, {
        title: 'Tax Management',
        menuItems: [{
          name: 'Manage Taxes',
          route: emberURL + 'tax-rates',
          icon: 'icon-manage-taxes',
          className: 'dashboard-manageTaxes',
          package: 'TAX',
          role: 'TAX'
        }]
      }, {
        title: 'Menu Management',
        menuItems: [{
          name: 'Manage Menus',
          route: '/#/menu-list',
          icon: 'icon-manage-menu',
          className: 'dashboard-manageMenus',
          package: 'MENU',
          role: 'MENU'
        }, {
          name: 'Create Menu',
          route: '/#/menu/create',
          icon: 'icon-create-menu',
          className: 'dashboard-createMenu',
          package: 'MENU',
          role: 'MENU',
          permissions: [{
            apiName: '/api/menus',
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Menu Assignment',
        menuItems: [{
          name: 'Menu Assignments',
          route: emberURL + 'menu-assignments',
          icon: 'icon-menu-assignment',
          className: 'dashboard-menuAssignments',
          package: 'MENUASSG',
          role: 'MENUASSIGNMENT'
        }, {
          name: 'Manage Rules',
          route: emberURL + 'menu-rules',
          icon: 'icon-manage-rules',
          className: 'dashboard-manageRules',
          package: 'MENU',
          role: 'RULE'
        }, {
          name: 'Create Rule',
          route: emberURL + 'menu-rules/create',
          icon: 'icon-create-rules',
          className: 'dashboard-createRules',
          package: 'MENU',
          role: 'RULE',
          permissions: [{
            apiName: '/api/menu-rules',
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Menu-Catering Station Relationship',
        menuItems: [{
          name: 'Manage Relationships',
          route: '/#/menu-relationship-list',
          icon: 'icon-menu-assignment',
          className: 'dashboard-menuAssignments',
          package: 'MENUCAT',
          role: 'MENUSTATION'
        }, {
          name: 'Create Relationship',
          route: '/#/menu-relationship-create',
          icon: 'icon-create-menu',
          className: 'dashboard-menuAssignments',
          package: 'MENUCAT',
          role: 'MENUSTATION',
          permissions: [{
            apiName: '/api/menus',
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Promotion Management',
        menuItems: [{
          name: 'Manage Promotions',
          route: emberURL + 'promotions',
          icon: 'icon-manage-promotion',
          className: 'dashboard-managePromotions',
          package: 'PROMOTION',
          role: 'PROMOTION'
        }, {
          name: 'Create Promotion',
          route: '/#/promotions/create',
          icon: 'icon-create-promotion',
          className: 'dashboard-createPromotion',
          package: 'PROMOTION',
          role: 'PROMOTION',
          permissions: [{
            apiName: '/api/promotions',
            permissionCodes: ['C']
          }]

        }, {
          name: 'Promotion Category',
          route: emberURL + 'promotion-categories',
          icon: 'icon-manage-promotion-category',
          className: 'dashboard-managePromotionCategory',
          package: 'PROMOTION',
          role: 'PROMOTIONCATEGORY'
        }, {
          name: 'Promotion Catalog',
          route: emberURL + 'promotion-catalogs',
          icon: 'icon-create-catalog',
          className: 'dashboard-createCatalog',
          package: 'PROMOTION',
          role: 'PROMOTIONCATALOG',
          permissions: [{
            apiName: '/api/promotions',
            permissionCodes: ['C']
          }]

        }]
      }, {
        title: 'Discount Management',
        menuItems: [{
          name: 'Manage Discounts',
          route: '/#/discount-list',
          icon: 'icon-manage-discount',
          className: 'dashboard-manageDiscount',
          package: 'DISCOUNT',
          role: 'DISCOUNT'
        }, {
          name: 'Create Discount',
          route: emberURL + 'discounts/create',
          icon: 'icon-create-discount',
          className: 'dashboard-createDiscount',
          package: 'DISCOUNT',
          role: 'DISCOUNT',
          permissions: [{
            apiName: '/api/company-discounts',
            permissionCodes: ['C']
          }]

        }]
      }, {
        title: 'Employee Messages',
        menuItems: [{
          name: 'Manage Messages',
          route: emberURL + 'employee-messages',
          icon: 'icon-employee-messages',
          className: 'dashboard-manageEmployeeMessages',
          package: 'EMPLOYEEMSG',
          role: 'EMPLOYEEMESSAGE'
        }]
      }, {
        title: 'Receipt Rule',
        menuItems: [{
          name: 'Manage Rules',
          route: emberURL + 'receipt-rules',
          icon: 'icon-manage-receipt-rules',
          className: 'dashboard-manageReceiptRules',
          package: 'RECEIPT',
          role: 'RECEIPTRULE'
        }, {
          name: 'Create Rules',
          route: emberURL + 'receipt-rules/create',
          icon: 'icon-create-receipt-rules',
          className: 'dashboard-createReceiptRule',
          package: 'RECEIPT',
          role: 'RECEIPTRULE',
          permissions: [{
            apiName: '/api/',
            permissionCodes: ['C']
          }]

        }]
      }, {
        title: 'Transaction Retrieval',
        menuItems: [{
          name: 'Manage Transactions',
          route: emberURL + 'transactions',
          icon: 'icon-manage-transactions',
          className: 'dashboard-manageTransactions',
          package: 'TRANSACTION',
          role: 'TRANSACTION'
        }]
      }, {
        title: 'Cash Management',
        menuItems: [{
          name: 'Daily Exchange Rate',
          route: '/#/exchange-rates',
          icon: 'icon-manage-transactions',
          className: 'dashboard-manageDailyExchangeRates',
          package: 'CASH',
          role: 'EXCHANGERATE'
        }, {
          name: 'Manage Cash Bag',
          route: '/#/cash-bag-list',
          icon: 'icon-create-receipt-rules',
          className: 'dashboard-manageCashBag',
          package: 'CASH',
          role: 'CASHBAG'
        }, {
          name: 'Cash Bag Submission',
          route: emberURL + 'cash-bag-submission',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-cashBagSubmission',
          package: 'CASH',
          role: 'CASHBAGSUBMIT'
        }, {
          name: 'Currency Setup',
          route: '/#/currency-edit',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-currencySetup',
          package: 'CASH',
          role: 'CASHBAGSUBMIT'
        }, {
          name: 'Retail Company Exchange Rate',
          route: '/#/company-exchange-rate-edit',
          icon: 'icon-manage-transactions',
          className: 'dashboard-companyExchangeRateEdit',
          package: 'CASH',
          role: 'EXCHANGERATE'
        }]
      }, {
        title: 'Post Trip Data',
        menuItems: [{
          name: 'Manage Post Trip Data',
          route: '/#/post-trip-data-list',
          icon: 'icon-manage-menu',
          className: 'dashboard-postTripDataList',
          package: 'POSTTRIP',
          role: 'POSTTRIP'
        }, {
          name: 'Create Post Trip Data',
          route: '/#/post-trip-data/create',
          icon: 'icon-create-menu',
          className: 'dashboard-postTripData',
          package: 'POSTTRIP',
          role: 'POSTTRIP',
          permissions: [{
            apiName: '/api/posttrips',
            permissionCodes: ['C']
          }]

        }]
      }, {
        title: 'Employee Commission',
        menuItems: [{
          name: 'Employee Commission',
          route: '/#/employee-commission-list',
          icon: 'icon-manage-schedule',
          className: 'dashboard-employeeCommission',
          package: 'EMLOYEECOMMISSION',
          role: 'EMLOYEECOMMISSION'
        },{
          name: 'Commission Data Table',
          route: '/#/commission-data-table',
          icon: 'icon-manage-schedule',
          className: 'dashboard-CommissionDataTable',
          package: 'EMLOYEECOMMISSION',
          role: 'EMLOYEECOMMISSION'
        }]
      }, {
        title: 'Reason',
        menuItems: [{
          name: 'Global Reason',
          route: '/#/global-reason-code',
          icon: 'icon-manage-schedule',
          className: 'dashboard-globalReasonCode',
          package: 'REASONGLOBAL',
          role: 'REASONGLOBAL'
        }, {
          name: 'Company Reason',
          route: '/#/company-reason-code',
          icon: 'icon-manage-schedule',
          className: 'dashboard-companyReasonCode',
          package: 'REASONCOMPANY',
          role: 'REASONCOMPANY'
        }]
      }, {
        title: 'Station Operations',
        menuItems: [{
          name: 'Store Dispatch',
          route: '/#/store-instance-create/dispatch',
          icon: 'icon-manage-schedule',
          className: 'dashboard-storeDispatch',
          package: 'STATIONOPERATIONS',
          role: 'STOREDISPATCH'
        }, {
          name: 'Store Instance Dashboard',
          route: '/#/store-instance-dashboard',
          icon: 'icon-manage-schedule',
          className: 'dashboard-storeInstanceDashboard',
          package: 'STATIONOPERATIONS',
          role: 'STOREINSTANCEDASHBOARD'
        }]
      }, {
        title: 'Stock Manager',
        menuItems: [{
          name: 'Stock Dashboard',
          route: '/#/stock-dashboard',
          icon: 'icon-manage-schedule',
          className: 'dashboard-stockDashboard',
          package: 'STOCKMANAGER',
          role: 'STOCKITEM'
        }, {
          name: 'Stock Take Report',
          route: '/#/stock-take-report',
          icon: 'icon-manage-schedule',
          className: 'dashboard-stockTakeReport',
          package: 'STOCKMANAGER',
          role: 'STOCKDASHBOARD'
        }, {
          name: 'Manage Goods Received',
          route: '/#/manage-goods-receican you ved',
          icon: 'icon-manage-schedule',
          className: 'dashboard-manageGoodsReceived',
          package: 'STOCKMANAGER',
          role: 'RECEIVE'
        }, {
          name: 'Create Delivery Note',
          route: '/#/lmp-delivery-note/create',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-deliveryNote',
          package: 'STOCKMANAGER',
          role: 'DELIVERYNOTES',
          permissions: [{
            apiName: '/api/stock-management',
            permissionCodes: ['C']
          }]

        }]
      }, {
        title: 'Manage Store Number',
        menuItems: [{
          name: 'Store Number Create',
          route: '/#/store-number',
          icon: 'icon-create-company',
          className: 'dashboard-storeNumberCreate',
          package: 'STORENUMBER',
          role: 'STORENUMBER',
          permissions: [{
            apiName: '/api/companies',
            permissionCodes: ['C']
          }]

        }]
      }];
     }
     return retailMenu;
    };

  });
