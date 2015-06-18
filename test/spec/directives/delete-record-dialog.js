'use strict';

describe('Directive: deleteRecordDialog', function () {

  // load the directive's module and template module
  beforeEach(module('ts5App', 'template-module'));

  var scope,
    element,
    controller;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  describe('element', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<delete-record-dialog></delete-record-dialog>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have a modal element', function () {
      expect(element.find('.modal')[0]).toBeDefined();
    });

    it('should have a modal-body ', function () {
      expect(element.find('.modal-body')[0]).toBeDefined();
    });

    it('should tell the user the item was saved', function () {
      expect(element.find('.modal-body h2').text()).toEqual(
        ' Are you sure you want to delete this record?');
    });

    it('should contain an icon', function () {
      expect(element.find('.modal-body h2 span').hasClass(
        'fa-exclamation-triangle')).toBeTruthy();
    });

    it('should have a modal-footer', function () {
      expect(element.find('.modal-footer')[0]).toBeDefined();
    });

    it('should have two buttons in the footer', function () {
      expect(element.find('.modal-footer .btn').length).toEqual(2);
    });

    it('should have a button to cancel', function () {
      expect(element.find('.modal-footer .btn-cancel').length).toEqual(
        1);
    });

    it('should have a button to remove the item', function () {
      expect(element.find('.modal-footer .btn-remove').length).toEqual(
        1);
    });

  });

  describe('controller', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<delete-record-dialog></delete-record-dialog>');
      element = $compile(element)(scope);
      scope.$digest();
      controller = element.controller('deleteRecordDialog');
    }));

    it('should have a deleteRecordDialog element defined',
      function () {
        expect(controller.modalElement).toBeDefined();
      });

    it('should have a deleteRecordDialog method attached to the scope',
      function () {
        expect(scope.deleteRecordDialog).toBeDefined();
      });

    it('should have a deleteRecord method attached to the scope',
      function () {
        expect(scope.deleteRecord).toBeDefined();
      });

  });

});
