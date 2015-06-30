'use strict';

describe('Controller: CompanyRelationshipListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/company-list.json',
    'served/company-relationship-list.json',
    'served/company-relationship-type-list.json'
  ));

  var CompanyRelationshipListCtrl,
    scope,
    getCompanyListDeferred,
    getCompanyRelationshipListByCompanyDeferred,
    getCompanyRelationshipTypeListDeferred,
    companyRelationshipFactory,
    companyListJSON,
    companyRelationshipListByCompanyJSON,
    companyRelationshipTypeListJSON,
    location,
  getASDF,
    getFDSA;

  beforeEach(inject(function ($q, $controller, $rootScope, _companyRelationshipFactory_, $location) {
    inject(function (_servedCompanyList_, _servedCompanyRelationshipList_, _servedCompanyRelationshipTypeList_) {
      companyListJSON = _servedCompanyList_;
      companyRelationshipListByCompanyJSON = _servedCompanyRelationshipList_;
      companyRelationshipTypeListJSON = _servedCompanyRelationshipTypeList_;
    });

    location = $location;
    scope = $rootScope.$new();

    getCompanyListDeferred = $q.defer();
    getCompanyListDeferred.resolve(companyListJSON);
    getCompanyRelationshipListByCompanyDeferred = $q.defer();
    getCompanyRelationshipListByCompanyDeferred.resolve(companyRelationshipListByCompanyJSON);
    getCompanyRelationshipTypeListDeferred = $q.defer();
    getCompanyRelationshipTypeListDeferred.resolve(companyRelationshipTypeListJSON);
    getASDF = $q.defer();
    getASDF.resolve({});
    getFDSA = $q.defer();
    getFDSA.resolve({});

    companyRelationshipFactory = _companyRelationshipFactory_;

    spyOn(companyRelationshipFactory, 'getCompanyList').and.returnValue(getCompanyListDeferred.promise);
    spyOn(companyRelationshipFactory, 'getCompanyRelationshipListByCompany').and.returnValue(getCompanyRelationshipListByCompanyDeferred.promise);
    spyOn(companyRelationshipFactory, 'getCompanyRelationshipTypeList').and.returnValue(getCompanyRelationshipTypeListDeferred.promise);
    spyOn(companyRelationshipFactory, 'createCompanyRelationship').and.returnValue(getASDF.promise);
    spyOn(companyRelationshipFactory, 'updateCompanyRelationship').and.returnValue(getFDSA.promise);

    CompanyRelationshipListCtrl = $controller('CompanyRelationshipListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Company Relationships');
  });

  it('should get the company relationship list from API', function () {
    expect(companyRelationshipFactory.getCompanyRelationshipListByCompany).toHaveBeenCalled();
  });

  describe('companyRelationshipList in scope', function () {
    it('should attach a companyRelationshipList after a API call to getCompanyRelationshipList', function () {
      expect(!!scope.companyRelationshipListData).toBe(true);
    });
  });

  describe('submit scope function', function () {
    var companyRelationshipList;
    beforeEach(function () {
      companyRelationshipList = [
        {
          'id': 26,
          'companyId': 413,
          'companyName': 'GRO 555',
          'companyTypeName': 'Stockowner',
          'relativeCompanyId': 396,
          'relativeCompany': 'stockCom12',
          'relativeCompanyType': 'Stockowner',
          'startDate': '06/30/2015',
          'endDate': '07/08/2015'
        },
        {
          'id': 44,
          'companyId': 413,
          'companyName': 'GRO 555',
          'companyTypeName': 'Stockowner',
          'relativeCompanyId': 404,
          'relativeCompany': 'StockOwner1',
          'relativeCompanyType': 'Stockowner',
          'startDate': '06/24/2015',
          'endDate': '07/22/2015'
        },
        {
          'companyId': 413,
          'relativeCompanyId': 407,
          'startDate': '07/07/2015',
          'endDate': '07/08/2015'
        }
      ];
      scope.$digest();
      scope.submit(true, companyRelationshipList);
    });

    it('should call updateCompanyRelationship', function () {
      expect(companyRelationshipFactory.updateCompanyRelationship).toHaveBeenCalledWith(companyRelationshipList[0]);
      expect(companyRelationshipFactory.updateCompanyRelationship).toHaveBeenCalledWith(companyRelationshipList[1]);
    });

    it('should call createCompanyRelationship', function () {
      expect(companyRelationshipFactory.createCompanyRelationship).toHaveBeenCalledWith(companyRelationshipList[2]);
    });
  });
});
