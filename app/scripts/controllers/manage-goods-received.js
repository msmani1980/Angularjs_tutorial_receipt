'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ManageGoodsReceivedCtrlCtrl
 * @description
 * # ManageGoodsReceivedCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManageGoodsReceivedCtrl', function ($scope,$filter, dateUtility,deliveryNoteFactory,ngToast) {

    var $this = this;
    $scope.stationsList = [];
    $scope.deliveryNotesList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };

    this.init = function() {
      this.getCatererStationList();
      $scope.$watch('catererStationId', function(newData) {
        if(newData) {
          $this.getDeliveryNotesList();
        }
      });
    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.filterDeliveryNotes = function () {
      return $filter('filter')($scope.deliveryNotesList, $scope.search);
    };

    this.generateDeliveryNoteQuery = function () {
      var query = {
        catererStationId: $scope.catererStationId,
        sortBy: 'ASC',
        limit: 100
      };
      angular.extend(query, $scope.search);
      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange.startDate);
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange.endDate);
      }
      return query;
    };

    this.getDeliveryNotesList = function () {
      var query = $this.generateDeliveryNoteQuery();
      $this.displayLoadingModal('Getting a list of delivery notes');
      deliveryNoteFactory.getDeliveryNotesList(query).then(function (data) {
        $scope.deliveryNotesList = data.response;
        $this.hideLoadingModal();
      });
    };

    this.getCatererStationList = function () {
      deliveryNoteFactory.getCatererStationList().then(function (data) {
        $scope.stationsList = data.response;
      });
    };

    this.findDeliveryNoteIndex = function (deliveryNoteId) {
      var deliveryNoteIndex = 0;
      for (var key in $scope.deliveryNotesList) {
        var deliveryNote = $scope.deliveryNotesList[key];
        if (deliveryNote.id === deliveryNoteId) {
          deliveryNoteIndex = key;
          break;
        }
      }
      return deliveryNoteIndex;
    };

    this.parseDate = function (date) {
      return Date.parse(date);
    };

    this.showSuccessMessage = function (message) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: message
      });
    };

    $scope.removeRecord = function (deliveryNoteId) {
      var deliveryNoteIndex = $this.findDeliveryNoteIndex(deliveryNoteId);
      $this.displayLoadingModal('Removing Delivery Note');
      deliveryNoteFactory.deleteDeliveryNote(deliveryNoteId).then(function () {
        $this.hideLoadingModal();
        $this.showSuccessMessage('Delivery Note Removed!');
        $scope.deliveryNotesList.splice(deliveryNoteIndex, 1);
      });
    };

    $scope.isDeliveryNoteActive = function (date) {
      var parsedDate = $this.parseDate(date);
      var today = dateUtility.now();
      return parsedDate <= today;
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        delete $scope.search[filterKey];
      }
      $this.displayLoadingModal();
      $this.getDeliveryNotesList();
    };

    $scope.searchRecords = function () {
      $this.displayLoadingModal();
      $this.getDeliveryNotesList();
    };

    this.init();

  });
