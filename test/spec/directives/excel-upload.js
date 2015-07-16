'use strict';

describe('Excel Upload Directive |', function () {

  var element,
    scope,
    controller,
  //imageJSON,
    Upload,
    response;

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/excel-upload.json'));
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  beforeEach(inject(function (_Upload_) {
    //inject(function (_servedImageUpload_) {
    //  imageJSON = _servedImageUpload_;
    //});

    Upload = _Upload_;
    scope.$digest();
  }));

  describe('When the image upload directive is compiled, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<excel-upload></excel-upload>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should inject the directive', function () {
      expect(element).toBeDefined();
    });
  });

  describe('When a user clicks on the image upload, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<excel-upload></excel-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('imageUpload');
      element = element.find('.drop-box');
      spyOn(element, 'click');
    }));

    it('should have the click event defined', function () {
      angular.element(element[0]).trigger('click');
      expect(element.click).toBeDefined();
    });

  });

  describe('When the upload function is called, it', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element('<excel-upload></excel-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('excelUpload');

      spyOn(Upload, 'upload').and.callFake(function () {
        return {id: 1};//imageJSON;
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
      element = angular.element('<excel-upload></excel-upload>');
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
      element = angular.element('<excel-upload></excel-upload>');
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
      element = angular.element('<excel-upload></excel-upload>');
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
      element = angular.element('<excel-upload></excel-upload>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('imageUpload');

      spyOn(scope, 'doesImageMeetSizeConstraint').and.callThrough();

      scope.files = [
        {
          'lastModified': 1436974190000,
          'lastModifiedDate': 'Wed Jul 15 2015 10:29:50 GMT-0500 (CDT)',
          'name': 'menu.xls',
          'size': 28672,
          'type': 'webkitRelativePath: ""'
        }
      ];
    }));

    it('should have uploadFail to be false', function () {
      expect(scope.uploadFail).toBeFalsy();
    });

  });

});
