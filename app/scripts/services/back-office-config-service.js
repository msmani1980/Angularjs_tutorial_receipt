'use strict';

/**
 * @ngdoc service
 * @name ts5App.backOfficeConfigService
 * @description
 * # backOfficeConfigService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('backOfficeConfigService', function () {
    var $this = this;

    $this.cashBagConfigOptions = [
      {
        name: 'Cashless Company',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'cashLessCompany',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'CashBag Length',
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'cashBagLength'
      },
      {
        name: 'Required CashBag Validation',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'requiredCashBagValidation',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Daily Exchange Rate Type',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'dailyExchangeRateType',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Daily Exchange Rate',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'dailyExchangeRate',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Daily Exchange Rate - Daily Variance Threshold',
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'dailyExchangeRateDailyVarianceThreshold'
      },
      {
        name: 'Default Bank Reference Number',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'defaultBankReferenceNumber',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Auto Submit: Functionality',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'autoSubmit:Functionality',
        values: angular.copy($scope.radioButtonValues)
      }
    ];

    $this.preOrderConfigOptions = [
      {
        name: 'PreOrder Configuration',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'preorder',
        values: angular.copy($scope.radioButtonValues)
      }
    ];

    $this.stationOpsConfigOptions = [
      {
        name: 'Store Instance Schedule Date Option',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'storeInstanceScheduleDateOption',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Sort By Sales Category',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'sortBySalesCategory',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Store Dispatch – Variance Threshold',
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'storeDispatchVarianceThreshold',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Inbound Count Default to ePOS Sales Quantity',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'inboundCountDefaultPOSSalesQuantity',
        values: angular.copy($scope.radioButtonValues)
      }
    ];

    $this.reconcileConfigOptions = [
      {
        name: 'Confirmation Threshold',
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'confirmationThreshold'
      },
      {
        name: 'Amend-Amend Required to Confirm',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendRequiredToConfirm',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Amend Auto Delete CashBag',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoDeleteCashBag',
        values: angular.copy($scope.radioButtonValues)
      },
      {
        name: 'Amend Auto Merge CashBag',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoMergeCashBag',
        values: angular.copy($scope.radioButtonValues)
      }
    ];

    this.configFeatureOptionsDefinition = function () {
      return {
        cashBagConfigOptions: $this.cashBagConfigOptions,
        preOrderConfigOptions: $this.preOrderConfigOptions,
        stationOpsConfigOptions: $this.stationOpsConfigOptions,
        reconcileConfigOptions: $this.reconcileConfigOptions
      };
    };
  });
