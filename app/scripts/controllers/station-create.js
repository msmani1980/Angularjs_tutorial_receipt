'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StationCreateCtrl
 * @description
 * # StationCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StationCreateCtrl', function ($scope,$location,$q,ngToast,dateUtility) {

    var $this = this;

    var globalStationListJSON = {
      'response': [
        {
          'id': 1,
          'companyId': 403,
          'code': 'ORD',
          'name': 'Chicago O-hare'
        },
        {
          'id': 2,
          'companyId': 403,
          'code': 'MDW',
          'name': 'Chicago Midway'
        },
        {
          'id': 3,
          'companyId': 403,
          'code': 'LON3',
          'name': 'London'
        },
        {
          'id': 4,
          'companyId': 403,
          'code': 'SAN',
          'name': 'San Jose'
        },
        {
          'id': 5,
          'companyId': 403,
          'code': 'DEL',
          'name': 'Delhi'
        },
        {
          'id': 6,
          'companyId': 403,
          'code': 'JFK',
          'name': 'New York'
        },
        {
          'id': 7,
          'companyId': 403,
          'code': 'EWR',
          'name': 'Newark'
        },
        {
          'id': 8,
          'companyId': 403,
          'code': 'LAX',
          'name': 'Los Angeles'
        },
        {
          'id': 9,
          'companyId': 403,
          'code': 'MIA',
          'name': 'Miami'
        },
        {
          'id': 10,
          'companyId': 403,
          'code': 'IAH',
          'name': 'Houston'
        },
        {
          'id': 11,
          'companyId': 403,
          'code': 'BOS',
          'name': 'Boston'
        },
        {
          'id': 13,
          'companyId': 403,
          'code': 'CD123',
          'name': 'CHICAGO-NEW'
        },
        {
          'id': 19,
          'companyId': 403,
          'code': 'ALC',
          'name': 'Alicante'
        },
        {
          'id': 20,
          'companyId': 403,
          'code': 'BCN',
          'name': 'Barcelona'
        },
        {
          'id': 21,
          'companyId': 403,
          'code': 'AGP',
          'name': 'Malaga'
        },
        {
          'id': 22,
          'companyId': 403,
          'code': 'VLC',
          'name': 'Valencia'
        },
        {
          'id': 23,
          'companyId': 403,
          'code': 'CPH',
          'name': 'Copenhagen'
        },
        {
          'id': 24,
          'companyId': 403,
          'code': 'SKS',
          'name': 'Vojens'
        },
        {
          'id': 25,
          'companyId': 403,
          'code': 'EKHG',
          'name': 'Herning'
        },
        {
          'id': 26,
          'companyId': 403,
          'code': 'BSL',
          'name': 'Basel'
        },
        {
          'id': 27,
          'companyId': 403,
          'code': 'GVA',
          'name': 'Geneva'
        },
        {
          'id': 28,
          'companyId': 403,
          'code': 'ZRH',
          'name': 'Zurich'
        },
        {
          'id': 29,
          'companyId': 403,
          'code': 'BRN',
          'name': 'Bern'
        },
        {
          'id': 30,
          'companyId': 403,
          'code': 'ZHI',
          'name': 'Grenchen'
        },
        {
          'id': 39,
          'companyId': 403,
          'code': 'LON',
          'name': 'Heathrow Intl'
        },
        {
          'id': 41,
          'companyId': 403,
          'code': 'LGW',
          'name': 'Gatwick '
        },
        {
          'id': 43,
          'companyId': 403,
          'code': 'LPL',
          'name': 'Liverpool '
        },
        {
          'id': 44,
          'companyId': 403,
          'code': 'LTN',
          'name': 'Luton '
        },
        {
          'id': 45,
          'companyId': 403,
          'code': 'MAD',
          'name': 'Madrid '
        }
      ],
      'meta': {
        'count': 29,
        'limit': 29,
        'start': 0
      }
    };

    this.setGlobalStationList = function(dataFromAPI) {
      $scope.globalStationList = angular.copy(dataFromAPI.response);
    };

    this.getGlobalStationList = function() {
      // add factory API call here
      this.setGlobalStationList(globalStationListJSON);
    };

    this.showSuccessMessage = function(message) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Success</strong> - ' + message
      });
    };

    this.submitForm = function() {
      this.showSuccessMessage('Station has been created!');
    };

    this.checkIfViewOnly = function () {
      var path = $location.path();
      if (path.search('/station-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.makeInitPromises = function() {
      return [
        this.getGlobalStationList(),
      ];
    };

    this.initSuccessHandler = function() {
      // TODO: hide loader
    };

    this.init = function() {
      // TODO: Add waiting
      this.checkIfViewOnly();
      var promises = this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };

    this.init();

    /* Scope */
    $scope.formData = {
      stationId: null,
      endDate: dateUtility.nowFormatted(),
      startDate: dateUtility.nowFormatted()
    };
    $scope.viewOnly = false;
    $scope.displayError = false;
    $scope.buttonText = 'Create';

    $scope.submitForm = function() {
      return $this.submitForm();
    };

  });
