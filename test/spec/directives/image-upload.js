'use strict';

describe('Image Upload Directive |', function () {

  // assign variables
  var element,
      scope,
      imageJSON,
      Upload,
      response,
      $httpBackend;
 
  // load the directive's module
  beforeEach(module('ts5App'));

  // load the expected json response and image
  beforeEach(module('served/image-upload.json'));

  // set scope as $rootScope
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  // inject the service and responshandler
  beforeEach(inject(function (_Upload_, $injector) {

    // inject the JSON fixtures
    inject(function (_servedImageUpload_) {
      imageJSON = _servedImageUpload_;    
    }); 

    //set upload 
    Upload = _Upload_;

    // set httpbackend, add directive if not added
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('views/directives/image-upload.html').respond(200, '');

  }));

  //Compile the directive inside it's own function
  function compileDirective(tpl) {

    //call image upload directive element
    tpl = '<image-upload></image-upload>';

    //inject the directive, compile
    inject(function($compile){
        var form = $compile(tpl)(scope);
        element = form;
    });

    //digest the scope
    scope.$digest();
 
  }

  //image upload directive
  describe('image upload', function() {

    //before each, call the compile function
    beforeEach(function () {
        compileDirective();
    });

    //check if image upload directive is defined
    it('should initialize', function() {
        expect(element[0]).toBeDefined();
    });
    
  });
  
  //image upload logic 
  describe('the image uploader', function() {

    beforeEach(inject(function () {
       
      // spy on the Upload.upload return expected JSON
      spyOn(Upload, 'upload').and.callFake(function() {
        return imageJSON;
      });

      // make the mock upload call
      response = Upload.upload();
      
    }));

    // check to see if Upload method is defined
    it('should be defined', function(){
      expect(Upload).toBeDefined();
    });

    // check if call is successful
    it('should be able to call the upload function', function(){
      expect(Upload.upload).toHaveBeenCalled();
    });

    // check for a response
    it('should get a response', function () {
      expect(response).toBeDefined();
    });

  });

});