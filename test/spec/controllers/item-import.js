'use strict';

describe('Controller: ItemImportCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stockowner-companies.json', 'served/retail-items.json'));

  var ItemImportCtrl,
    scope,
    ItemImportFactory,
    stockownerCompaniesResponseJSON,
    getCompaniesListDeferred,
    companyId,
    retailItemsResponseJSON,
    getItemsListDeferred,
    currentCompanyId = 4;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _ItemImportFactory_) {
    scope = $rootScope.$new();

    inject(function (_servedStockownerCompanies_, _servedRetailItems_) {
      stockownerCompaniesResponseJSON = _servedStockownerCompanies_;
      retailItemsResponseJSON = _servedRetailItems_;
    });

    ItemImportFactory = _ItemImportFactory_;

    getCompaniesListDeferred = $q.defer();
    getCompaniesListDeferred.resolve(stockownerCompaniesResponseJSON);
    spyOn(ItemImportFactory, 'getCompaniesList').and.returnValue(getCompaniesListDeferred.promise);

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(retailItemsResponseJSON);
    spyOn(ItemImportFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);

    spyOn(ItemImportFactory, 'importItems').and.callThrough();

    spyOn(ItemImportFactory, 'getCompanyId').and.returnValue(currentCompanyId);
    companyId = ItemImportFactory.getCompanyId();

    ItemImportCtrl = $controller('ItemImportCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('scope globals', function () {
    it('should attach a viewName to the scope', function () {
      expect(scope.viewName).toBe('Import Stock Owner Items');
    });
    it('should have a changeSelectedStockownerCompany function attached to the scope', function(){
      expect(scope.changeSelectedStockownerCompany).toBeDefined();
      expect(Object.prototype.toString.call(scope.changeSelectedStockownerCompany)).toBe('[object Function]');
    });
    it('should have a importAll function attached to the scope', function(){
      expect(scope.importAll).toBeDefined();
      expect(Object.prototype.toString.call(scope.importAll)).toBe('[object Function]');
    });
    it('should have a isAirlineItem function attached to the scope', function(){
      expect(scope.isAirlineItem).toBeDefined();
      expect(Object.prototype.toString.call(scope.isAirlineItem)).toBe('[object Function]');
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
    it('should have a dropSuccessHandler function attached to the scope', function(){
      expect(scope.dropSuccessHandler).toBeDefined();
      expect(Object.prototype.toString.call(scope.dropSuccessHandler)).toBe('[object Function]');
    });
    it('should have a onDrop function attached to the scope', function(){
      expect(scope.onDrop).toBeDefined();
      expect(Object.prototype.toString.call(scope.onDrop)).toBe('[object Function]');
    });
  });

  describe('ItemImportFactory API calls', function () {
    it('should call getCompaniesList', function () {
      expect(ItemImportFactory.getCompaniesList).toHaveBeenCalledWith({
        companyTypeId: 2,
        limit: null
      });
    });
    it('should have stockOwnerList attached to scope after API call', function () {
      expect(scope.stockOwnerList).toBeDefined();
      expect(angular.isArray(scope.stockOwnerList)).toBe(true);
    });
    it('should call getItemsList', function () {
      expect(ItemImportFactory.getItemsList).toHaveBeenCalled();
    });
    it('should have airlineRetailItemList attached to scope after API call', function () {
      expect(scope.airlineRetailItemList).toBeDefined();
    });
  });

  describe('changeSelectedStockownerCompany scope function', function(){
    var companyId = 407;
    beforeEach(function(){
      scope.selectedStockownerCompany = {id:companyId};
      scope.changeSelectedStockownerCompany();
      scope.$digest();
    });
    it('should not return false', function(){
      expect(scope.changeSelectedStockownerCompany()).not.toBe(false);
    });
    it('should call getItemsList', function () {
      expect(ItemImportFactory.getItemsList).toHaveBeenCalledWith({companyId:companyId});
    });
    it('should set stockownersRetailItemList as an array in scope', function(){
      expect(scope.stockownersRetailItemList).toBeDefined();
      expect(Object.prototype.toString.call(scope.stockownersRetailItemList)).toBe('[object Array]');
    });
    it('should return false if no stockowner company is defined', function(){
      scope.selectedStockownerCompany = undefined;
      scope.$digest();
      expect(scope.changeSelectedStockownerCompany()).toBe(false);
    });
  });

  describe('importAll scope function', function(){
    var companyId = 407;
    beforeEach(function(){
      scope.selectedStockownerCompany = {id:companyId};
      scope.airlineRetailItemList = [
        {companyId:currentCompanyId,itemCode:'123re',itemName:'123re',onBoardName:'123re'},
        {companyId:432,itemCode:'456re',itemName:'456re',onBoardName:'456re'}];
      scope.stockownersRetailItemList = [
        {companyId:currentCompanyId,itemCode:'123',itemName:'123',onBoardName:'123'},
        {companyId:432,itemCode:'456',itemName:'456',onBoardName:'456'},
        {companyId:432,itemCode:'456re2',itemName:'456re2',onBoardName:'456re'}];
      scope.importAll();
      scope.$digest();
    });
    it('should not return false', function(){
      expect(scope.importAll()).not.toBe(false);
    });
    it('should set airlineRetailItemList as an array in scope', function(){
      expect(scope.airlineRetailItemList).toBeDefined();
      expect(Object.prototype.toString.call(scope.airlineRetailItemList)).toBe('[object Array]');
    });
    it('should set stockownersRetailItemList as an empty array in scope', function(){
      expect(scope.stockownersRetailItemList).toBeDefined();
      expect(Object.prototype.toString.call(scope.stockownersRetailItemList)).toBe('[object Array]');
      expect(scope.stockownersRetailItemList.length).toEqual(0);
    });
    it('should not add the same object to the airlineRetailItemList array', function(){
      console.log(scope.airlineRetailItemList);
      expect(scope.airlineRetailItemList.length).toEqual(4);

    });
  });

  describe('isAirlineItem scope function', function(){
    it('should return false when invalid companyId is passed', function(){
      expect(scope.isAirlineItem({companyId:2})).toBe(false);
    });
    it('should return true when same companyId is passed', function(){
      expect(scope.isAirlineItem({companyId:currentCompanyId})).toBe(true);
    });
  });

  describe('removeRetailItem scope function', function(){
    var retailItem1 = {companyId:currentCompanyId,itemCode:'123',itemName:'123',onBoardName:'123'};
    var retailItem2 = {companyId:432,itemCode:'456',itemName:'456',onBoardName:'456'};
    beforeEach(function(){
      scope.airlineRetailItemList = [retailItem2];
      scope.stockownersRetailItemList = [];
      scope.selectedStockownerCompany = {id:432};
      scope.$digest();
    });
    it('should return false when retail Item\'s company ID is the same as current company ID', function(){
      expect(scope.removeRetailItem(retailItem1)).toBe(false);
      scope.stockownersRetailItemList = [];
      scope.$digest();
    });
    it('should expect stockownersRetailItemList array length to be 1', function() {
      scope.removeRetailItem(retailItem2);
      expect(scope.stockownersRetailItemList.length).toEqual(1);
    });
    it('should expect airlineRetailItemList array length to be 0', function() {
      scope.removeRetailItem(retailItem2);
      expect(scope.airlineRetailItemList.length).toEqual(0);
    });
  });

  describe('removeAll scope function', function(){
    beforeEach(function(){
      scope.airlineRetailItemList = [
        {companyId:432,id:1,itemCode:'123',itemName:'123',onBoardName:'123'},
        {companyId:432,id:2,itemCode:'1234',itemName:'1234',onBoardName:'1234'},
        {companyId:currentCompanyId,id:3,itemCode:'12345',itemName:'12345',onBoardName:'12345'},
        {companyId:34,id:4,itemCode:'123456',itemName:'123456',onBoardName:'123456'}];
      scope.stockownersRetailItemList = [];
      scope.selectedStockownerCompany = {id:432};
      scope.$digest();
      scope.removeAll();
    });
    it('should reset airlineRetailItemList to a single array item', function(){
      expect(scope.airlineRetailItemList.length).toEqual(1);
    });
    it('should reset stockownersRetailItemList to a single array item', function(){
      expect(scope.stockownersRetailItemList.length).toEqual(2);
    });
  });

  describe('submitForm scope function', function(){
    var payload;
    beforeEach(function(){
      var items = [{companyId:5,id:4,itemCode:'a123456',itemName:'a123456',onBoardName:'a123456',itemMasterId:'1234'}];
      scope.airlineRetailItemList = items;
      payload = {ImportItems:{importItems: [1234]}};
      scope.$digest();
      scope.submitForm();
    });
    it('should call ItemImportFactory\' importItems', function(){
      expect(ItemImportFactory.importItems).toHaveBeenCalledWith(payload);
    });
  });

});
