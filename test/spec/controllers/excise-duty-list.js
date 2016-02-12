'use strict';

describe('Controller: ExciseDutyListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/excise-duty-list.json'));
  beforeEach(module('served/country-list.json'));
  beforeEach(module('served/units-volume.json'));

  var ExciseDutyListCtrl;
  var exciseDutyFactory;
  var exciseDutyResponseJSON;
  var exciseDutyDeferred;
  var countryListResponseJSON;
  var countryListDeferred;
  var volumeListResponseJSON;
  var volumeListDeferred;
  var location;
  var dateUtility;
  var scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {

    inject(function (_servedExciseDutyList_, _servedCountryList_, _servedUnitsVolume_) {
      exciseDutyResponseJSON = _servedExciseDutyList_;
      countryListResponseJSON = _servedCountryList_;
      volumeListResponseJSON = _servedUnitsVolume_;
    });

    location = $location;
    exciseDutyFactory = $injector.get('exciseDutyFactory');
    dateUtility = $injector.get('dateUtility');
    scope = $rootScope.$new();

    exciseDutyDeferred = $q.defer();
    exciseDutyDeferred.resolve(exciseDutyResponseJSON);
    countryListDeferred = $q.defer();
    countryListDeferred.resolve(countryListResponseJSON);
    volumeListDeferred = $q.defer();
    volumeListDeferred.resolve(volumeListResponseJSON);

    spyOn(exciseDutyFactory, 'getExciseDutyList').and.returnValue(exciseDutyDeferred.promise);
    spyOn(exciseDutyFactory, 'getCountriesList').and.returnValue(countryListDeferred.promise);
    spyOn(exciseDutyFactory, 'getVolumeUnits').and.returnValue(volumeListDeferred.promise);
    spyOn(exciseDutyFactory, 'deleteExciseDuty').and.returnValue(exciseDutyDeferred.promise);
    spyOn(exciseDutyFactory, 'createExciseDuty').and.returnValue(exciseDutyDeferred.promise);
    spyOn(exciseDutyFactory, 'updateExciseDuty').and.returnValue(exciseDutyDeferred.promise);
    spyOn(location, 'path').and.callThrough();


    ExciseDutyListCtrl = $controller('ExciseDutyListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('initialize data', function () {
    it('should get list of companies and attach to scope', function () {
      expect(exciseDutyFactory.getCountriesList).toHaveBeenCalled();
      expect(scope.countryList).toBeDefined();
    });

    it('should get list of volume units and attach to scope', function () {
      expect(exciseDutyFactory.getVolumeUnits).toHaveBeenCalled();
      expect(scope.volumeUnits).toBeDefined();
    });
  });

  describe('get exciseDutyList', function () {
    beforeEach(function () {
      scope.getExciseDutyList();
      scope.$digest();
    });
    it('should get data from API and attach to scope', function () {
      expect(exciseDutyFactory.getExciseDutyList).toHaveBeenCalled();
      expect(scope.exciseDutyList).toBeDefined();
    });

    it('should format start and end date', function () {
      expect(dateUtility.isDateValidForApp(scope.exciseDutyList[0].startDate)).toEqual(true);
      expect(dateUtility.isDateValidForApp(scope.exciseDutyList[0].endDate)).toEqual(true);
    });

    it('should resolve countryName', function () {
      expect(dateUtility.isDateValidForApp(scope.exciseDutyList[0].countryName)).toBeDefined();
    });

    it('should resolve volume unit name', function () {
      expect(dateUtility.isDateValidForApp(scope.exciseDutyList[0].volumeUnit)).toBeDefined();
    });
  });

  describe('search exciseDutyList', function () {

    it('should get data from API with search payload', function () {
      scope.search = {
        startDate: '10/20/2015',
        endDate: '10/21/2015',
        commodityCode: 'testCode'
      };
      scope.searchExciseData();
      var expectedPayload = jasmine.objectContaining({
        startDate: '20151020',
        endDate: '20151021',
        commodityCode: 'testCode'
      });
      expect(exciseDutyFactory.getExciseDutyList).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('delete excise duty record', function () {
    beforeEach(function () {
      scope.search = {
        startDate: '10/20/2015'
      };
    });
    it('should call DELETE API', function () {
      var mockRecord = { id: 1 };
      scope.removeRecord(mockRecord);
      expect(exciseDutyFactory.deleteExciseDuty).toHaveBeenCalledWith(mockRecord.id);
    });

    it('should should call GET API with old search parameters', function () {
      var mockRecord = { id: 1 };
      var expectedSearchPayload = jasmine.objectContaining({
        startDate: '20151020'
      });
      scope.removeRecord(mockRecord);
      scope.$digest();
      expect(exciseDutyFactory.getExciseDutyList).toHaveBeenCalledWith(expectedSearchPayload);
    });
  });

  describe('create excise duty record', function () {
    beforeEach(function () {
      scope.newRecord = {
        startDate: '10/20/2015',
        endDate: '10/21/2015',
        commodityCode: 'testCode',
        dutyRate: '123.45',
        volumeUnitId: 1,
        country: { id: 2 },
        alcoholic: true
      };
      scope.search = {
        commodityCode: 'oldCommodityCode'
      };
      scope.exciseDutyCreateForm = {
        $valid: true,
        country: {
          $valid: true,
          $setValidity: function () {
            return true;
          }
        }
      };
      scope.createExciseDuty();
      scope.$digest();
    });
    it('should call POST API with formatted payload', function () {
      var expectedPayload = {
        startDate: '20151020',
        endDate: '20151021',
        commodityCode: 'testCode',
        dutyRate: 123.45,
        volumeUnitId: 1,
        countryId: 2,
        alcoholic: true
      };
      expect(exciseDutyFactory.createExciseDuty).toHaveBeenCalledWith(expectedPayload);
    });
    it('should call GET API with newly added record code', function () {
      var expectedSearchPayload = jasmine.objectContaining({
        commodityCode: 'oldCommodityCode,testCode'
      });
      expect(exciseDutyFactory.getExciseDutyList).toHaveBeenCalledWith(expectedSearchPayload);
    });
  });

  describe('edit excise duty record', function () {
    beforeEach(function () {
      scope.inEditMode = true;
      scope.recordToEdit = {
        id: 1,
        commodityCode: 'testCode',
        dutyRate: '123.45',
        startDate: '10/20/2015',
        endDate: '10/21/2015',
        volumeUnitId: 1,
        country: { id: 2 },
        alcoholic: true
      };

      scope.exciseDutyList = [{
        id: 1,
        startDate: '10/15/2015',
        endDate: '10/20/2015'
      }];

      scope.search = {
        startDate: '10/20/2015'
      };
    });

    it('should call PUT API with formatted payload', function () {
      var expectedPayload = {
        startDate: '20151020',
        endDate: '20151021',
        commodityCode: 'testCode',
        dutyRate: 123.45,
        volumeUnitId: 1,
        countryId: 2,
        alcoholic: true
      };
      scope.saveEdit();
      scope.$digest();
      expect(exciseDutyFactory.updateExciseDuty).toHaveBeenCalledWith(1, expectedPayload);
    });

    it('should format payload with old record if startDate and/or endDate is not populated', function () {
      scope.recordToEdit.startDate = '';
      scope.recordToEdit.endDate = '';

      var expectedPayload = {
        startDate: '20151015',
        endDate: '20151020',
        commodityCode: 'testCode',
        dutyRate: 123.45,
        volumeUnitId: 1,
        countryId: 2,
        alcoholic: true
      };
      scope.saveEdit();
      scope.$digest();
      expect(exciseDutyFactory.updateExciseDuty).toHaveBeenCalledWith(1, expectedPayload);
    });

    it('should call GET API with old search parameters', function () {
      scope.saveEdit();
      scope.$digest();
      var expectedSearchPayload = jasmine.objectContaining({
        startDate: '20151020'
      });
      expect(exciseDutyFactory.getExciseDutyList).toHaveBeenCalledWith(expectedSearchPayload);
    });
  });

  describe('scope helper functions', function () {
    describe('edit helpers', function () {
      describe('select to edit', function () {
        beforeEach(function () {
          var mockRecord = {
            id: 1,
            countryId: 66
          };
          scope.selectToEdit(mockRecord);
          scope.$digest();
        });
        it('should copy record to recordToEdit with full country object', function () {
          expect(scope.recordToEdit.id).toEqual(1);
          expect(scope.recordToEdit.country).toBeDefined();
        });

        it('should set inEditMode to true', function () {
          expect(scope.inEditMode).toEqual(true);
        });
      });

      describe('cancel edit', function () {
        it('should reset record to edit and inEditMode var', function () {
          scope.cancelEdit();
          scope.$digest();
          expect(scope.inEditMode).toEqual(false);
          expect(!!scope.recordToEdit).toEqual(false);
        });
      });

      describe('is selected to edit', function () {
        it('should return false if not in edit mode', function () {
          scope.inEditMode = false;
          var mockRecord = { id: 1 };
          expect(scope.isSelectedToEdit(mockRecord)).toEqual(false);
        });
        it('should return true for records matching record to edit', function () {
          scope.inEditMode = true;
          scope.recordToEdit = { id: 1 };
          var mockRecord = { id: 1 };
          expect(scope.isSelectedToEdit(mockRecord)).toEqual(true);
        });
      });

      describe('can edit', function () {
        it('should return true for active and future records', function () {
          var mockActiveRecord = { id: 1, startDate: '10/20/1990', endDate: '10/20/2030' };
          var mockFutureRecord = { id: 2, startDate: '10/20/2040', endDate: '10/30/2050' };
          var mockPastRecord = { id: 2, startDate: '10/20/1990', endDate: '10/30/1991' };
          expect(scope.canEdit(mockActiveRecord)).toEqual(true);
          expect(scope.canEdit(mockFutureRecord)).toEqual(true);
          expect(scope.canEdit(mockPastRecord)).toEqual(false);
        });
      });
    });

    describe('create helpers', function () {
      describe('clear create form', function () {
        beforeEach(function () {
          scope.newRecord = {
            alcoholic: false,
            country: {id: 1}
          };
        });
        it('should clear model with cleared country', function () {
          scope.clearCreateForm(true);
          scope.$digest();
          var mockCleanRecordWithNoCountry = {
            alcoholic: false,
            country: null
          };
          expect(scope.newRecord).toEqual(mockCleanRecordWithNoCountry);
        });

        it('should clear model with saved country', function () {
          scope.clearCreateForm(false);
          scope.$digest();
          var mockCleanRecordWithCountry = {
            alcoholic: false,
            country: {id: 1}
          };
          expect(scope.newRecord).toEqual(mockCleanRecordWithCountry);
        });
      });
    });

    describe('search helpers', function () {
      describe('clear search form', function () {
        it('should clear search and excise duty models', function () {
          scope.search = {fakeKey: 'fakeValue'};
          scope.exciseDutyList = [{id: 1}];
          scope.clearSearchForm();
          scope.$digest();
          expect(scope.search).toEqual(null);
          expect(scope.exciseDutyList).toEqual(null);
        });
      });
    });

    describe('delete helpers', function () {
      describe('can delete', function () {
        it('should return true for future records', function () {
          var mockActiveRecord = { id: 1, startDate: '10/20/1990', endDate: '10/20/2030' };
          var mockFutureRecord = { id: 2, startDate: '10/20/2040', endDate: '10/30/2050' };
          var mockPastRecord = { id: 2, startDate: '10/20/1990', endDate: '10/30/1991' };
          expect(scope.canDelete(mockActiveRecord)).toEqual(false);
          expect(scope.canDelete(mockFutureRecord)).toEqual(true);
          expect(scope.canDelete(mockPastRecord)).toEqual(false);
        });
      });
    });

    describe('toggle panel helpers', function () {

    });

    describe('show alert functions', function () {
    });


  });

});
