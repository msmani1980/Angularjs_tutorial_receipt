'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ManageGoodsReceivedCtrlCtrl
 * @description
 * # ManageGoodsReceivedCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManageGoodsReceivedCtrl', function ($scope,$filter, dateUtility,deliveryNoteFactory,ngToast, lodash) {

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.stationsList = [];
    $scope.deliveryNotesList = [];
    $scope.dateRange = {
      deliveryStartDate: '',
      deliveryEndDate: ''
    };
    $scope.userSelectedStation = false;

    this.init = function() {
      this.getCatererStationList();
      $scope.$watch('catererStationId', function(newData) {
        if(newData) {
          $scope.deliveryNotesList = [];
          $this.meta = {
            count: undefined,
            limit: 100,
            offset: 0
          };
          $scope.getDeliveryNotesList();
        }
      });
    };

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.generateDeliveryNoteQuery = function () {
      var query = {
        catererStationId: $scope.catererStationId,
        sortBy: 'ASC',
        limit: 100
      };
      angular.extend(query, $scope.search);
      if ($scope.dateRange.deliveryStartDate && $scope.dateRange.deliveryEndDate) {
        query.deliveryStartDate = dateUtility.formatDateForAPI($scope.dateRange.deliveryStartDate);
        query.deliveryEndDate = dateUtility.formatDateForAPI($scope.dateRange.deliveryEndDate);
      }
      return query;
    };

    $scope.getDeliveryNotesList = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }
      showLoadingBar();
      $scope.userSelectedStation = false;
      var query = $this.generateDeliveryNoteQuery();
      query = lodash.assign(query, {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      deliveryNoteFactory.getDeliveryNotesList(query).then(function (data) {
        $this.meta.count = $this.meta.count || data.meta.count;
        $scope.userSelectedStation = true;
        $scope.deliveryNotesList = $scope.deliveryNotesList.concat(data.response);
        $this.formatDeliveryNotesDates();
        hideLoadingBar();
      });
      $this.meta.offset += $this.meta.limit;
    };

    this.formatDeliveryNotesDates = function() {
      angular.forEach($scope.deliveryNotesList,function(deliveryNote){
        if (deliveryNote && deliveryNote.updatedOn) {
          deliveryNote.updatedOn = dateUtility.removeMilliseconds(deliveryNote.updatedOn);
        }
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

    $scope.clearSearchFilters = function () {
      $scope.dateRange.deliveryStartDate = '';
      $scope.dateRange.deliveryEndDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        delete $scope.search[filterKey];
      }
      $scope.searchRecords();
    };

    $scope.searchRecords = function () {
      $scope.deliveryNotesList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.getDeliveryNotesList();
    };

    this.init();

  });
