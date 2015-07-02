'use strict';

describe('Controller: ItemImportCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stockowner-companies.json', 'served/retail-items.json'));

  var ItemImportCtrl,
    scope,
    itemImportFactory,
    importedCompaniesResponseJSON,
    getCompanyListDeferred,
    companyId,
    retailItemsResponseJSON,
    getItemsListDeferred,
    importItemsDeferred,
    currentCompanyId = 4;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _itemImportFactory_) {
    scope = $rootScope.$new();

    inject(function (_servedStockownerCompanies_, _servedRetailItems_) {
      importedCompaniesResponseJSON = _servedStockownerCompanies_;
      retailItemsResponseJSON = _servedRetailItems_;
    });

    itemImportFactory = _itemImportFactory_;

    getCompanyListDeferred = $q.defer();
    getCompanyListDeferred.resolve(importedCompaniesResponseJSON);
    spyOn(itemImportFactory, 'getCompanyList').and.returnValue(getCompanyListDeferred.promise);

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(retailItemsResponseJSON);
    spyOn(itemImportFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);

    importItemsDeferred = $q.defer();
    importItemsDeferred.resolve({'ImportItems':{'importItems':[1,2,3]}});
    spyOn(itemImportFactory, 'importItems').and.returnValue(importItemsDeferred.promise);

    spyOn(itemImportFactory, 'getCompanyId').and.returnValue(currentCompanyId);
    companyId = itemImportFactory.getCompanyId();

    ItemImportCtrl = $controller('ItemImportCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('scope globals', function () {
    it('should attach a viewName to the scope', function () {
      expect(scope.viewName).toBe('Import Stock Owner Items');
    });
    it('should have a changeSelectedImportCompany function attached to the scope', function(){
      expect(scope.changeSelectedImportCompany).toBeDefined();
      expect(Object.prototype.toString.call(scope.changeSelectedImportCompany)).toBe('[object Function]');
    });
    it('should have a importAll function attached to the scope', function(){
      expect(scope.importAll).toBeDefined();
      expect(Object.prototype.toString.call(scope.importAll)).toBe('[object Function]');
    });
    it('should have a isCompanyItem function attached to the scope', function(){
      expect(scope.isCompanyItem).toBeDefined();
      expect(Object.prototype.toString.call(scope.isCompanyItem)).toBe('[object Function]');
    });
    it('should have a removeRetailItem function attached to the scope', function(){
      expect(scope.removeRetailItem).toBeDefined();
      expect(Object.prototype.toString.call(scope.removeRetailItem)).toBe('[object Function]');
    });
    it('should have a removeAll function attached to the scope', function(){
      expect(scope.removeAll).toBeDefined();
      expect(Object.prototype.toString.call(scope.removeAll)).toBe('[object Function]');
    });
    it('should have a submitForm function attached to the scope', function(){
      expect(scope.submitForm).toBeDefined();
      expect(Object.prototype.toString.call(scope.submitForm)).toBe('[object Function]');
    });
    it('should have a canRemove function attached to the scope', function(){
      expect(scope.canRemove).toBeDefined();
      expect(Object.prototype.toString.call(scope.canRemove)).toBe('[object Function]');
    });
    it('should have a dropSuccessHandler function attached to the scope', function(){
      expect(scope.dropSuccessHandler).toBeDefined();
      expect(Object.prototype.toString.call(scope.dropSuccessHandler)).toBe('[object Function]');
    });
    it('should have a onDrop function attached to the scope', function(){
      expect(scope.onDrop).toBeDefined();
      expect(Object.prototype.toString.call(scope.onDrop)).toBe('[object Function]');
    });
  });

  describe('itemImportFactory API calls', function () {
    it('should call getCompanyList', function () {
      expect(itemImportFactory.getCompanyList).toHaveBeenCalledWith({
        companyTypeId: 2,
        limit: null
      });
    });
    it('should have importCompanyList attached to scope after API call', function () {
      expect(scope.importCompanyList).toBeDefined();
      expect(angular.isArray(scope.importCompanyList)).toBe(true);
    });
    it('should call getItemsList', function () {
      expect(itemImportFactory.getItemsList).toHaveBeenCalled();
    });
    it('should have companyRetailItemList attached to scope after API call', function () {
      expect(scope.companyRetailItemList).toBeDefined();
    });
  });

  describe('changeSelectedImportCompany scope function', function(){
    var companyId = 407;
    beforeEach(function(){
      scope.selectedImportCompany = {id:companyId};
      scope.changeSelectedImportCompany();
      scope.$digest();
    });
    it('should not return false', function(){
      expect(scope.changeSelectedImportCompany()).not.toBe(false);
    });
    it('should call getItemsList', function () {
      expect(itemImportFactory.getItemsList).toHaveBeenCalledWith({companyId:companyId});
    });
    it('should set importedRetailItemList as an array in scope', function(){
      expect(scope.importedRetailItemList).toBeDefined();
      expect(Object.prototype.toString.call(scope.importedRetailItemList)).toBe('[object Array]');
    });
    it('should return false if no import company is defined', function(){
      scope.selectedImportCompany = undefined;
      scope.$digest();
      expect(scope.changeSelectedImportCompany()).toBe(false);
    });
  });

  describe('importAll scope function', function(){
    var companyId = 407;
    beforeEach(function(){
      scope.selectedImportCompany = {id:companyId};
      scope.companyRetailItemList = [
        {companyId:currentCompanyId,itemCode:'123re',itemName:'123re',onBoardName:'123re'},
        {companyId:432,itemCode:'456re',itemName:'456re',onBoardName:'456re'}];
      scope.importedRetailItemList = [
        {companyId:currentCompanyId,itemCode:'123',itemName:'123',onBoardName:'123'},
        {companyId:432,itemCode:'456',itemName:'456',onBoardName:'456'},
        {companyId:432,itemCode:'456re2',itemName:'456re2',onBoardName:'456re'}];
      scope.importAll();
      scope.$digest();
    });
    it('should not return false', function(){
      expect(scope.importAll()).not.toBe(false);
    });
    it('should set companyRetailItemList as an array in scope', function(){
      expect(scope.companyRetailItemList).toBeDefined();
      expect(Object.prototype.toString.call(scope.companyRetailItemList)).toBe('[object Array]');
    });
    it('should set importedRetailItemList as an empty array in scope', function(){
      expect(scope.importedRetailItemList).toBeDefined();
      expect(Object.prototype.toString.call(scope.importedRetailItemList)).toBe('[object Array]');
      expect(scope.importedRetailItemList.length).toEqual(0);
    });
  });

  describe('isCompanyItem scope function', function(){
    it('should return false when invalid companyId is passed', function(){
      expect(scope.isCompanyItem({companyId:2})).toBe(false);
    });
    it('should return true when same companyId is passed', function(){
      expect(scope.isCompanyItem({companyId:currentCompanyId})).toBe(true);
    });
  });

  describe('removeRetailItem scope function', function(){
    var retailItem1 = {companyId:currentCompanyId,itemCode:'123',itemName:'123',onBoardName:'123',stockOwnerCode:null};
    var retailItem2 = {companyId:432,itemCode:'456',itemName:'456',onBoardName:'456',stockOwnerCode:'4567'};
    beforeEach(function(){
      scope.companyRetailItemList = [retailItem2];
      scope.importedRetailItemList = [];
      scope.selectedImportCompany = {id:432};
      scope.$digest();
    });
    it('should expect importedRetailItemList array length to be 1', function() {
      scope.removeRetailItem(retailItem2);
      expect(scope.importedRetailItemList.length).toEqual(1);
    });
    it('should expect companyRetailItemList array length to be 0', function() {
      scope.removeRetailItem(retailItem2);
      expect(scope.companyRetailItemList.length).toEqual(0);
    });
  });

  describe('removeAll scope function', function(){
    beforeEach(function(){
      scope.companyRetailItemList = [
        {companyId:currentCompanyId,id:1,itemCode:'123',itemName:'123',onBoardName:'123',stockOwnerCode:'123'},
        {companyId:currentCompanyId,id:2,itemCode:'1234',itemName:'1234',onBoardName:'1234',stockOwnerCode:null},
        {companyId:432,id:3,itemCode:'12345',itemName:'12345',onBoardName:'12345',stockOwnerCode:null},
        {companyId:432,id:4,itemCode:'123456',itemName:'123456',onBoardName:'123456',stockOwnerCode:null}];
      scope.importedRetailItemList = [];
      scope.selectedImportCompany = {id:432};
      scope.$digest();
      scope.removeAll();
    });
    it('should reset companyRetailItemList to 1 item', function(){
      expect(scope.companyRetailItemList.length).toEqual(1);
    });
    it('should reset importedRetailItemList to 2 items', function(){
      expect(scope.importedRetailItemList.length).toEqual(2);
    });
  });

  describe('submitForm scope function', function(){
    var payload;
    beforeEach(function(){
      var items = [{companyId:5,id:4,itemCode:'a123456',itemName:'a123456',onBoardName:'a123456',itemMasterId:'1234'}];
      scope.companyRetailItemList = items;
      payload = {ImportItems:{importItems: [1234]}};
      scope.$digest();
      scope.submitForm();
    });
    it('should call itemImportFactory\' importItems', function(){
      expect(itemImportFactory.importItems).toHaveBeenCalledWith(payload);
    });
  });

  describe('canRemove scope function', function(){
    it('should return false if stockOwnerCode is null and companyID is equal to existing company\'s ID', function(){
      expect(scope.canRemove({stockOwnerCode:null,companyId:currentCompanyId})).toBe(false);
    });
    it('should return true if stockOwnerCode is null and companyID is NOT equal to existing company\'s ID', function(){
      expect(scope.canRemove({stockOwnerCode:null,companyId:42342})).toBe(true);
    });
    it('should return true if stockOwnerCode is not null and companyID is NOT equal to existing company\'s ID', function(){
      expect(scope.canRemove({stockOwnerCode:'test123',companyId:42342})).toBe(true);
    });
    it('should return true if stockOwnerCode is not null and companyID is equal to existing company\'s ID', function(){
      expect(scope.canRemove({stockOwnerCode:'test123',companyId:currentCompanyId})).toBe(true);
    });
  });

});
