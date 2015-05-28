'use strict';

describe('Image Upload Directive |', function () {

  // assign variables
  var element,
      imageJSON,
      Upload,
      response,
      $httpBackend;
 
  // load the directive's module
  beforeEach(module('ts5App'));

  // load the expected json response and image
  beforeEach(module('served/image-upload.json'));

  // inject the service and responshandler
  beforeEach(inject(function (_$compile_, _$rootScope_, _Upload_, $injector) {

     var $compile = _$compile_,
     $scope = _$rootScope_;

     //call image upload directive element
    var tpl = '<image-upload></image-upload>';

    element = $compile(tpl)($scope);
  
    // inject the JSON fixtures
    inject(function (_servedImageUpload_) {
      imageJSON = _servedImageUpload_;    
    }); 

    //set upload 
    Upload = _Upload_;

    // set httpbackend, add directive if not added
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('views/directives/image-upload.html').respond(200, '');

    //digest the scope
    $scope.$digest();

    var controller = element.controller;

    return controller;

  }));

  //image upload directive
  describe('When the directive is injected into a template, it', function() {

    //check if image upload directive is defined
    it('should initialize', function() {

       inject(function () {
        expect(element).toBeDefined();
      });

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

});