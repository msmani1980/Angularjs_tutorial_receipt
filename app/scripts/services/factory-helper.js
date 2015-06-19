'use strict';

/**
 * @ngdoc service
 * @name ts5App.factoryHelper
 * @author kmeath
 * @description
 * # factoryHelper
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('factoryHelper', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var
      /**
       * Services objects
       * @type {object}
       * @private
       */
      _servicesObject = null,

      /**
       * Promises array
       * @type {array}
       * @private
       */
      _promisesArray = null,

      /**
       * Sets services
       * @param Object servicesObject
       * @returns {boolean}
       * @throws Exception
       * @private
       */
       _setServices = function(servicesObject){
         if('[object Object]' !== Object.prototype.toString.call(servicesObject)){
           throw 'factoryHelper.setServices only accepts an object';
         }
        _servicesObject = servicesObject;
         return true;
       },

      /**
       * Calls services and set promises
       * @param serviceMethods Array of service methods
       * @returns {array} of the promises
       * @throws Exception
       * @private
       */
      _callServices = function(serviceMethods){
        _promisesArray = [];
        angular.forEach(serviceMethods, function(_serviceMethod){
          if(!_servicesObject.hasOwnProperty(_serviceMethod)){
            throw 'factoryHelper.call only accepts methods that exist in the setServices object, you passed in: ' + _serviceMethod;
          }
          _promisesArray.push(_servicesObject[_serviceMethod]());
        });
        return _promisesArray;
      },

      /**
       * Gets promises called
       *
       * @returns {array}
       * @private
       */
      _getPromises = function(){
        // TODO add ability for user to pass in an array of promises they want, or return all
        return _promisesArray;
      };

    return {
      setServices: _setServices,
      callServices: _callServices,
      getPromises: _getPromises
    };
  });
