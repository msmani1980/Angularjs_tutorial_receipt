'use strict';

describe('Image Upload Directive |', function () {

  var element,
    scope,
    controller,
    imageJSON,
    Upload,
    response;

  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  beforeEach(module('served/image-upload.json'));

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  beforeEach(inject(function (_Upload_) {

    inject(function (_servedImageUpload_) {
      imageJSON = _servedImageUpload_;
    });

    Upload = _Upload_;
    scope.$digest();

  }));

  describe('When the image upload directive is compiled, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should inject the directive', function () {
      expect(element).toBeDefined();
    });

    it('should initialize ng-file-upload', function () {
      expect(element.find('.drop-box')).toBeDefined();
    });

    it('should contain a upload button', function () {
      expect(element.find('.btn-success')).toBeDefined();
    });

    it('should contain a clear button', function () {
      expect(element.find('.btn-default')).toBeDefined();
    });

    it('should contain thumbnails element', function () {
      expect(element.find('.thumbnails')).toBeDefined();
    });

    it('should contain a ng-model of files', function () {
      expect(element.find('.drop-box').attr('ng-model')).toContain(
        'files');
    });

  });

  describe('When a user clicks on the image upload, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('imageUpload');
      element = element.find('.drop-box');
      spyOn(element, 'click');
    }));

    it('should have the click event defined', function () {
      expect(element.click).toBeDefined();
    });

  });

  describe('When the upload function is called, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('imageUpload');

      spyOn(Upload, 'upload').and.callFake(function () {
        return imageJSON;
      });

      response = Upload.upload();

    }));

    it('should be defined', function () {
      expect(Upload).toBeDefined();
    });

    it('should be able to call the upload function', function () {
      expect(Upload.upload).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should have an url defined in the response', function () {
      expect(response.url).toBeDefined();
    });

    it('should return a url that is not null', function () {
      expect(response.url.length).toBeGreaterThan(2);
    });

    it('should return a url that contains https://', function () {
      expect(response.url).toContain('https://');
    });

    it('should return a url that contains s3', function () {
      expect(response.url).toContain('s3');
    });

  });

  describe('When the clearAllFiles function is called, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('imageUpload');

      scope.files = [

        {
          $$hashKey: 'object:277',
          lastModified: 1430772953000,
          lastModifiedDate: 'Mon May 04 2015 16:55:53 GMT-0400 (EDT)',
          name: 'item-c8b71477-c9eb-4f7c-ac20-a29f91bb4636.png',
          size: 7801,
          type: 'image/png',
          webkitRelativePath: '',
          uploadProgress: 100,
          uploadSuccess: true,
          uploadFail: false
        }

      ];

    }));

    it('should contain an empty files object', function () {
      expect(scope.files).toBeDefined();
      expect(scope.files.length).toBe(1);
    });

    it('should have an uploadProgress varible', function () {
      expect(scope.files[0].uploadProgress).toBeDefined();
    });

    it('should have uploadSuccess', function () {
      expect(scope.files[0].uploadSuccess).toBeTruthy();
    });

    it('should have uploadFail', function () {
      expect(scope.files[0].uploadFail).toBeFalsy();
    });

    it('should clear the files after clearFiles is called', function () {
      scope.clearAllFiles();
      expect(scope.files.length).toBe(0);
    });

  });

  describe('When a file is uploaded, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('imageUpload');

      spyOn(scope, 'upload').and.callFake(function () {

        scope.uploadSuccess = true;

        var newImage = {
          imageURL: imageJSON.url,
          startDate: scope.formData.startDate,
          endDate: scope.formData.endDate
        };

        scope.formData.images.push(newImage);

      });

      scope.files = [

        {
          $$hashKey: 'object:278',
          lastModified: 1430772953000,
          lastModifiedDate: 'Mon May 04 2015 16:55:53 GMT-0400 (EDT)',
          name: 'item-c8b71477-c9eb-4f7c-ac20-a29f91bb4637.png',
          size: 7802,
          type: 'image/png',
          webkitRelativePath: ''
        }

      ];

      scope.formData = {
        images: []
      };

      scope.upload();

    }));

    it('should be able to upload an image', function () {
      expect(scope.formData.images.length).toBe(1);
    });

    it('should have a file staged', function () {
      expect(scope.files.length).toBe(1);
    });

    it('should have called the upload function', function () {
      expect(scope.upload).toHaveBeenCalled();
    });

    it('should upload successfully', function () {
      expect(scope.uploadSuccess).toBeTruthy();
    });

  });

  describe('When multiple files are uploaded, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('imageUpload');

      spyOn(scope, 'upload').and.callFake(function () {

        scope.uploadSuccess = true;

        for (var i = 0; i < scope.files.length; i++) {

          var newImage = {
            imageURL: imageJSON.url,
            startDate: scope.formData.startDate,
            endDate: scope.formData.endDate
          };

          scope.formData.images.push(newImage);

        }

      });

      scope.files = [

        {
          $$hashKey: 'object:277',
          lastModified: 1430772953000,
          lastModifiedDate: 'Mon May 04 2015 16:55:53 GMT-0400 (EDT)',
          name: 'item-c8b71477-c9eb-4f7c-ac20-a29f91bb4636.png',
          size: 7801,
          type: 'image/png',
          webkitRelativePath: ''
        }, {
          $$hashKey: 'object:278',
          lastModified: 1430772953000,
          lastModifiedDate: 'Mon May 04 2015 16:55:53 GMT-0400 (EDT)',
          name: 'item-c8b71477-c9eb-4f7c-ac20-a29f91bb4637.png',
          size: 7802,
          type: 'image/png',
          webkitRelativePath: ''
        }

      ];

      scope.formData = {
        images: []
      };

      scope.upload();

    }));

    it('should be able to upload multiple images', function () {
      expect(scope.formData.images.length).toBe(2);
    });

    it('should have files staged', function () {
      expect(scope.files.length).toBe(2);
    });

    it('should have called the upload function', function () {
      expect(scope.upload).toHaveBeenCalled();
    });

    it('should upload successfully', function () {
      expect(scope.uploadSuccess).toBeTruthy();
    });

  });

  describe('When files are uploaded, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<image-upload></image-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('imageUpload');

      spyOn(scope, 'doesImageMeetSizeConstraint').and.callThrough();

      scope.files = [

        {
          $$hashKey: 'object:277',
          lastModified: 1430772953000,
          lastModifiedDate: 'Mon May 04 2015 16:55:53 GMT-0400 (EDT)',
          name: 'item-c8b71477-c9eb-4f7c-ac20-a29f91bb4636.png',
          size: 7801,
          type: 'image/png',
          webkitRelativePath: ''
        }, {
          $$hashKey: 'object:278',
          lastModified: 1430772953000,
          lastModifiedDate: 'Mon May 04 2015 16:55:53 GMT-0400 (EDT)',
          name: 'item-c8b71477-c9eb-4f7c-ac20-a29f91bb4637.png',
          size: 7802,
          type: 'image/png',
          webkitRelativePath: ''
        }

      ];

    }));

    it('should be able to call size constraint test', function () {
      scope.doesImageMeetSizeConstraint();
      expect(scope.doesImageMeetSizeConstraint).toHaveBeenCalled();
    });

    it('should expect image 128x128 to return true', function () {
      var imgElement = angular.element(
        '<img class="fileTest" style="width:128px; height:128px;" ng-src="http://placehold.it/128x128"/>'
      );
      imgElement = angular.element(imgElement[0]);
      expect(scope.doesImageMeetSizeConstraint(0, imgElement)).toBeTruthy();
    });

    it('should expect image 128x128 to return false', function () {
      var imgElement = angular.element(
        '<img class="fileTest" style="width:129px; height:129px;" ng-src="http://placehold.it/129x129"/>'
      );
      imgElement = angular.element(imgElement[0]);
      expect(scope.doesImageMeetSizeConstraint(0, imgElement)).toBeFalsy();
    });

    it('should have imgElement defined', function () {
      scope.imgElement = angular.element('.fileTest');
      expect(scope.imgElement).toBeDefined();
    });

    it('should have imgHeight defined', function () {
      scope.doesImageMeetSizeConstraint();
      expect(scope.imgHeight).toBeDefined();
    });

    it('should have imgWidth defined', function () {
      scope.doesImageMeetSizeConstraint();
      expect(scope.imgWidth).toBeDefined();
    });

    it('should have uploadFail to be false', function () {
      expect(scope.uploadFail).toBeFalsy();
    });

  });

});
