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
  .controller('CreateItemCtrl', function ($scope,$http,baseUrl) {

  	// View Name to be displayed at the top of the form
  	$scope.viewName = 'Create Items'; 

  	// Data object we get form processing the form
  	$scope.formData = {};  

  	// Form template to be generated
    $scope.formTemplate = [
        {
            'type': 'text',
            'label': 'Retail Item Code',
            'model': 'itemCode',
            'attributes': {
            	'class': 'form-control'
            }
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
            'type': 'number',
            'label': 'Category ID',
            'model': 'categoryId',
            'val': 179
        },
        
        {
            'type': 'number',
            'label': 'Item Type',
            'model': 'itemTypeId',
            'val': 1
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
            'val': '20150417'
        },
        {
            'type': 'text',
            'label': 'Effective End Date',
            'model': 'endDate',
            'val': '20150517'
        },
    ];

    // Submits the form, registered in views/directions/edit-form-header.html
  	$scope.submitForm = function() {

  		// inject this right now, need to build this into the template
  		this.formData.prices = [{startDate: '20150417', endDate: '20150517', typeId: '1', priceCurrencies: [], taxIs: 'Included',}];

  		// Request Object
	    var req = {
	        method: 'POST',
	        url: baseUrl + '/api/retail-items1',
	        headers: {
	            'Content-Type': 'application/json',
	            'userId': 1,
	            'companyId': 326
	        },
	        data: {
	        	retailItem: this.formData
	        }
	    };

	  	// Post Data to server
        $http(req).success(function(data) {

        	console.log('Created item!');
        	console.log(data);
           // success

        }).error(function(data) {
        	
        	console.log(data);

        });

  	};
    

  	

  });
