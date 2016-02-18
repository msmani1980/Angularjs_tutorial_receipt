'use strict';

/**
 * @ngdoc service
 * @name ts5App.socketIO
 * @description
 * # socketIO
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('socketIO', function ($rootScope) {
    var socket = {
      on: function () {
        return true;
      },
      
      emit: function () {
        return true;
      }
    };//io.connect('http://curiel.me:3000');

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },

      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });
