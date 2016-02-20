'use strict';

fdescribe('Controller: ExciseDutyRelationshipListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/item-excise-duty-list.json'));
  beforeEach(module('served/excise-duty-list.json'));
  beforeEach(module('served/master-item-list.json'));
  beforeEach(module('served/item-types.json'));

  var ExciseDutyRelationshipListCtrl;
  var ExciseDutyRelationshipFactory;
  var itemExciseDutyListResponseJSON;
  var itemExciseDutyListDeferred;
  var itemExciseDutyDeferred;
  var exciseDutyResponseJSON;
  var exciseDutyDeferred;
  var masterItemListResponseJSON;
  var masterItemListDeferred;
  var itemTypeResponseJSON;
  var itemTypesDeferred;
  var dateUtility;
  var scope;


  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {

    inject(function (_servedItemExciseDutyList_, _servedExciseDutyList_, _servedMasterItemList_, _servedItemTypes_) {
      itemExciseDutyListResponseJSON = _servedItemExciseDutyList_;
      exciseDutyResponseJSON = _servedExciseDutyList_;
      masterItemListResponseJSON = _servedMasterItemList_;
      itemTypeResponseJSON = _servedItemTypes_;
    });

    ExciseDutyRelationshipFactory = $injector.get('exciseDutyRelationshipFactory');
    dateUtility = $injector.get('dateUtility');
    scope = $rootScope.$new();

    itemExciseDutyListDeferred = $q.defer();
    itemExciseDutyListDeferred.resolve(itemExciseDutyListResponseJSON);
    itemExciseDutyDeferred = $q.defer();
    itemExciseDutyDeferred.resolve(itemExciseDutyListResponseJSON.response[0]);
    exciseDutyDeferred = $q.defer();
    exciseDutyDeferred.resolve(exciseDutyResponseJSON);
    masterItemListDeferred = $q.defer();
    masterItemListDeferred.resolve(masterItemListResponseJSON);
    itemTypesDeferred = $q.defer();
    itemTypesDeferred.resolve(itemTypeResponseJSON);

    spyOn(ExciseDutyRelationshipFactory, 'getRelationshipList').and.returnValue(itemExciseDutyListDeferred.promise);
    spyOn(ExciseDutyRelationshipFactory, 'createRelationship').and.returnValue(itemExciseDutyDeferred.promise);
    spyOn(ExciseDutyRelationshipFactory, 'updateRelationship').and.returnValue(itemExciseDutyDeferred.promise);
    spyOn(ExciseDutyRelationshipFactory, 'deleteRelationship').and.returnValue(itemExciseDutyDeferred.promise);
    spyOn(ExciseDutyRelationshipFactory, 'getExciseDutyList').and.returnValue(exciseDutyDeferred.promise);
    spyOn(ExciseDutyRelationshipFactory, 'getItemTypes').and.returnValue(itemTypesDeferred.promise);
    spyOn(ExciseDutyRelationshipFactory, 'getMasterItemList').and.returnValue(masterItemListDeferred.promise);


    ExciseDutyRelationshipListCtrl = $controller('ExciseDutyRelationshipListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('initialize data', function () {
    it('should get list of masterItems and attach to scope', function () {
      scope.$digest();
      expect(ExciseDutyRelationshipFactory.getMasterItemList).toHaveBeenCalled();
      expect(scope.itemList).toBeDefined();
    });

    it('should get list of item types and attach to scope', function () {
      expect(ExciseDutyRelationshipFactory.getItemTypes).toHaveBeenCalled();
      expect(scope.itemTypes).toBeDefined();
    });

    it('should get list of excise duty records and attach to scope', function () {
      expect(ExciseDutyRelationshipFactory.getExciseDutyList).toHaveBeenCalled();
      expect(scope.exciseDutyList).toBeDefined();
    });
  });

  describe('get itemExciseDutyList', function () {
    beforeEach(function () {
      scope.inCreateMode = false;
      scope.getItemExciseDutyList();
      scope.$digest();
    });
    it('should get data from API and attach to scope', function () {
      expect(ExciseDutyRelationshipFactory.getRelationshipList).toHaveBeenCalled();
      expect(scope.itemExciseDutyList).toBeDefined();
    });

    it('should format start and end date', function () {
      expect(dateUtility.isDateValidForApp(scope.itemExciseDutyList[0].startDate)).toEqual(true);
      expect(dateUtility.isDateValidForApp(scope.itemExciseDutyList[0].endDate)).toEqual(true);
    });

    it('should resolve itemTypeName', function () {
      expect(scope.itemExciseDutyList[0].itemTypeName).toBeDefined();
      expect(scope.itemExciseDutyList[0].itemTypeName).toEqual('Virtual');
    });

    it('should format alcoholVolume to float with 2 decimals', function () {
      expect(scope.itemExciseDutyList[0].alcoholVolume).toEqual('123.00');
    });
  });

  describe('search exciseDutyList', function () {

    it('should get data from API with search payload', function () {
      scope.search = {
        startDate: '10/20/2015',
        endDate: '10/21/2015'
      };
      scope.searchItemExciseData();
      var expectedPayload = jasmine.objectContaining({
        startDate: '20151020',
        endDate: '20151021',
      });
      expect(ExciseDutyRelationshipFactory.getRelationshipList).toHaveBeenCalledWith(expectedPayload);
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
      expect(ExciseDutyRelationshipFactory.deleteRelationship).toHaveBeenCalledWith(mockRecord.id);
    });

    it('should should call GET API with old search parameters if record is not newly crated', function () {
      var mockRecord = { id: 1 };
      var expectedSearchPayload = jasmine.objectContaining({
        startDate: '20151020'
      });
      scope.inCreateMode = false;
      scope.removeRecord(mockRecord);
      scope.$digest();
      expect(ExciseDutyRelationshipFactory.getRelationshipList).toHaveBeenCalledWith(expectedSearchPayload);
    });

    it('should perform a local delete if record is newly created', function () {
      var mockRecord = { id: 1 };
      scope.itemExciseDutyList = [{ id: 1 }, { id: 2 }];
      scope.inCreateMode = true;
      scope.removeRecord(mockRecord);
      scope.$digest();
      expect(scope.itemExciseDutyList.length).toEqual(1);
    });
  });

  describe('create excise duty record', function () {
    beforeEach(function () {
      scope.newRecord = {
        startDate: '10/20/2015',
        endDate: '10/21/2015',
        commodityCode: { id: 1 },
        retailItem: { id: 2 },
        alcoholVolume: '123.45',
        itemType: 1
      };
      scope.search = {
        commodityCode: 'oldCommodityCode'
      };
      scope.itemExciseDutyCreateForm = {
        $valid: true,
        retailItem: {
          $valid: true,
          $setValidity: function () {
            return true;
          }
        },
        commodityCode: {
          $valid: true,
          $setValidity: function () {
            return true;
          }
        },
        endDate: {
          $setUntouched: function () {
            return true;
          }
        },
        startDate: {
          $setUntouched: function () {
            return true;
          }
        }
      };

      scope.itemExciseDutyList = [];
      scope.createRelationship();
      scope.$digest();
    });
    it('should call POST API with formatted payload', function () {
      var expectedPayload = {
        startDate: '20151020',
        endDate: '20151021',
        exciseDutyId: 1,
        itemMasterId: 2,
        alcoholVolume: 123.45,
        itemTypeId: 1
      };
      expect(ExciseDutyRelationshipFactory.createRelationship).toHaveBeenCalledWith(expectedPayload);
    });
    it('should add new record to current model', function () {
      expect(scope.itemExciseDutyList.length).toEqual(1);
    });
  });

  describe('edit excise duty record', function () {
    beforeEach(function () {
      scope.inEditMode = true;
      scope.recordToEdit = {
        id: 1,
        commodityCode: { id: 1 },
        alcoholVolume: '123.45',
        startDate: '10/20/2015',
        endDate: '10/21/2015',
        retailItem: { id: 2 },
        itemType: 1
      };

      scope.itemExciseDutyList = [{
        id: 1,
        startDate: '10/15/2015',
        endDate: '10/20/2015',
        itemMasterId: 3,
        exciseDutyId: 4
      }];

      scope.search = {
        startDate: '10/20/2015'
      };
    });

    it('should call PUT API with formatted payload', function () {
      var expectedPayload = {
        startDate: '20151020',
        endDate: '20151021',
        exciseDutyId: 1,
        alcoholVolume: 123.45,
        itemTypeId: 1,
        itemMasterId: 2
      };
      scope.saveEdit();
      scope.$digest();
      expect(ExciseDutyRelationshipFactory.updateRelationship).toHaveBeenCalledWith(1, expectedPayload);
    });

    it('should format payload with old record if startDate and/or endDate is not populated', function () {
      scope.recordToEdit.startDate = '';
      scope.recordToEdit.endDate = '';
      scope.recordToEdit.retailItem = null;
      scope.recordToEdit.commodityCode = null;

      var expectedPayload = {
        startDate: '20151015',
        endDate: '20151020',
        exciseDutyId: 4,
        alcoholVolume: 123.45,
        itemTypeId: 1,
        itemMasterId: 3
      };
      scope.saveEdit();
      scope.$digest();
      expect(ExciseDutyRelationshipFactory.updateRelationship).toHaveBeenCalledWith(1, expectedPayload);
    });

    it('should call GET API with old search parameters if record is not newly created', function () {
      scope.inCreateMode = false;
      scope.saveEdit();
      scope.$digest();
      var expectedSearchPayload = jasmine.objectContaining({
        startDate: '20151020'
      });
      expect(ExciseDutyRelationshipFactory.getRelationshipList).toHaveBeenCalledWith(expectedSearchPayload);
    });

    it('should apply changes directly to model if record is newly created', function () {
      scope.inCreateMode = true;
      scope.saveEdit();
      scope.$digest();
      expect(scope.itemExciseDutyList[0].startDate).toEqual('10/15/2015');
      expect(scope.itemExciseDutyList[0].endDate).toEqual('10/20/2015');
    });
  });

  describe('scope helper functions', function () {
    describe('edit helpers', function () {
      describe('select to edit', function () {
        beforeEach(function () {
          var mockRecord = {
            id: 1,
            itemMasterId: 1,
            commodityCode: 'API TEST 2'
          };
          scope.selectToEdit(mockRecord);
          scope.$digest();
        });
        it('should copy record to recordToEdit with full retail item object', function () {
          expect(scope.recordToEdit.id).toEqual(1);
          expect(scope.recordToEdit.retailItem).toBeDefined();
        });

        it('should copy record to recordToEdit with full excise duty object', function () {
          expect(scope.recordToEdit.commodityCode).toBeDefined();
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
            itemType: '1'
          };

          scope.itemExciseDutyCreateForm = {
            $valid: true,
            endDate: {
              $setUntouched: function () {
                return true;
              }
            },
            startDate: {
              $setUntouched: function () {
                return true;
              }
            }
          };
        });
        it('should clear model with cleared itemType', function () {
          scope.clearCreateForm(true);
          scope.$digest();
          var mockCleanRecordWithNoItemType = {
            itemType: null
          };
          expect(scope.newRecord).toEqual(mockCleanRecordWithNoItemType);
        });

        it('should clear model with saved countritem typey', function () {
          scope.clearCreateForm(false);
          scope.$digest();
          var mockRecordWithItemType = {
            itemType: '1'
          };
          expect(scope.newRecord).toEqual(mockRecordWithItemType);
        });
      });
    });

    describe('search helpers', function () {
      describe('clear search form', function () {
        it('should clear search and excise duty models', function () {
          scope.search = { fakeKey: 'fakeValue' };
          scope.exciseDutyList = [{ id: 1 }];
          scope.clearSearchForm();
          scope.$digest();
          expect(scope.search).toEqual({});
          expect(scope.itemExciseDutyList).toEqual(null);
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
  });

  describe('form watchers', function () {
    beforeEach(function () {
      scope.inCreateMode = true;
      scope.newRecord = {
        itemType: 1,
        startDate: '10/20/2015',
        endDate: '10/30/2015',
        retailItem: { id: 1 },
        commodityCode: { id: 2 }
      };
      scope.$digest();
    });

    it('should update retail item list and excise duty list on create form when dates change', function () {
      scope.$apply('newRecord.startDate="10/25/2015"');
      var expectedPayload = jasmine.objectContaining({startDate:'20151025'});
      expect(ExciseDutyRelationshipFactory.getMasterItemList).toHaveBeenCalledWith(expectedPayload);
      expect(ExciseDutyRelationshipFactory.getExciseDutyList).toHaveBeenCalledWith(expectedPayload);
    });

    it('should clear selected retail item and commodity code on create form when dates change', function () {
      scope.$apply('newRecord.startDate="10/25/2015"');
      expect(scope.newRecord.retailItem).toEqual(null);
      expect(scope.newRecord.commodityCode).toEqual(null);
    });

    it('should update retail item list when item type changes on create form', function () {
      scope.$apply('newRecord.itemType=2');
      var expectedPayload = jasmine.objectContaining({itemTypeId: 2});
      expect(ExciseDutyRelationshipFactory.getMasterItemList).toHaveBeenCalledWith(expectedPayload);
    });

  });

});
