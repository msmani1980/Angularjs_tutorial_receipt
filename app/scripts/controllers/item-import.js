'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemImportCtrl
 * @description
 * # ItemImportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemImportCtrl', function ($scope, $q, ItemImportFactory) {

    // private controller vars
    var _companyId = null,
      _stockOwnerItemsFullList = [];

    // scope properties
    $scope.viewName = 'Import Stock Owner Items';
    $scope.selectedStockownerCompany = null;

    // scope functions
    $scope.changeSelectedStockownerCompany = function () {
      $scope.stockownersRetailItemList = [];
      if (!angular.isObject($scope.selectedStockownerCompany)) {
        return;
      }
      if (!angular.isDefined($scope.selectedStockownerCompany.id)) {
        return;
      }
      ItemImportFactory.getItemsList({companyId: $scope.selectedStockownerCompany.id}).then(function (response) {
        _stockOwnerItemsFullList = response.retailItems;
        setStockownersRetailItemList();
      });
    };
    $scope.importAll = function () {
      setAirlineRetailItemSkus($scope.stockownersRetailItemList);
      $scope.airlineRetailItemList = $scope.airlineRetailItemList.concat($scope.stockownersRetailItemList);
      $scope.stockownersRetailItemList = [];
    };
    $scope.cannotRemoveRetailItem = function (retailItem) {
      return retailItem.companyId === _companyId;
    };
    $scope.removeRetailItem = function (retailItem) {
      if ($scope.cannotRemoveRetailItem(retailItem)) {
        return;
      }
      var i = $scope.airlineRetailItemList.indexOf(retailItem);
      $scope.airlineRetailItemList.splice(i, 1);
      setStockownersRetailItemList();
    };
    $scope.removeAll = function () {
      var originalAirlineRetailItemList = [];
      angular.forEach($scope.airlineRetailItemList, function (retailItem) {
        if ($scope.cannotRemoveRetailItem(retailItem)) {
          originalAirlineRetailItemList.push(retailItem);
        }
      });
      $scope.airlineRetailItemList = originalAirlineRetailItemList;
      setStockownersRetailItemList();
    };

    // private controller functions
    function setStockownersRetailItemList() {
      $scope.stockownersRetailItemList = [];
      angular.forEach(_stockOwnerItemsFullList, function (retailItem) {
        retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
        retailItem.companyName = $scope.selectedStockownerCompany.companyName;
        if (-1 === $scope.airlineRetailItemList.indexOf(retailItem)) {
          this.push(retailItem);
        }
      }, $scope.stockownersRetailItemList);
    }
    function setAirlineRetailItemSkus(retailItems) {
      angular.forEach(retailItems, function (retailItem) {
        if (-1 !== $scope.airlineRetailItemList.indexOf(retailItem)) {
          $scope.airlineRetailItemList.push(retailItem);
        }
      });
    }

    // private controller classes
    var randomHexColorClass = {
      predefined: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF1493', '#FFA500', '#FFD700', '#008080', '#9400D3'],
      storage: {
        items: [],
        itemColor: [],
      },
      get: function (itemId) {
        // if the company has a color saved, return it
        if (-1 !== this.storage.items.indexOf(itemId)) {
          // get com
          return this.getFromStorage(itemId);
        }
        var randColor;
        // if there are no more predefined colors, generate one
        if (!this.predefined.length) {
          randColor = this.generate();
        }
        // else choose predefined color
        else {
          var randomIndex = Math.floor(Math.random() * this.predefined.length);
          randColor = this.predefined[randomIndex];
          this.predefined.splice(randomIndex, 1);
        }
        // push company and color to storage
        this.storage.items.push(itemId);
        this.storage.itemColor.push(randColor);
        return this.getFromStorage(itemId);
      },
      getFromStorage: function (itemId) {
        return this.storage.itemColor[this.storage.items.indexOf(itemId)];
      },
      generate: function () {
        var hexPieces = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        var colorString = '#';
        for (var i = 0; i < 6; i++) {
          colorString += hexPieces[Math.floor(Math.random() * hexPieces.length)];
        }
        return colorString;
      }
    };

    // Controller constructor
    (function constructor() {
      _companyId = ItemImportFactory.getCompanyId();
      var promises = [
        ItemImportFactory.getCompaniesList({companyTypeId: 2, limit: null}).then(function (response) {
          // TODO - assign colors to each company
          var companies = response.companies;

          // TODO - Can only mock until https://jira.egate-solutions.com/browse/TSVPORTAL-2038 is done
          var mockResponse = {'companies':[{'id':419,'companyName':'TEST_009','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'TEST_009','ediName':'TEST_009','dbaName':'TEST_009','countRelation':'1','baseCurrencyCode':'USD','companyCode':'TEST_009','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':413,'companyName':'GRO555','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'GrotestCompany','ediName':'EDI','dbaName':'TestDba','countRelation':'1','baseCurrencyCode':'USD','companyCode':'5555','isActive':'false','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':407,'companyName':'GRO2','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'GRO2','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'GBP','companyCode':'223423','isActive':'true','baseCurrencyId':8,'companyLanguages':'','exchangeRateVariance':null},{'id':404,'companyName':'StockOwner1','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'StockOwner1','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'USD','companyCode':'12345','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':396,'companyName':'stockCom12','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'stockCom12','ediName':'stockCom1','dbaName':'stockCom12','countRelation':'0','baseCurrencyCode':'USD','companyCode':'st21','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':392,'companyName':'stockCom','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'stockCom','ediName':'stockCom','dbaName':'stockCom','countRelation':'0','baseCurrencyCode':'USD','companyCode':'st2','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':378,'companyName':'TestTraining','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':null,'legalName':'TestTraining','ediName':null,'dbaName':'TestDBA','countRelation':'0','baseCurrencyCode':'USD','companyCode':'555','isActive':'true','baseCurrencyId':1,'companyLanguages':'','exchangeRateVariance':null},{'id':375,'companyName':'delarchetest','companyTypeName':'Stockowner','companyTypeId':2,'parentCompanyId':369,'legalName':'dddd','ediName':null,'dbaName':null,'countRelation':'0','baseCurrencyCode':'TTS','companyCode':'dsf','isActive':'false','baseCurrencyId':13,'companyLanguages':'French(Standard)','exchangeRateVariance':null}],'meta':{'count':8,'limit':8,'start':0}};
          $scope.mockData1 = true;

          companies = mockResponse.companies;

          angular.forEach(companies, function (company) {
            company.hexColor = randomHexColorClass.get(company.id);
          });
          $scope.stockOwnerList = companies;
        }),
        ItemImportFactory.getItemsList({companyId: _companyId}).then(function (response) {
          $scope.airlineRetailItemList = response.retailItems;
          setAirlineRetailItemSkus(response.retailItems);
        })
      ];
      $q.all(promises).then(function () {
        $scope.companiesLoaded = true;
        angular.forEach($scope.airlineRetailItemList, function (retailItem) {
          retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
        });
      });
    })();

    // controller event handlers
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
