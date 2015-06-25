'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemImportCtrl
 * @description
 * # ItemImportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemImportCtrl', function ($scope, $q, ItemImportFactory ) {

    // controller global properties
    var _companyId    = null,
      _stockOwnerItemsFullList = [];

    // scope properties
    $scope.viewName = 'Import Stock Owner Items';
    $scope.selectedStockownerCompany = null;
    $scope.companiesLoaded = false;

    // scope methods
    $scope.companyHexColor = function(useCurrentCompanyId){
      if(angular.isDefined(useCurrentCompanyId)){
        return helpers.randomHexColor.get(_companyId);
      }
      if(!angular.isObject($scope.selectedStockownerCompany) || !angular.isDefined($scope.selectedStockownerCompany.id)){
        return 'inherit';
      }
      return helpers.randomHexColor.get($scope.selectedStockownerCompany.id);
    };
    $scope.hexColor = function(retailItem){
      if(angular.isDefined(retailItem.hexColor)){
        return retailItem.hexColor;
      }
      retailItem.hexColor = helpers.randomHexColor.get(retailItem.companyId);
      return retailItem.hexColor;
    };
    $scope.changeSelectedStockownerCompany = function(){
      $scope.stockownersRetailItemList = [];
      if(!angular.isObject($scope.selectedStockownerCompany)){
        return;
      }
      if(!angular.isDefined($scope.selectedStockownerCompany.id)){
        return;
      }
      ItemImportFactory.getItemsList({companyId:$scope.selectedStockownerCompany.id}).then(function(response){
        _stockOwnerItemsFullList = response.retailItems;
        helpers.stockownersRetailItemList.set();
      });
    };
    $scope.importAll = function(){
      var retailItems = helpers.retailItemSkus.setMultiple($scope.stockownersRetailItemList);
      $scope.airlineRetailItemList = $scope.airlineRetailItemList.concat(retailItems);
      $scope.stockownersRetailItemList = [];
    };
    $scope.removeRetailItem = function(retailItem) {
      var i = $scope.airlineRetailItemList.indexOf(retailItem);
      $scope.airlineRetailItemList.splice(i, 1);

      if(!angular.isObject($scope.selectedStockownerCompany)){
        return;
      }
      if(!angular.isDefined($scope.selectedStockownerCompany.id)){
        return;
      }
      if($scope.selectedStockownerCompany.id != retailItem.companyId){
        return;
      }
      if(-1 !== $scope.stockownersRetailItemList.indexOf(retailItem)){
        return;
      }
      helpers.stockownersRetailItemList.set();
    };
    $scope.removeAll = function(){
      helpers.retailItemSkus.existing = [];
      $scope.airlineRetailItemList = [];
      helpers.stockownersRetailItemList.set();
    };

    // helpers
    var helpers = {
      stockownersRetailItemList: {
        set: function(){
          $scope.stockownersRetailItemList = [];
          angular.forEach(_stockOwnerItemsFullList, function(retailItem){
            if(!helpers.retailItemSkus.has(retailItem)) {
              this.push(retailItem);
            }
          }, $scope.stockownersRetailItemList);
        }
      },
      retailItemSkus: {
        existing: [],
        setMultiple: function(retailItems){
          var _retailItems = [];
          angular.forEach(retailItems, function(retailItem){
            helpers.retailItemSkus.set(retailItem);
            this.push(retailItem);
          }, _retailItems);
          return _retailItems;
        },
        set: function (retailItem) {
          if(!this.has(retailItem)) {
            this.existing.push(retailItem.itemCode);
          }
        },
        has: function (retailItem) {
          return -1 !== this.existing.indexOf(retailItem.itemCode);
        },
        remove: function(retailItem) {
          if(!this.has(retailItem)) {
            var i = this.existing.indexOf(retailItem.itemCode);
            this.existing.splice(i, 1);
          }
        }
      },
      randomHexColor: {
        predefined: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF1493', '#FFA500', '#FFD700', '#008080', '#9400D3'],
        storage: {
          companies: [],
          companyColor: [],
        },
        get: function (companyId) {
          // if the company has a color saved, return it
          if(-1 !== this.storage.companies.indexOf(companyId)) {
            // get com
            return this.getFromStorage(companyId);
          }

          var randColor;
          // if there are no more predefined colors, generate one
          if (!this.predefined.length) {
            randColor = this.generate();
          }
          // else choose predefined color
          else{
            var randomIndex = Math.floor(Math.random() * this.predefined.length);
            randColor = this.predefined[randomIndex];
            this.predefined.splice(randomIndex, 1);
          }

          // push company and color to storage
          this.storage.companies.push(companyId);
          this.storage.companyColor.push(randColor);
          return this.getFromStorage(companyId);
        },
        getFromStorage: function(companyId){
          return this.storage.companyColor[this.storage.companies.indexOf(companyId)];
        },
        generate: function () {
          var hexPieces = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
          var colorString = '#';
          for (var i = 0; i < 6; i++) {
            colorString += hexPieces[Math.floor(Math.random() * hexPieces.length)];
          }
          return colorString;
        }
      }
    };

    // Constructor
    (function constructor(){
      _companyId = ItemImportFactory.getCompanyId();
      var promises = [ItemImportFactory.getCompaniesList({companyTypeId:2,limit:null}).then(function(response){
        // TODO - assign colors to each company
        var companies = response.companies;

        // TODO - Can only mock until https://jira.egate-solutions.com/browse/TSVPORTAL-2038 is done
        var mockResponse = {'companies':[{'id':419,'companyName':'TEST_009','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'TEST_009','ediName':'TEST_009','dbaName':'TEST_009','countRelation':'1','baseCurrencyCode':'USD','companyCode':'TEST_009','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':413,'companyName':'GRO 555','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'Gro test Company ','ediName':'EDI ','dbaName':'Test Dba ','countRelation':'1','baseCurrencyCode':'USD','companyCode':'5555','isActive':'false','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':407,'companyName':'GRO 2','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'GRO 2','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'GBP','companyCode':'223423','isActive':'true','baseCurrencyId':8,'companyLanguages':'','exchangeRateVariance':null},{'id':404,'companyName':'StockOwner1','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'StockOwner1','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'USD','companyCode':'12345','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':396,'companyName':'stockCom12','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'stockCom12','ediName':'stockCom1','dbaName':'stockCom12','countRelation':'0','baseCurrencyCode':'USD','companyCode':'st21','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':392,'companyName':'stockCom','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'stockCom','ediName':'stockCom','dbaName':'stockCom','countRelation':'0','baseCurrencyCode':'USD','companyCode':'st2','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':378,'companyName':'Test Training ','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'Test Training ','ediName':null,'dbaName':'Test DBA','countRelation':'0','baseCurrencyCode':'USD','companyCode':'555','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':375,'companyName':'delarche test','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':369,'legalName':'dddd','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'TTS','companyCode':'dsf','isActive':'false','baseCurrencyId':13,'companyLanguages':'French (Standard)','exchangeRateVariance':null}],'meta':{'count':8,'limit':8,'start':0}};;

        $scope.mockData1 = true;

        companies = mockResponse.companies;
        // companies.unshift({companyName:"Select Stock Owner",id:""});
        $scope.stockOwnerList = companies;
      }),
      ItemImportFactory.getItemsList({companyId:_companyId}).then(function(response){
        $scope.airlineRetailItemList = helpers.retailItemSkus.setMultiple(response.retailItems);
      })];
      $q.all(promises).then(function(){
        $scope.companiesLoaded = true;
      });
    })();

    // TODO: documentation here:
    // http://angular-dragdrop.github.io/angular-dragdrop/
    $scope.dropSuccessHandler = function ($event, index, array) {
      array.splice(index, 1);
    };

    $scope.onDrop = function ($event, $data, array) {
      array.push($data);
    };

    // TODO: change BACK button to back/save when models change
  });
