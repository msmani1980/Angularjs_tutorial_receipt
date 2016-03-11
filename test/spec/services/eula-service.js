'use strict';

describe('Service: eulaService', function() {

  beforeEach(module('ts5App', 'served/eula-list.json'));

  var eulaService;
  var eulaJSON;
  var $httpBackend;

  beforeEach(inject(function(_eulaService_, $injector) {
    eulaService = _eulaService_;
    inject(function(_servedEulaList_) {
      eulaJSON = _servedEulaList_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/eula/).respond(eulaJSON);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getEULAList', function() {
    var fakeReponseData;
    beforeEach(function() {
      eulaService.getEULAList().then(function(dataFromAPI) {
        fakeReponseData = dataFromAPI;
      });

      $httpBackend.flush();
    });

    it('should be an Object', function() {
      expect(angular.isObject(fakeReponseData)).toBe(true);
    });

    it('should have a response', function() {
      expect(fakeReponseData.response).toBeDefined();
    });

  });

  describe('getEULA', function() {
    var fakeReponseData;
    beforeEach(function() {
      eulaService.getEULA().then(function(dataFromAPI) {
        fakeReponseData = dataFromAPI.response[0];
      });

      $httpBackend.flush();
    });

    it('should be an Object', function() {
      expect(angular.isObject(fakeReponseData)).toBe(true);
    });

    it('should have a eula field', function() {
      expect(fakeReponseData.eula).toBeDefined();
    });

  });

});
