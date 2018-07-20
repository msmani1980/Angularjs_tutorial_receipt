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

    this.getMenu = function () {
      return [{
        title: 'Company Management',
        menuItems: [{
          name: 'Manage Companies',
          route: '/#/company-list',
          icon: 'icon-manage-company',
          className: 'dashboard-manageCompanies',
          package: 'COMPANY',
          role: 'COMPANY',
          permissions: [{
            apiName: '/api/companies',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Create Company',
          route: '/#/company-create',
          icon: 'icon-create-company',
          className: 'dashboard-createCompany',
          package: 'COMPANY',
          role: 'COMPANY',
          permissions: [{
            apiName: '/api/companies',
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Currency & Exchange Rate Management',
        menuItems: [{
          name: 'Currency Setup',
          route: '/#/currency-edit',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-currencySetup',
          package: 'CURRENCYEXCHNG',
          role: 'COMPANYCURRENCY',
          permissions: [{
            permissionCodes: ['R']
          }]
        }, {
          name: 'ePOS Exchange Rate',
          route: '/#/company-exchange-rate-edit',
          icon: 'icon-manage-transactions',
          className: 'dashboard-companyExchangeRateEdit',
          package: 'CURRENCYEXCHNG',
          role: 'EPOSEXCHNG',
          permissions: [{
            apiName: '/api/currencies',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Report Exchange Rate',
          route: '/#/report-exchange-rate',
          icon: 'icon-manage-transactions',
          className: 'dashboard-companyExchangeRateEdit',
          package: 'CURRENCYEXCHNG',
          role: 'REPORTEXCHANGE',
          permissions: [{
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Retail Item Management',
        menuItems: [{
          name: 'Manage Items',
          route: '/#/item-list',
          icon: 'icon-manage-retail-item',
          className: 'dashboard-managemenuItems',
          package: 'RETAIL',
          role: 'RETAILITEM',
          permissions: [{
            permissionCodes: ['R']
          }]
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
          route: '/#/category-list',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-manageItemCategories',
          package: 'RETAIL',
          role: 'RETAILITEMCATEGORY',
          permissions: [{
            permissionCodes: ['R']
          }]
        }, {
          name: 'Dynamic Price Update',
          route: '/#/priceupdater-list',
          icon: 'icon-manage-receipt-rules',
          className: 'dashboard-managePriceUpdater',
          package: 'RETAIL',
          role: 'D_PRICE_UPDATE',
          permissions: [{
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Discount Management',
        menuItems: [{
          name: 'Manage Discounts',
          route: '/#/discounts',
          icon: 'icon-manage-discount',
          className: 'dashboard-manageDiscount',
          package: 'DISCOUNT',
          role: 'DISCOUNT',
          permissions: [{
            apiName: '/api/company-discounts',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Create Discount',
          route: '/#/discounts/create',
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
        title: 'Schedule Management',
        menuItems: [{
          name: 'Manage Schedules',
          route: '/#/schedules',
          icon: 'icon-manage-schedule',
          className: 'dashboard-manageSchedules',
          package: 'SCHEDULE',
          role: 'SCHEDULE',
          permissions: [{
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Manage Reason Code',
        menuItems: [{
          name: 'Manage Reason Code',
          route: '/#/company-reasoncodes-list',
          icon: 'icon-manage-menu',
          className: 'dashboard-companyReasonCode',
          package: 'COMPANYREASON',
          role: 'COMPANYREASON',
          permissions: [{
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Employee Management',
        menuItems: [{
          name: 'Manage Employees',
          route: '/#/employees',
          icon: 'icon-manage-menu',
          className: 'dashboard-manageEmployees',
          package: 'EMPLOYEE',
          role: 'EMPLOYEE',
          permissions: [{
            permissionCodes: ['R']
          }]
        }, {
          name: 'Create Employee',
          route: '/#/employee/create',
          icon: 'icon-create-menu',
          className: 'dashboard-createEmployee',
          package: 'EMPLOYEE',
          role: 'EMPLOYEE',
          permissions: [{
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Employee Messages',
        menuItems: [{
          name: 'Manage Messages',
          route: '/#/employee-messages',
          icon: 'icon-employee-messages',
          className: 'dashboard-manageEmployeeMessages',
          package: 'EMPLOYEEMSG',
          role: 'EMPLOYEEMESSAGE',
          permissions: [{
            apiName: '/api/employee-messages',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Create Message',
          route: '/#/employee-message/create',
          icon: 'icon-employee-messages',
          className: 'dashboard-manageEmployeeMessages',
          package: 'EMPLOYEEMSG',
          role: 'EMPLOYEEMESSAGE',
          permissions: [{
            apiName: '/api/employee-messages',
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Promotion Management',
        menuItems: [{
          name: 'Manage Promotions',
          route: '/#/promotions',
          icon: 'icon-manage-promotion',
          className: 'dashboard-managePromotions',
          package: 'PROMOTION',
          role: 'PROMOTION',
          permissions: [{
            apiName: '/api/promotions',
            permissionCodes: ['R']
          }]
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
          route: '/#/promotion-category-list',
          icon: 'icon-manage-promotion-category',
          className: 'dashboard-managePromotionCategory',
          package: 'PROMOTION',
          role: 'PROMOTIONCATEGORY',
          permissions: [{
            apiName: '/api/promotion-categories',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Promotion Catalog',
          route: '/#/promotion-catalog-list',
          icon: 'icon-create-catalog',
          className: 'dashboard-createCatalog',
          package: 'PROMOTION',
          role: 'PROMOTIONCATALOG',
          permissions: [{
            apiName: '/api/company-promotion-catalogs',
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Tax Management',
        menuItems: [{
          name: 'Manage Taxes',
          route: '/#/tax-rates',
          icon: 'icon-manage-taxes',
          className: 'dashboard-manageTaxes',
          package: 'TAX',
          role: 'TAX',
          permissions: [{
            permissionCodes: ['R']
          }]
        }, {
          name: 'Route Tax Management',
          route: '/#/route-tax-rates',
          icon: 'icon-manage-taxes',
          className: 'dashboard-manageTaxes',
          package: 'TAX',
          role: 'ROUTETAX',
          permissions: [{
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Menu Management',
        menuItems: [{
          name: 'Manage Menus',
          route: '/#/menu-list',
          icon: 'icon-manage-menu',
          className: 'dashboard-manageMenus',
          package: 'MENU',
          role: 'MENU',
          permissions: [{
            apiName: '/api/menus',
            permissionCodes: ['R']
          }]
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
          route: '/#/menu-assignment-list',
          icon: 'icon-menu-assignment',
          className: 'dashboard-menuAssignments',
          package: 'MENUASSG',
          role: 'MENUASSIGNMENT',
          permissions: [{
            apiName: '/api/menu-assignments',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Manage Rules',
          route: '/#/menu-rules',
          icon: 'icon-manage-rules',
          className: 'dashboard-manageRules',
          package: 'MENUASSG',
          role: 'MENURULE',
          permissions: [{
            apiName: '/api/menu-rules',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Create Rule',
          route: '/#/menu-rules/create',
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
          role: 'MENUSTATION',
          permissions: [{
            apiName: '/api/menus',
            permissionCodes: ['R']
          }]
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
        title: 'Company Stations',
        menuItems: [{
          name: 'Manage Company Stations',
          route: '/#/station-list',
          icon: 'icon-menu-assignment',
          className: 'dashboard-stations',
          package: 'COMPANY',
          role: 'COMPANYSTATION',
          permissions: [{
            apiName: '/api/station-list',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Create Company Stations',
          route: '/#/station-create',
          icon: 'icon-menu-assignment',
          className: 'dashboard-stations',
          package: 'COMPANY',
          role: 'COMPANYSTATION',
          permissions: [{
            apiName: '/api/station-create',
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Receipt Rule',
        menuItems: [{
          name: 'Manage Rules',
          route: '/#/receipt-rules',
          icon: 'icon-manage-receipt-rules',
          className: 'dashboard-manageReceiptRules',
          package: 'RECEIPT',
          role: 'RECEIPTRULE',
          permissions: [{
            apiName: '/api/receipt-rules',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Create Rules',
          route:'/#/receipt-rules/create',
          icon: 'icon-create-receipt-rules',
          className: 'dashboard-createReceiptRule',
          package: 'RECEIPT',
          role: 'RECEIPTRULE',
          permissions: [{
            apiName: '/api/receipt-rules',
            permissionCodes: ['C']
          }]
        }]
      }, {
        title: 'Manage Reasons',
        menuItems: [{
          name: 'Reason Codes',
          route: '/#/company-reason-code',
          icon: 'icon-manage-schedule',
          className: 'dashboard-globalReasonCode',
          package: 'REASONGLOBAL',
          role: 'REASONGLOBAL'
        }, {
          name: 'Reason Types',
          route: '/#/company-reason-type-subscribe',
          icon: 'icon-manage-schedule',
          className: 'dashboard-companyReasonCode',
          package: 'REASONCOMPANY',
          role: 'REASONCOMPANY'
        }]
      }, {
        title: 'Excise Duty',
        menuItems: [{
          name: 'Manage Excise Duty',
          route: '/#/excise-duty-list',
          icon: 'icon-manage-schedule',
          className: 'dashboard-exciseDuty',
          package: 'EXCISEDUTY',
          role: 'EXCISEDUTY',
          permissions: [{
            apiName: '/api/excise-duty',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Retail Item Excise Duty Relationships',
          route: '/#/excise-duty-relationship-list',
          icon: 'icon-manage-schedule',
          className: 'dashboard-exciseDuty',
          package: 'EXCISEDUTY',
          role: 'EXCISEDUTY',
          permissions: [{
            apiName: '/api/item-excise-duty',
            permissionCodes: ['R']
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
          role: 'EMLOYEECOMMISSION',
          permissions: [{
            apiName: '/api/employee-commissions',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Commission Data Table',
          route: '/#/commission-data-table',
          icon: 'icon-manage-schedule',
          className: 'dashboard-CommissionDataTable',
          package: 'EMLOYEECOMMISSION',
          role: 'EMLOYEECOMMISSION',
          permissions: [{
            apiName: '/api/employee-commissions',
            permissionCodes: ['R']
          }]
        }]
      }, {
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
          package: 'STOCKMANAGER',
          role: 'GOODSRECEIVEDDASHBOARD'
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
      }, {
        title: 'Station Operations',
        menuItems: [{
          name: 'Store Dispatch',
          route: '/#/store-instance-create/dispatch',
          icon: 'icon-manage-schedule',
          className: 'dashboard-storeDispatch',
          package: 'STATIONOPERATIONS',
          role: 'STOREDISPATCH',
          permissions: [{
            apiName: '/api/dispatch',
            permissionCodes: ['C']
          }]
        }, {
          name: 'Store Instance Dashboard',
          route: '/#/store-instance-dashboard',
          icon: 'icon-manage-schedule',
          className: 'dashboard-storeInstanceDashboard',
          package: 'STATIONOPERATIONS',
          role: 'STOREINSTANCEDASHBOARD',
          permissions: [{
            apiName: '/api/dispatch',
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Transaction Retrieval',
        menuItems: [{
          name: 'Manage Transactions',
          route: '/#/transactions',
          icon: 'icon-manage-transactions',
          className: 'dashboard-manageTransactions',
          package: 'TRANSACTION',
          role: 'TRANSACTION'
        }]
      }, {
        title: 'Post Trip Data',
        menuItems: [{
          name: 'Manage Post Trip Data',
          route: '/#/post-trip-data-list',
          icon: 'icon-manage-menu',
          className: 'dashboard-postTripDataList',
          package: 'POSTTRIP',
          role: 'POSTTRIP',
          permissions: [{
            apiName: '/api/posttrips',
            permissionCodes: ['R']
          }]
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
        title: 'Reconciliation',
        menuItems: [{
          name: 'Reconciliation Dashboard',
          route: '/#/reconciliation-dashboard',
          icon: 'icon-manage-schedule',
          className: 'dashboard-reconciliationDashboard',
          package: 'RECONCILIATION',
          role: 'RECONCILIATION'
        }, {
          name: 'Relate ePOS Created Store',
          route: '/#/manual-ecs',
          icon: 'icon-manage-schedule',
          className: 'dashboard-manualECS',
          package: 'RECONCILIATION',
          role: 'RELATEESC'
        }, {
          name: 'Manage Cash Bag',
          route: '/#/reconciliation-cash-bag-list',
          icon: 'icon-create-receipt-rules',
          className: 'dashboard-manageCashBag',
          package: 'RECONCILIATION',
          role: 'RECONCILIATION'
        }]
      }, {
        title: 'Survey Management',
        menuItems: [{
          name: 'Survey Questions',
          route: '/#/survey-questions',
          icon: 'icon-manage-menu',
          className: 'dashboard-manageSurveyQuestions',
          package: 'SURVEY',
          role: 'SURVEY',
          permissions: [{
            apiName: '/api/survey',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Survey',
          route: '/#/survey',
          icon: 'icon-manage-menu',
          className: 'dashboard-manageSurvey',
          package: 'SURVEY',
          role: 'SURVEY',
          permissions: [{
            apiName: '/api/survey',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Survey Catalog',
          route: '/#/survey-catalog',
          icon: 'icon-manage-menu',
          className: 'dashboard-manageSurveyCatalog',
          package: 'SURVEY',
          role: 'SURVEY',
          permissions: [{
            apiName: '/api/survey',
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Cash Management',
        menuItems: [{
          name: 'Daily Exchange Rate',
          route: '/#/exchange-rates',
          icon: 'icon-manage-transactions',
          className: 'dashboard-manageDailyExchangeRates',
          package: 'CASH',
          role: 'DAILYEXCHANGERATE'
        }, {
          name: 'Manage Cash Bag',
          route: '/#/cash-bag-list',
          icon: 'icon-create-receipt-rules',
          className: 'dashboard-manageCashBag',
          package: 'CASH',
          role: 'CASHBAG'
        }, {
          name: 'Cash Bag Submission',
          route: '/#/cash-bag-submission',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-cashBagSubmission',
          package: 'CASH',
          role: 'CASHBAGSUBMIT'
        }]
      }, {
        title: 'StockOwner Item Management',
        menuItems: [{
          name: 'Manage Items',
          route: '/#/stock-owner-item-list',
          icon: 'icon-manage-retail-item',
          className: 'dashboard-managemenuItems',
          package: 'STOCKOWNER',
          role: 'STOCKOWNER',
          permissions: [{
            apiName: '/api/retail-items',
            permissionCodes: ['R']
          }]
        }, {
          name: 'Create Item',
          route: '/#/stock-owner-item-create',
          icon: 'icon-create-retail-item',
          className: 'dashboard-createItem',
          package: 'STOCKOWNER',
          role: 'STOCKOWNER',
          permissions: [{
            apiName: '/api/retail-items',
            permissionCodes: ['C']
          }]
        }, {
          name: 'Manage Categories',
          route: '/#/category-list',
          icon: 'icon-manage-retail-category',
          className: 'dashboard-manageItemCategories',
          package: 'STOCKOWNER',
          role: 'STOCKOWNERCATEGORY',
          permissions: [{
            apiName: '/api/retail-items',
            permissionCodes: ['R']
          }]
        }]
      }, {
        title: 'Reports',
        menuItems: [{
          name: 'Reports',
          route: '/#/reports',
          icon: 'icon-manage-schedule',
          className: 'dashboard-reports',
          package: 'REPORT',
          role: 'REPORT'
        }, {
          name: 'Queue',
          route: '/#/reports/queue',
          icon: 'icon-create-menu',
          className: 'dashboard-reports',
          package: 'REPORT',
          role: 'REPORT'
        }, {
          name: 'Scheduled Reports',
          route: '/#/reports/scheduled-reports',
          icon: 'icon-create-menu',
          className: 'dashboard-reports',
          package: 'REPORT',
          role: 'REPORT'
        }]
      }, {
        title: 'Configuration Settings',
        menuItems: [{
            name: 'ePOS Configuration Settings',
            route: '/#/epos-config',
            icon: 'icon-manage-discount',
            className: 'dashboard-epos-config',
            package: 'EPOSCONFIG',
            role: 'EPOSCONFIG'
          }, {
          name: 'Back Office Configuration Settings',
          route: '/#/back-office-config',
          icon: 'icon-manage-discount',
          className: 'dashboard-back-office-config',
          package: 'BACKOFFICECONFIG',
          role: 'BACKOFFICECONFIG'
        }]
      }, {
        title: 'Retail Company Receipts',
        menuItems: [{
            name: 'Company Receipts',
            route: '/#/company-receipts',
            icon: 'icon-manage-discount',
            className: 'dashboard-company-receipts-config',
            package: 'COMPANYRECEIPTS',
            role: 'COMPANYRECEIPTS',
            permissions: [{
              apiName: '/api/company-receipts',
              permissionCodes: ['R']
            }]
          }, {
            name: 'Company E-mail Receipts',
            route: '/#/company-email-receipts',
            icon: 'icon-manage-discount',
            className: 'dashboard-company-email-receipts-config',
            package: 'COMPANYRECEIPTS',
            role: 'COMPANYEMAILRECEIPTS',
            permissions: [{
              apiName: '/api/company-email-receipts',
              permissionCodes: ['R']
            }]
          }]
      }];
    };

  });
