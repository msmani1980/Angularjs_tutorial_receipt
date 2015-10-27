'use strict';

describe('The confirmation modal directive', function () {

  beforeEach(module('ts5App', 'template-module'));

  var scope,
    element;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  function generateDirectiveTemplate(config) {
    var template = '<confirmation-modal ';
    if(config.cancelLabel) {
      template += 'cancel-label="'+config.cancelLabel+'" ';
    }
    if(config.title) {
      template += 'title="'+config.title+'" ';
    }
    if(config.body) {
      template += 'body="'+config.body+'" ';
    }
    if(config.confirmationCallback) {
      template += 'confirmation-call-back="'+config.confirmationCallback+'" ';
    }
    if(config.confirmationLabel) {
      template += 'confirmation-label="'+config.confirmationLabel+'" ';
    }
    if(config.alternativeCallback) {
      template += 'alternative-call-back="'+config.alternativeCallback+'" ';
    }
    if(config.alternativeLabel) {
      template += 'alternative-label="'+config.alternativeLabel+'" ';
    }
    template += '></confirmation-modal>';
    return template;
  }

  function renderDirective(config,$compile) {
    var template = generateDirectiveTemplate(config);
    element = angular.element(template);
    element = $compile(element)(scope);
    scope.$digest();
  }

  describe('when the directive is rendered', function () {

    var config;
    beforeEach(inject(function ($compile) {
      config = {
        title: 'Bogan Confirms',
        body: 'Do you really want to add more bugs Bogan?',
        confirmationLabel: 'BEGIN BOGAN',
        cancelLabel: 'Give FE Team a Break from Bogans'
      };
      renderDirective(config,$compile);
    }));

    it('should have a modal element', function () {
      expect(element.find('.modal')[0]).toBeDefined();
    });

    it('should have a modal-body ', function () {
      expect(element.find('.modal-body')[0]).toBeDefined();
    });

    it('should have a title', function () {
      expect(element.find('.modal-title').text()).toEqual(config.title);
    });

    it('should have a body', function () {
      expect(element.find('.modal-body').text().trim()).toEqual(config.body);
    });

    it('should have a modal-footer', function () {
      expect(element.find('.modal-footer')[0]).toBeDefined();
    });

    it('should have three buttons in the footer', function () {
      expect(element.find('.modal-footer .btn').length).toEqual(2);
    });

    it('should have a button to cancel', function () {
      expect(element.find('.modal-footer .btn-cancel').length).toEqual(1);
    });

    it('should have a confirmation button', function () {
      expect(element.find('.modal-footer .btn-success').length).toEqual(1);
    });

    it('should have a alternative button', function () {
      expect(element.find('.modal-footer .btn-primary').length).toEqual(1);
    });

  });

});
