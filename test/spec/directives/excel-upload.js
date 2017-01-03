'use strict';

describe('Excel Upload Directive |', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var scope,
    compile,
    isolatedScope,
    $httpBackend,
    controller,
    element;

  beforeEach(inject(function ($rootScope, $injector, $compile) {
    compile = $compile;
    scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('views/directives/excel-upload.menu.html').respond(200, '');
    $httpBackend.whenGET('views/directives/excel-upload.postTrip.html').respond(200, '');
    $httpBackend.whenGET('views/directives/excel-upload.stockTake.html').respond(200, '');
  }));

  function setupDirectiveElement(directiveType) {
    element = angular.element('<excel-upload type="' + directiveType + '"></excel-upload>');
    element = compile(element)(scope);
    scope.$digest();
    isolatedScope = element.isolateScope();
    controller = element.controller;
  }

  describe('downloadUrl', function () {

    it('should generate static downloadUrl for valid type: menu', function () {
      setupDirectiveElement('menu');
      expect(isolatedScope.type).toEqual('menu');
      expect(isolatedScope.templateName).toEqual('menuUpload');
      expect(isolatedScope.downloadTemplateUrl).toEqual('https://s3.amazonaws.com/ts5-dev-portal-images/templates/menuUpload.xlsx');
    });

    it('should generate static downloadUrl for valid type: postTrip', function () {
      setupDirectiveElement('postTrip');
      expect(isolatedScope.type).toEqual('postTrip');
      expect(isolatedScope.templateName).toEqual('FileUpload-PostTripManagement');
      expect(isolatedScope.downloadTemplateUrl).toEqual('https://s3.amazonaws.com/ts5-dev-portal-images/templates/FileUpload-PostTripManagement.xlsx');
    });

    it('should generate dynamic downloadUrl for valid type: stockTake', function () {
      setupDirectiveElement('stockTake');
      expect(isolatedScope.type).toEqual('stockTake');
      expect(isolatedScope.templateName).toBeUndefined();
      expect(isolatedScope.downloadTemplateUrl).toEqual('https://ts5-dev.egatesoln.com/rsvr-pdf/api/stock-management/dashboard/file/template');
    });
  });

});
