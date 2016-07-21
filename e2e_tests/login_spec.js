/**
 * Created by rcuriel on 7/20/16.
 */
'use strict';

describe('TS5 Login page', function () {
  beforeEach(function () {
    browser.get('http://localhost:9000/#/');
  });

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('TS5');
  });

  it('should have a box with H1 title', function () {
    var boxTitle = element(by.css('.modal-header h1'));
    expect(boxTitle.getText()).toEqual('TS5 Login');
  });

  describe('failed login', function () {
    var username = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var loginButton = element(by.css('.login-btn'));

    beforeEach(function () {
      username.sendKeys('');
      password.sendKeys('');
    });

    it('should validate username required', function () {
      password.sendKeys('fakePassword');
      loginButton.click();
      expect(username.getAttribute('class')).toMatch('ng-invalid');
    });

    it('should validate password is required', function () {
      username.sendKeys('fakePassword');
      loginButton.click();
      expect(password.getAttribute('class')).toMatch('ng-invalid');
    });

    it('should validate password is required', function () {
      username.sendKeys('fakeUsername');
      loginButton.click();
      expect(password.getAttribute('class')).toMatch('ng-invalid');
    });

    it('should show error for invalid usr/pwd combo', function () {
      username.sendKeys('fakeUsername');
      password.sendKeys('fakePassword');
      loginButton.click();
      expect(password.getAttribute('class')).toMatch('ng-invalid');
    });
  });
});
