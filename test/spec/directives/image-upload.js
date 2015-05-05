'use strict';

describe('Image Upload Directive |', function () {

  var scope,
      imageJSON,
      Upload,
      response,
      $httpBackend;
 
  // load the directive's module
  beforeEach(module('ts5App'));

  // load the expected json response and image
  beforeEach(module('served/image-upload.json'));

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  // Inject the service and responshandler
  beforeEach(inject(function (_Upload_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedImageUpload_) {
      imageJSON = _servedImageUpload_;    
    }); 

    Upload = _Upload_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  /*describe('image upload template', function() {

    beforeEach(inject(function ($compile) {
      var element = ('<image-upload></image-upload>');
      element = $compile(element)(scope);
      console.log(element);
      scope.$digest();
    }));

    it('should contain an element with the class drop-box', function() {
      console.log(element.find('.drop-box'));
        expect(element.find('.drop-box')).toBeDefined();
    });

  });
  */
  describe('the image uploader', function() {

    beforeEach(inject(function () {
      
      spyOn(Upload, 'upload').and.callFake(function() {
        return imageJSON;
      });

      // make the mock query call
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

  });

});
