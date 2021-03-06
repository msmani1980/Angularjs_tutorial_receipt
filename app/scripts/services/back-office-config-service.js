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
        featureCode: 'CBG',
        optionCode: 'CSL',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'cashLessCompany',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'CashBag Length',
        featureCode: 'CBG',
        optionCode: 'CBV',
        choiceCode: 'CNL',
        configSource: 'COMPANY_FEATURE',
        inputType: 'NUMBER',
        id: 'cashBagLength'
      },
      {
        name: 'Daily Exchange Rate Type',
        featureCode: 'CBG',
        optionCode: 'ERT',
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
        name: 'Daily Exchange Rate - Daily Variance Threshold',
        info: 'Daily Exchange Rate - Daily Variance Threshold',
        featureCode: 'DAILYEXCHANGERATE',
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'dailyExchangeRateDailyVarianceThreshold'
      },
      {
        name: 'Default Bank Reference Number',
        featureCode: 'CBG',
        optionCode: 'BRN',
        choiceCode: 'BRN',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'defaultBankReferenceNumber',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Auto Submit: Functionality',
        featureCode: 'CBG',
        optionCode: 'ATS',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'autoSubmit:Functionality',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.preOrderConfigOptions = [
      {
        name: 'PreOrder Configuration',
        featureCode: 'PORD',
        optionCode: 'PORD',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'preorder',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.stationOpsConfigOptions = [
      {
        name: 'Store Instance Schedule Date Option',
        featureCode: 'DSP',
        optionCode: 'ISD',
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
        featureCode: 'DSP',
        optionCode: 'SORTBY',
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
        info: 'Store Dispatch – Variance Threshold',
        featureCode: 'STOREDISPATCH',
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'storeDispatchVarianceThreshold'
      },
      {
        name: 'Inbound Count Default to ePOS Sales Quantity',
        featureCode: 'INB',
        optionCode: 'INC',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'inboundCountDefaultPOSSalesQuantity',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Default Ullage counts to Inbound counts for \'Wastage\' stock',
        featureCode: 'INB',
        optionCode: 'IWST',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'defaultUllageCountsToInboundCountsForWastageStock',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Fresh Food \'Wastage\' Config',
        featureCode: 'INB',
        optionCode: 'FFW',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'resetCurrentCountsForFreshFoodWastage',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.reconcileConfigOptions = [
      {
        name: 'Confirmation Threshold',
        info: 'Reconciliation - Confirmation Threshold',
        featureCode: 'RECONCILIATION',
        configSource: 'SALES_THRESHOLD',
        inputType: 'PERCENTAGE_NUMBER',
        id: 'confirmationThreshold'
      },
      {
        name: 'Amend-Amend Required to Confirm',
        featureCode: 'AMD',
        optionCode: 'ARC',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendRequiredToConfirm',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Amend Auto Delete CashBag',
        featureCode: 'AMD',
        optionCode: 'ADC',
        choiceCode: 'ADCOFF',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoDeleteCashBag',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Amend Auto Merge CashBag',
        featureCode: 'AMD',
        optionCode: 'AMC',
        choiceCode: 'AMCOFF',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'amendAutoMergeCashBag',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.userConfigOptions = [
      {
        name: 'User Configuration - Number of days to Deactivate User',
        featureCode: 'IAM',
        optionCode: 'IAM',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'NUMBER',
        id: 'preorder'
      }
    ];

    $this.itemConfigOptions = [
      {
        name: 'Item Configuration - Show SAT fields',
        featureCode: 'ITM',
        optionCode: 'SAT',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'itemConfigurationShowSatFields',
        values: angular.copy($this.radioButtonValues)
      }
    ];

    $this.loyaltyBackupConfigOptions = [
      {
        name: 'Use Backup payment method',
        featureCode: 'LOY',
        optionCode: 'UBP',
        choiceCode: 'ACT',
        configSource: 'COMPANY_FEATURE',
        inputType: 'RADIO_BUTTON',
        id: 'useBackupPaymentMethod',
        values: angular.copy($this.radioButtonValues)
      },
      {
        name: 'Payment method',
        featureCode: 'LOY',
        optionCode: 'BPM',
        configSource: 'COMPANY_FEATURE',
        inputType: 'SELECT',
        id: 'selectBackupPayment',
        values: [
          {
            name: 'Credit Card',
            choiceCode: 'SBPCC'
          },
          {
            name: 'Voucher',
            choiceCode: 'SBPV'
          }
        ]
      },
      {
        name: 'Backup Payment Threshold',
        featureCode: 'LOY',
        optionCode: 'BPT',
        choiceCode: 'BPTA',
        configSource: 'COMPANY_FEATURE',
        inputType: 'NUMBER',
        id: 'backupPaymentThresholdAmt'
      },
    ];

    this.configFeatureOptionsDefinition = function () {
      return {
        cashBagConfigOptions: $this.cashBagConfigOptions,
        preOrderConfigOptions: $this.preOrderConfigOptions,
        stationOpsConfigOptions: $this.stationOpsConfigOptions,
        reconcileConfigOptions: $this.reconcileConfigOptions,
        userConfigOptions: $this.userConfigOptions,
        itemConfigOptions: $this.itemConfigOptions,
        loyaltyBackupConfigOptions: $this.loyaltyBackupConfigOptions
      };
    };
  });
