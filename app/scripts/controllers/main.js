'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MainCtrl', function ($scope) {
    $scope.breadcrumb = 'TS5 Dashboard';

    $scope.dashboardMenu = [
      {
        'title': 'Retail Item Management',
        menuItems: [
          {
            name: 'Manage Items',
            route: 'item-list',
            icon: 'icon-manage-retail-item',
            className: 'dashboard-managemenuItems'
          },
          {
            name: 'Create Item',
            route: 'item-create',
            icon: 'icon-create-retail-item',
            className: 'dashboard-createItem'
          },
          {
            name: 'Manage Categories',
            route: 'sales-categories',
            icon: 'icon-manage-retail-category',
            className: 'dashboard-manageItemCategories'
          }
        ]
      },
      {
        'title': 'Company Management',
        'menuItems': [
          {
            name: 'Manage Companies',
            route: 'companies',
            icon: 'icon-manage-company',
            className: 'dashboard-manageCompanies'
          },
          {
            name: 'Create Company',
            route: 'companies.create',
            icon: 'icon-create-company',
            className: 'dashboard-createCompany'
          }
        ]
      },
      {
        title: 'Schedule Management',
        menuItems: [
          {
            name: 'Manage Schedules',
            route: 'schedules',
            icon: 'icon-manage-schedule',
            className: 'dashboard-manageSchedules'
          }]
      },
      {
        title: 'Tax Management',
        menuItems: [
          {
            name: 'Manage Taxes',
            route: 'tax-rates',
            icon: 'icon-manage-taxes',
            className: 'dashboard-manageTaxes'
          }]
      },
      {
        title: 'Menu Management',
        menuItems: [
          {
            name: 'Manage Menus',
            route: 'menus',
            icon: 'icon-manage-menu',
            className: 'dashboard-manageMenus'
          },
          {
            name: 'Create Menu',
            route: 'menus.create',
            icon: 'icon-create-menu',
            className: 'dashboard-createMenu'
          }]
      },
      {
        title: 'Menu Assignment',
        menuItems: [
          {
            name: 'Menu Assignments',
            route: 'menu-assignments',
            icon: 'icon-menu-assignment',
            className: 'dashboard-menuAssignments'
          },
          {
            name: 'Manage Rules',
            route: 'menu-rules',
            icon: 'icon-manage-rules',
            className: 'dashboard-manageRules'
          },
          {
            name: 'Create Rule',
            route: 'menu-rules.create',
            icon: 'icon-create-rules',
            className: 'dashboard-createRules'
          }]
      },
      {
        title: 'Promotion Management',
        menuItems: [
          {
            name: 'Manage Promotions',
            route: 'promotions',
            icon: 'icon-manage-promotion',
            className: 'dashboard-managePromotions'
          },
          {
            name: 'Create Promotion',
            route: 'promotions.create',
            icon: 'icon-create-promotion',
            className: 'dashboard-createPromotion'
          },
          {
            name: 'Manage Promotion Category',
            route: 'promotion-category',
            icon: 'icon-manage-promotion-category',
            className: 'dashboard-managePromotionCategory'
          },
          {
            name: 'Manage Promotion Catalog',
            route: 'promotion-catalogs',
            icon: 'icon-create-catalog',
            className: 'dashboard-createCatalog'
          }]
      },
      {
        title: 'Discount Management',
        menuItems: [
          {
            name: 'Manage Discounts',
            route: 'discounts',
            icon: 'icon-manage-discount',
            className: 'dashboard-manageDiscount'
          },
          {
            name: 'Create Discount',
            route: 'discounts.create',
            icon: 'icon-create-discount',
            className: 'dashboard-createDiscount'
          }]
      },
      {
        title: 'Employee Messages',
        menuItems: [
          {
            name: 'Manage Messages',
            route: 'employee-messages',
            icon: 'icon-employee-messages',
            className: 'dashboard-manageEmployeeMessages'
          }]
      },
      {
        title: 'Receipt Rule',
        menuItems: [
          {
            name: 'Manage Rules',
            route: 'receipt-rules',
            icon: 'icon-manage-receipt-rules',
            className: 'dashboard-manageReceiptRules'
          },
          {
            name: 'Create Rules',
            route: 'receipt-rules.create',
            icon: 'icon-create-receipt-rules',
            className: 'dashboard-createReceiptRule'
          }]
      },
      {
        title: 'Transaction Retrieval',
        menuItems: [
          {
            name: 'Manage Transactions',
            route: 'transactions',
            icon: 'icon-manage-transactions',
            className: 'dashboard-manageTransactions'
          }]
      },
      {
        title: 'Cash Management',
        menuItems: [
          {
            name: 'Daily Exchange Rate',
            route: 'exchange-rates',
            icon: 'icon-manage-transactions',
            className: 'dashboard-manageDailyExchangeRates'
          },
          {
            name: 'Manage Cash Bag',
            route: 'cash-bag',
            icon: 'icon-create-receipt-rules',
            className: 'dashboard-manageCashBag'
          },
          {
            name: 'Cash Bag Submission',
            route: 'cash-bag-submit',
            icon: 'icon-manage-retail-category',
            className: 'dashboard-cashBagSubmission'
          }]
      }
    ];

  });
