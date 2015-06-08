'use strict';

describe('Service: versionService', function () {

  beforeEach(module('ts5App'));

  var versionService,
    $httpBackend;
  beforeEach(inject(function (_versionService_, _$httpBackend_) {
    versionService = _versionService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!versionService).toBe(true);
  });

  describe('API calls', function () {
    var dataFromAPI;

    describe('getMenuList', function () {
      beforeEach(function () {
        $httpBackend.whenGET(/project/).respond({
          'PROJECT_VERSION': '0.2.10',
          'BUILD_NUMBER': '06'
        });
        versionService.getProjectInfo().then(function (_dataFromAPI_) {
          dataFromAPI = _dataFromAPI_;
        });
        $httpBackend.flush();
      });

      it('should include PROJECT_VERSION property', function () {
        expect(dataFromAPI.PROJECT_VERSION).toBe('0.2.10');
      });

      it('should have a BUILD_NUMBER property', function () {
        expect(dataFromAPI.BUILD_NUMBER).toBe('06');
      });

    });

  });

});
