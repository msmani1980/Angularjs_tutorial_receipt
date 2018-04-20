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
        featureCode: "CBG",
        optionCode: "CSL",
        choiceCode: "ACT",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'cashLessCompany',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'CashBag Length',
        featureCode: "CBG",
        optionCode: "CBV",
        choiceCode: "CNL",
        configSource: 'COMPANY_FEATURE',
        inputType: 'NUMBER',
        id: 'cashBagLength'
      },
      {
        name: 'Required CashBag Validation',
        featureCode: "",
        optionCode: "",
        choiceCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'requiredCashBagValidation',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Daily Exchange Rate Type',
        featureCode: "CBG",
        optionCode: "ERT",
        configSource: 'COMPANY_FEATURE',
        inputType: 'SELECT',
        id: 'dailyExchangeRateType',
        values: [
          {
            name: 'Bank',
            choiceCode: 'BNK'
          },
          {
            name: 'Paper and Coin',
            choiceCode: 'PAC'
          }
        ]
      },
      {
        name: 'Daily Exchange Rate',
        featureCode: "",
        optionCode: "",
        choiceCode: "",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'dailyExchangeRate',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Daily Exchange Rate - Daily Variance Threshold',
        featureCode: "DAILYEXCHANGERATE",
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'dailyExchangeRateDailyVarianceThreshold'
      },
      {
        name: 'Default Bank Reference Number',
        featureCode: "CBG",
        optionCode: "BRN",
        choiceCode: "BRN",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'defaultBankReferenceNumber',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Auto Submit: Functionality',
        featureCode: "CBG",
        optionCode: "ATS",
        choiceCode: "ACT",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'autoSubmit:Functionality',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.preOrderConfigOptions = [
      {
        name: 'PreOrder Configuration',
        featureCode: "PORD",
        optionCode: "PORD",
        choiceCode: "ACT",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'preorder',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.stationOpsConfigOptions = [
      {
        name: 'Store Instance Schedule Date Option',
        featureCode: "DSP",
        optionCode: "ISD",
        configSource: 'COMPANY_FEATURE',
        inputType: 'SELECT',
        id: 'storeInstanceScheduleDateOption',
        values: [
          {
            name: 'Blank',
            choiceCode: 'BLNK'
          },
          {
            name: 'Current Date',
            choiceCode: 'CDTE'
          },
          {
            name: 'Current Date +1',
            choiceCode: 'TDTE'
          }
        ]
      },
      {
        name: 'Sort By Sales Category',
        featureCode: "DSP",
        optionCode: "SORTBY",
        configSource: 'COMPANY_FEATURE',
        inputType: 'SELECT',
        id: 'sortBySalesCategory',
        values: [
          {
            name: 'Item Name',
            choiceCode: 'ITEMNME'
          },
          {
            name: 'Sales Category',
            choiceCode: 'SLSCTGY'
          }
        ]
      },
      {
        name: 'Store Dispatch – Variance Threshold',
        featureCode: "STOREDISPATCH",
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'storeDispatchVarianceThreshold'
      },
      {
        name: 'Inbound Count Default to ePOS Sales Quantity',
        featureCode: "INB",
        optionCode: "INC",
        choiceCode: "ACT",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'inboundCountDefaultPOSSalesQuantity',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.reconcileConfigOptions = [
      {
        name: 'Confirmation Threshold',
        featureCode: "RECONCILIATION",
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'confirmationThreshold'
      },
      {
        name: 'Amend-Amend Required to Confirm',
        featureCode: "AMD",
        optionCode: "ARC",
        choiceCode: "ACT",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendRequiredToConfirm',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Amend Auto Delete CashBag',
        featureCode: "AMD",
        optionCode: "ADC",
        choiceCode: "ADCOFF",
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoDeleteCashBag',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Amend Auto Merge CashBag',
        featureCode: "AMD",
        optionCode: "AMC",
        choiceCode: "AMCOFF",
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
