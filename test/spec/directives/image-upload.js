'use strict';

describe('Image Upload Directive |', function () {

  // assign variables
  var element,
    scope,
    controller,
    imageJSON,
    Upload,
    response,
    $httpBackend;
 
  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  // load the expected json response and image
  beforeEach(module('served/image-upload.json'));

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  // inject dependancies for Upload
  beforeEach(inject(function (_Upload_, $injector) {

    // inject the JSON fixtures
    inject(function (_servedImageUpload_) {
      imageJSON = _servedImageUpload_;    
    }); 

    //set upload 
    Upload = _Upload_;

    // set httpbackend, add directive if not added
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('/views/directives/image-upload.html').respond(200, '');

    //digest the scope
    scope.$digest();

  }));

  describe('When directive is compiled, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller;
    }));

    it('should inject the directive', function () {
      expect(element).toBeDefined();
    });

    it('should initialize ng-file-upload', function() {
      expect(element.find('.drop-box')).toBeDefined();
    });

    it('should contain a upload button', function() {
      expect(element.find('.btn-success')).toBeDefined();
    });

    it('should contain a clear button', function() {
      expect(element.find('.btn-default')).toBeDefined();
    });

    it('should contain thumbnails', function() {
      expect(element.find('.thumbnails')).toBeDefined();
    });

    it('should contain a ng-model of files', function() {
      expect(element.find('.drop-box').attr('ng-model')).toContain('files');
    }); 

  });

  describe('When a user clicks on the image upload, it', function() {

    //before each, call the compile function
    beforeEach(inject(function () {
        spyOn(element, 'click');
    }));

    //check if image upload directive is defined
    it('should trigger a file upload dialog', function() {
        expect(element.click).toBeDefined();
    });
    
  });
  
  //image upload logic 
  describe('When the upload function is called, it', function() {

    beforeEach(inject(function () {
       
      // spy on the Upload.upload return expected JSON
      spyOn(Upload, 'upload').and.callFake(function() {
        return imageJSON;
      });

      // make the mock upload call
      response = Upload.upload();
      
    }));

    it('should be defined', function(){
      expect(Upload).toBeDefined();
    });

    it('should be able to call the upload function', function(){
      expect(Upload.upload).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should have an url defined in the response', function (){
      expect(response.url).toBeDefined();
    });

    it('should return a url that is not null', function(){
      expect(response.url.length).toBeGreaterThan(2);
    });

    it('should return a url that contains https://', function(){
      expect(response.url).toContain('https://');
    });

    it('should return a url that contains s3', function(){
      expect(response.url).toContain('s3');
    });

  });

  describe('When the controllers is accessed, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller;

      //set a file and upload responses for clearFiles()
      scope.files = ['files'];
      scope.uploadProgress = 100;
      scope.uploadSuccess =  true;
      scope.uploadFail = true;

    }));

    it('should contain a files object', function() {  
      expect(scope.files).toContain('files');
    });

    it('should have an uploadProgress', function() {  
      expect(scope.uploadProgress).toBe(100);
    });

    it('should have uploadSuccess', function() {  
      expect(scope.uploadSuccess).toBeTruthy();
    });

    it('should have uploadFail', function() {  
      expect(scope.uploadFail).toBeTruthy();
    });

    it('should clear the files after clearFiles is called', function() {
      scope.clearFiles();
      expect(scope.files.length).toBe(0);
    });

    it('should clear uploadProgress after clearFiles is called', function() {
      scope.clearFiles();
      expect(scope.uploadProgress).toBe(0);
    });

    it('should clear uploadSuccess after clearFiles is called', function() {
      scope.clearFiles();
      expect(scope.uploadSuccess).toBeFalsy();
    });

    it('should clear uploadFail after clearFiles is called', function() {
      scope.clearFiles();
      expect(scope.uploadFail).toBeFalsy();
    });

  });


});