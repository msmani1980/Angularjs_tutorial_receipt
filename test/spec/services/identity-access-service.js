'use strict';

describe('Service: identityAccessService', function() {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var identityAccessService;
  var httpBackend;
  beforeEach(inject(function(_identityAccessService_, $httpBackend) {
    identityAccessService = _identityAccessService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('authorizeUser', function() {
    it('should make POST request to API', function() {
      var expectedURL = /IdentityAccess\/authorizeUser$/;
      httpBackend.expectPOST(expectedURL).respond(201, {});
      identityAccessService.authorizeUser().then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('changePassword', function() {
    it('should make POST request to API', function() {
      var expectedURL = /IdentityAccess\/chpwd$/;
      httpBackend.expectPOST(expectedURL).respond(201, {});
      identityAccessService.changePassword().then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('sendEmail', function() {
    it('should make POST request with lowercase parameters to API for recovering password', function() {
      var expectedURL = /IdentityAccess\/recoverpassword\/fakeEmail\/fakeUser$/;
      httpBackend.expectPOST(expectedURL).respond(201, {});
      identityAccessService.sendEmail(false, 'fakeContent', 'fakeEmail', 'fakeUser').then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });

    it('should make POST request with just email to API for recovering username', function() {
      var expectedURL = /IdentityAccess\/recoveruser\/fakeEmail\/send$/;
      httpBackend.expectPOST(expectedURL).respond(201, {});
      identityAccessService.sendEmail(true, 'fakeContent', 'fakeEmail', 'badUser').then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('checkAuth', function() {
    it('should make GET request to API', function() {
      var expectedURL = /IdentityAccess\/authorizeUser$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      identityAccessService.checkAuth().then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('featuresInRole', function() {
    it('should make GET request to API', function() {
      var expectedURL = /IdentityAccess\/featuresInRole$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      identityAccessService.featuresInRole().then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('userAgreesToEULA', function() {
    it('should make PUT request to API', function() {
      var expectedURL = /IdentityAccess\/eula\//;
      httpBackend.expectPUT(expectedURL).respond(200, {});
      identityAccessService.userAgreesToEULA().then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('userCompanies', function() {
    it('should make GET request to API', function() {
      var expectedURL = /IdentityAccess\/company\/alluserscompanies/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      identityAccessService.getUserCompanies().then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('logout', function() {
    it('should make PUT request to API', function() {
      var expectedURL = /IdentityAccess\/logout/;
      httpBackend.expectPUT(expectedURL).respond(202, {});
      identityAccessService.logout().then(function(response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

});
