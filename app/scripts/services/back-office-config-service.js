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

    $this.radioButtonValues = [
      {
        name: 'True',
        value: true
      },
      {
        name: 'False',
        value: false
      }
    ];

    $this.cashBagConfigOptions = [
      {
        name: 'Cashless Company',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'cashLessCompany',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'CashBag Length',
        featureCode: "",
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'cashBagLength'
      },
      {
        name: 'Required CashBag Validation',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'requiredCashBagValidation',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Daily Exchange Rate Type',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'dailyExchangeRateType',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Daily Exchange Rate',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'dailyExchangeRate',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Daily Exchange Rate - Daily Variance Threshold',
        featureCode: "",
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'dailyExchangeRateDailyVarianceThreshold'
      },
      {
        name: 'Default Bank Reference Number',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'defaultBankReferenceNumber',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Auto Submit: Functionality',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'autoSubmit:Functionality',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.preOrderConfigOptions = [
      {
        name: 'PreOrder Configuration',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'preorder',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.stationOpsConfigOptions = [
      {
        name: 'Store Instance Schedule Date Option',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'storeInstanceScheduleDateOption',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Sort By Sales Category',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'sortBySalesCategory',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Store Dispatch – Variance Threshold',
        featureCode: "",
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'storeDispatchVarianceThreshold',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Inbound Count Default to ePOS Sales Quantity',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'inboundCountDefaultPOSSalesQuantity',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.reconcileConfigOptions = [
      {
        name: 'Confirmation Threshold',
        featureCode: "",
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'confirmationThreshold'
      },
      {
        name: 'Amend-Amend Required to Confirm',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendRequiredToConfirm',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Amend Auto Delete CashBag',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoDeleteCashBag',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Amend Auto Merge CashBag',
        featureCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoMergeCashBag',
        values: angular.copy($this.radioButtonValues)
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
