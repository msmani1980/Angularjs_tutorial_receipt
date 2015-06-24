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
    var _companyId = null;

    // scope properties
    $scope.viewName = 'Import Stock Owner Items';
    $scope.selectedStockownerCompany = null;
    $scope.companiesLoaded = false;


    $scope.changeSelectedStockownerCompany = function(){
      $scope.stockOwnerItemsList = [];
      ItemImportFactory.getItemsList({companyId:$scope.selectedStockownerCompany.id}).then(function(response){
        $scope.stockOwnerItemsList = response.retailItems;
      });
    };

    // scope methods
    $scope.importAll = function(value){
      if(!angular.isDefined(value)){
        value = document.getElementById('stockOwnerId').value;
      }
      ItemImportFactory.getItemsList({companyId:value}).then(function(response){
        $scope.stockOwnerItemsList = response.retailItems;
      });
    };

    // Constructor
    (function constructor(){
      _companyId = ItemImportFactory.getCompanyId();
      ItemImportFactory.getCompaniesList({companyTypeId:2,limit:null}).then(function(response){
        // TODO - assign colors to each company
        var companies = response.companies;

        // TODO - Can only mock until https://jira.egate-solutions.com/browse/TSVPORTAL-2038 is done
        var mockResponse = {'companies':[{'id':419,'companyName':'TEST_009','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'TEST_009','ediName':'TEST_009','dbaName':'TEST_009','countRelation':'1','baseCurrencyCode':'USD','companyCode':'TEST_009','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':413,'companyName':'GRO 555','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'Gro test Company ','ediName':'EDI ','dbaName':'Test Dba ','countRelation':'1','baseCurrencyCode':'USD','companyCode':'5555','isActive':'false','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':407,'companyName':'GRO 2','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'GRO 2','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'GBP','companyCode':'223423','isActive':'true','baseCurrencyId':8,'companyLanguages':'','exchangeRateVariance':null},{'id':404,'companyName':'StockOwner1','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'StockOwner1','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'USD','companyCode':'12345','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':396,'companyName':'stockCom12','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'stockCom12','ediName':'stockCom1','dbaName':'stockCom12','countRelation':'0','baseCurrencyCode':'USD','companyCode':'st21','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':392,'companyName':'stockCom','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'stockCom','ediName':'stockCom','dbaName':'stockCom','countRelation':'0','baseCurrencyCode':'USD','companyCode':'st2','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':378,'companyName':'Test Training ','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'Test Training ','ediName':null,'dbaName':'Test DBA','countRelation':'0','baseCurrencyCode':'USD','companyCode':'555','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':375,'companyName':'delarche test','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':369,'legalName':'dddd','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'TTS','companyCode':'dsf','isActive':'false','baseCurrencyId':13,'companyLanguages':'French (Standard)','exchangeRateVariance':null}],'meta':{'count':8,'limit':8,'start':0}};

        companies = mockResponse.companies;
        // companies.unshift({companyName:"Select Stock Owner",id:""});
        $scope.stockOwnerList = companies;
        $scope.companiesLoaded = true;
      });
      ItemImportFactory.getItemsList({companyId:_companyId}).then(function(response){
        $scope.itemList = response.retailItems;
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
/*
    // TODO: pull data from API
    $scope.stockOwnerList = [
      {name: 'GRO'},
      {name: 'Easy Jet'},
      {name: 'Delta'}
    ];

    // TODO: pull data from API
    $scope.stockOwnerItemsList = [{
      colorCode: '#00FF00',
      companyName: 'GRO',
      reference: 'CHP0524',
      itemName: 'Bananas'
    }, {
      colorCode: '#FFF',
      companyName: 'Another one',
      reference: 'NTHR1',
      itemName: 'Apple'
    }];

    // TODO: pull data from API
    /*
    $scope.itemList = [{
      colorCode: '#00FF00',
      companyName: 'GRO',
      reference: 'PHN4',
      itemName: 'iPhone 5s'
    }, {
      colorCode: '#CCC',
      companyName: 'One more here too',
      reference: 'NMHRT2',
      itemName: 'iPad Mini Retina'
    }];
    */
  });
