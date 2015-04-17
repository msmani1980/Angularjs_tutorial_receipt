'use strict';

/**
 * @author Max Felker <max@bigroomstudios.com>
 * @ngdoc function
 * @name ts5App.controller:CreateItemCtrl
 * @description
 * # CreateItemCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CreateItemCtrl', function ($scope) {

  	// View Name to be displayed at the top of the form
  	$scope.viewName = 'Create Items'; 

    $scope.formName = 'createItems';

  	// Data object we get form processing the form
  	$scope.formData = {};  

  	// Form template to be generated
    $scope.fields = [
        {
            'type': 'text',
            'label': 'Retail Item Code',
            'model': 'itemCode',
            'value': 'test'
        },
        {
            'type': 'text',
            'label': 'Item Name',
            'model': 'itemName'
        },
        {
            'type': 'text',
            'label': 'POS Display Name',
            'model': 'onBoardName'
        },
        {
            'type': 'text',
            'label': 'Category ID',
            'model': 'categoryId',
            'value': 179
        },
        
        {
            'type': 'select',
            'label': 'Item Type',
            'model': 'itemTypeId',
            'options': {
                1: 'Type 1',
                2: 'Type 2'
            }
        },
        
        {
            'type': 'text',
            'label': 'Item Description',
            'model': 'desc'
        },
        {
            'type': 'checkbox',
            'label': 'Print Receipt',
            'model': 'isPrintReceipt'
        },
        {
            'type': 'text',
            'label': 'Effective Start Date',
            'model': 'startDate',
            'value': '20150418'
        },
        {
            'type': 'text',
            'label': 'Effective End Date',
            'model': 'endDate',
            'value': '20150518'
        },   
    ];
   
  });