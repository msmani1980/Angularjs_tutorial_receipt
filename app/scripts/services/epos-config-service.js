'use strict';

/**
 * @ngdoc service
 * @name ts5App.eposConfigService
 * @description
 * # eposConfigService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('eposConfigService', function ($resource, ENV, $q) {

    var eposConfigRequestURL = ENV.apiUrl + '/rsvr/api/epos-config/:id';
    var eposConfigRequestParameters = {
      id: '@id'
    };

    var eposConfigProductRequestURL = ENV.apiUrl + '/rsvr/api/epos-config/product';

    var eposConfigManagementActions = {
      getModules: {
        method: 'GET',
        headers: {}
      }
    };

    var eposConfigProductManagementActions = {
      getProductVersions: {
        method: 'GET',
        headers: {}
      }
    };

    var eposConfigRequestResource = $resource(eposConfigRequestURL, eposConfigRequestParameters, eposConfigManagementActions);
    var eposConfigProductRequestResource = $resource(eposConfigProductRequestURL, null, eposConfigProductManagementActions);

    var getProductVersions = function(payload) {
      var requestPayload = payload || {};
      return eposConfigProductRequestResource.getProductVersions(requestPayload).$promise;
    };

    var getModules = function(payload) {
      //return eposConfigRequestResource.getModules(payload).$promise;

      var p = $q.defer();
      return p.promise;
    };

    var getModule = function(moduleId, productVersionId) {
      //return eposConfigRequestResource.getModules(payload).$promise;

      var p = $q.defer();
      p.resolve({
        "id": 400,
        "moduleName": "Reports",
        "isRequired": false,
        "createdOn": "2015-06-11 23:20:23",
        "orderBy": 9,
        "moduleVersions": [
          {
            "id": 4,
            "moduleId": 400,
            "sourceModuleVersionId": null,
            "majorVersion": 1,
            "minorVersion": 0,
            "revision": 0,
            "build": 0,
            "createdOn": "2015-06-11 23:20:23",
            "moduleOptions": [
              {
                "id": 18,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 2,
                "name": "Inventory \/ C209",
                "description": "",
                "configurationName": "Inventory Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 26,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 12,
                "name": "Wastage",
                "description": "",
                "configurationName": "Wastage Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 25,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 11,
                "name": "Uplift",
                "description": "",
                "configurationName": "Uplift Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 15,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 6,
                "name": "Promotions",
                "description": "",
                "configurationName": "Promotions Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 23,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 10,
                "name": "Spend Per Head",
                "description": "",
                "configurationName": "Spend Per Head Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 24,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 9,
                "name": "Sales Per Crew",
                "description": "",
                "configurationName": "Sales Per Crew Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 22,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 4,
                "name": "Payment",
                "description": "",
                "configurationName": "Payment Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 16,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 8,
                "name": "Sales By Category",
                "description": "",
                "configurationName": "Sales By Category Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 20,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "Change Due",
                "description": "",
                "configurationName": "Change Due Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 17,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 3,
                "name": "Item Stock Out Summary",
                "description": "",
                "configurationName": "Item Stock Out Summary Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 143,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "Exchange Rate",
                "description": "",
                "configurationName": "Exchange Rate Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 21,
                "parentId": null,
                "moduleVersionId": 4,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 7,
                "name": "Rental",
                "description": "",
                "configurationName": "Rental Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              }
            ],
            "moduleVersions": [
              {
                "id": 8,
                "moduleId": 400,
                "sourceModuleVersionId": 4,
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 1,
                "createdOn": "2016-03-22 21:16:15",
                "moduleOptions": [
                  {
                    "id": 159,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 8,
                    "name": "Sales By Category",
                    "description": "",
                    "configurationName": "Store Closed Sales By Category Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 172,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 9,
                    "name": "Sales Per Crew",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Sales Per Crew Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 170,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 7,
                    "name": "Rental",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Rental Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 150,
                    "parentId": null,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 2,
                    "name": "Store (Barset) Open & Flight Closed",
                    "description": "",
                    "configurationName": "Reports Store Open Flight Closed",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 166,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 3,
                        "name": "Inventory \/ C209",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Inventory Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [
                          {
                            "id": 198,
                            "parentId": 166,
                            "moduleVersionId": 8,
                            "optionTypId": 3,
                            "linkeOptionId": null,
                            "displayOrder": 1,
                            "name": "AutoPrint Copies at Close (max of 5)",
                            "description": "",
                            "configurationName": "Store Open Flight Closed Inventory Report AutoPrint Copies",
                            "maxLength": 1,
                            "url": null,
                            "moduleOptionsForParentId": [

                            ]
                          }
                        ]
                      },
                      {
                        "id": 175,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 12,
                        "name": "Wastage",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Wastage Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 165,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 2,
                        "name": "Change Due",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Change Due Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 174,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 11,
                        "name": "Uplift",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Uplift Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 164,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "Exchange Rate",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Exchange Rate Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 172,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 9,
                        "name": "Sales Per Crew",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Sales Per Crew Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 170,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 7,
                        "name": "Rental",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Rental Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 173,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 10,
                        "name": "Spend Per Head",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Spend Per Head Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 169,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 6,
                        "name": "Promotions",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Promotions Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 168,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 5,
                        "name": "Payment",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Payment Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [
                          {
                            "id": 269,
                            "parentId": 168,
                            "moduleVersionId": 8,
                            "optionTypId": 3,
                            "linkeOptionId": null,
                            "displayOrder": 1,
                            "name": "AutoPrint Copies at Close (max of 5)",
                            "description": "",
                            "configurationName": "Store Open Flight Closed Payment Report AutoPrint Copies",
                            "maxLength": 1,
                            "url": null,
                            "moduleOptionsForParentId": [

                            ]
                          }
                        ]
                      },
                      {
                        "id": 171,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 8,
                        "name": "Sales By Category",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Sales By Category Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 167,
                        "parentId": 150,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 4,
                        "name": "Item Stock Out Summary",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Item Stock Out Summary",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 152,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "Exchange Rate",
                    "description": "",
                    "configurationName": "Store Closed Exchange Rate Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 187,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 12,
                    "name": "Wastage",
                    "description": "",
                    "configurationName": "Flight Open Wastage Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 180,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 5,
                    "name": "Payment",
                    "description": "",
                    "configurationName": "Flight Open Payment Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 182,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 7,
                    "name": "Rental",
                    "description": "",
                    "configurationName": "Flight Open Rental Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 162,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 11,
                    "name": "Uplift",
                    "description": "",
                    "configurationName": "Store Closed Uplift Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 149,
                    "parentId": null,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 3,
                    "name": "Store (Barset) Closed",
                    "description": "",
                    "configurationName": "Reports Store Closed",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 159,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 8,
                        "name": "Sales By Category",
                        "description": "",
                        "configurationName": "Store Closed Sales By Category Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 153,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 2,
                        "name": "Change Due",
                        "description": "",
                        "configurationName": "Store Closed Change Due Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 155,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 4,
                        "name": "Item Stock Out Summary",
                        "description": "",
                        "configurationName": "Store Closed Item Stock Out Summary Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 156,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 5,
                        "name": "Payment",
                        "description": "",
                        "configurationName": "Store Closed Payment Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [
                          {
                            "id": 196,
                            "parentId": 156,
                            "moduleVersionId": 8,
                            "optionTypId": 3,
                            "linkeOptionId": null,
                            "displayOrder": 1,
                            "name": "AutoPrint Copies at Close (max of 5)",
                            "description": "",
                            "configurationName": "Store Closed Payment Report AutoPrint Copies",
                            "maxLength": 1,
                            "url": null,
                            "moduleOptionsForParentId": [

                            ]
                          }
                        ]
                      },
                      {
                        "id": 158,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 7,
                        "name": "Rental",
                        "description": "",
                        "configurationName": "Store Closed Rental Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 163,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 12,
                        "name": "Wastage",
                        "description": "",
                        "configurationName": "Store Closed Wastage Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 152,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "Exchange Rate",
                        "description": "",
                        "configurationName": "Store Closed Exchange Rate Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 157,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 6,
                        "name": "Promotions",
                        "description": "",
                        "configurationName": "Store Closed Promotions Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 161,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 10,
                        "name": "Spend Per Head",
                        "description": "",
                        "configurationName": "Store Closed Spend Per Head Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 162,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 11,
                        "name": "Uplift",
                        "description": "",
                        "configurationName": "Store Closed Uplift Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 154,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 3,
                        "name": "Inventory \/ C209",
                        "description": "",
                        "configurationName": "Store Closed Inventory Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [
                          {
                            "id": 197,
                            "parentId": 154,
                            "moduleVersionId": 8,
                            "optionTypId": 3,
                            "linkeOptionId": null,
                            "displayOrder": 1,
                            "name": "AutoPrint Copies at Close (max of 5)",
                            "description": "",
                            "configurationName": "Store Closed Inventory Report AutoPrint Copies",
                            "maxLength": 1,
                            "url": null,
                            "moduleOptionsForParentId": [

                            ]
                          }
                        ]
                      },
                      {
                        "id": 160,
                        "parentId": 149,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 9,
                        "name": "Sales Per Crew",
                        "description": "",
                        "configurationName": "Store Closed Sales Per Crew Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 181,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 6,
                    "name": "Promotions",
                    "description": "",
                    "configurationName": "Flight Open Promotions Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 197,
                    "parentId": 154,
                    "moduleVersionId": 8,
                    "optionTypId": 3,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "AutoPrint Copies at Close (max of 5)",
                    "description": "",
                    "configurationName": "Store Closed Inventory Report AutoPrint Copies",
                    "maxLength": 1,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 186,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 11,
                    "name": "Uplift",
                    "description": "",
                    "configurationName": "Flight Open Uplift Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 156,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 5,
                    "name": "Payment",
                    "description": "",
                    "configurationName": "Store Closed Payment Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 196,
                        "parentId": 156,
                        "moduleVersionId": 8,
                        "optionTypId": 3,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "AutoPrint Copies at Close (max of 5)",
                        "description": "",
                        "configurationName": "Store Closed Payment Report AutoPrint Copies",
                        "maxLength": 1,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 198,
                    "parentId": 166,
                    "moduleVersionId": 8,
                    "optionTypId": 3,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "AutoPrint Copies at Close (max of 5)",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Inventory Report AutoPrint Copies",
                    "maxLength": 1,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 158,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 7,
                    "name": "Rental",
                    "description": "",
                    "configurationName": "Store Closed Rental Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 151,
                    "parentId": null,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "Flight Open",
                    "description": "",
                    "configurationName": "Reports Flight Open",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 178,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 3,
                        "name": "Inventory \/ C209",
                        "description": "",
                        "configurationName": "Flight Open Inventory Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 179,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 4,
                        "name": "Item Stock Out Summary",
                        "description": "",
                        "configurationName": "Flight Open Item Stock Out Summary Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 186,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 11,
                        "name": "Uplift",
                        "description": "",
                        "configurationName": "Flight Open Uplift Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 183,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 8,
                        "name": "Sales By Category",
                        "description": "",
                        "configurationName": "Flight Open Sales By Category Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 187,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 12,
                        "name": "Wastage",
                        "description": "",
                        "configurationName": "Flight Open Wastage Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 176,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "Exchange Rate",
                        "description": "",
                        "configurationName": "Flight Open Exchange Rate Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 177,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 2,
                        "name": "Change Due",
                        "description": "",
                        "configurationName": "Flight Open Change Due Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 180,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 5,
                        "name": "Payment",
                        "description": "",
                        "configurationName": "Flight Open Payment Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 182,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 7,
                        "name": "Rental",
                        "description": "",
                        "configurationName": "Flight Open Rental Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 185,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 10,
                        "name": "Spend Per Head",
                        "description": "",
                        "configurationName": "Flight Open Spend Per Head Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 181,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 6,
                        "name": "Promotions",
                        "description": "",
                        "configurationName": "Flight Open Promotions Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      },
                      {
                        "id": 184,
                        "parentId": 151,
                        "moduleVersionId": 8,
                        "optionTypId": 1,
                        "linkeOptionId": null,
                        "displayOrder": 9,
                        "name": "Sales Per Crew",
                        "description": "",
                        "configurationName": "Flight Open Sales Per Crew Report",
                        "maxLength": null,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 164,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "Exchange Rate",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Exchange Rate Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 173,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 10,
                    "name": "Spend Per Head",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Spend Per Head Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 185,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 10,
                    "name": "Spend Per Head",
                    "description": "",
                    "configurationName": "Flight Open Spend Per Head Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 168,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 5,
                    "name": "Payment",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Payment Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 269,
                        "parentId": 168,
                        "moduleVersionId": 8,
                        "optionTypId": 3,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "AutoPrint Copies at Close (max of 5)",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Payment Report AutoPrint Copies",
                        "maxLength": 1,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 171,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 8,
                    "name": "Sales By Category",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Sales By Category Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 160,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 9,
                    "name": "Sales Per Crew",
                    "description": "",
                    "configurationName": "Store Closed Sales Per Crew Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 184,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 9,
                    "name": "Sales Per Crew",
                    "description": "",
                    "configurationName": "Flight Open Sales Per Crew Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 179,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 4,
                    "name": "Item Stock Out Summary",
                    "description": "",
                    "configurationName": "Flight Open Item Stock Out Summary Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 153,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 2,
                    "name": "Change Due",
                    "description": "",
                    "configurationName": "Store Closed Change Due Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 155,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 4,
                    "name": "Item Stock Out Summary",
                    "description": "",
                    "configurationName": "Store Closed Item Stock Out Summary Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 177,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 2,
                    "name": "Change Due",
                    "description": "",
                    "configurationName": "Flight Open Change Due Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 161,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 10,
                    "name": "Spend Per Head",
                    "description": "",
                    "configurationName": "Store Closed Spend Per Head Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 167,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 4,
                    "name": "Item Stock Out Summary",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Item Stock Out Summary",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 178,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 3,
                    "name": "Inventory \/ C209",
                    "description": "",
                    "configurationName": "Flight Open Inventory Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 166,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 3,
                    "name": "Inventory \/ C209",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Inventory Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 198,
                        "parentId": 166,
                        "moduleVersionId": 8,
                        "optionTypId": 3,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "AutoPrint Copies at Close (max of 5)",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Inventory Report AutoPrint Copies",
                        "maxLength": 1,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 175,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 12,
                    "name": "Wastage",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Wastage Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 269,
                    "parentId": 168,
                    "moduleVersionId": 8,
                    "optionTypId": 3,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "AutoPrint Copies at Close (max of 5)",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Payment Report AutoPrint Copies",
                    "maxLength": 1,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 165,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 2,
                    "name": "Change Due",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Change Due Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 174,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 11,
                    "name": "Uplift",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Uplift Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 163,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 12,
                    "name": "Wastage",
                    "description": "",
                    "configurationName": "Store Closed Wastage Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 157,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 6,
                    "name": "Promotions",
                    "description": "",
                    "configurationName": "Store Closed Promotions Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 183,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 8,
                    "name": "Sales By Category",
                    "description": "",
                    "configurationName": "Flight Open Sales By Category Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 176,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "Exchange Rate",
                    "description": "",
                    "configurationName": "Flight Open Exchange Rate Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 196,
                    "parentId": 156,
                    "moduleVersionId": 8,
                    "optionTypId": 3,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "AutoPrint Copies at Close (max of 5)",
                    "description": "",
                    "configurationName": "Store Closed Payment Report AutoPrint Copies",
                    "maxLength": 1,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 169,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 6,
                    "name": "Promotions",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Promotions Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 154,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 3,
                    "name": "Inventory \/ C209",
                    "description": "",
                    "configurationName": "Store Closed Inventory Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 197,
                        "parentId": 154,
                        "moduleVersionId": 8,
                        "optionTypId": 3,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "AutoPrint Copies at Close (max of 5)",
                        "description": "",
                        "configurationName": "Store Closed Inventory Report AutoPrint Copies",
                        "maxLength": 1,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  }
                ],
                "moduleVersions": [

                ],
                "productVersions": [
                  {
                    "id": 9,
                    "versionName": "201711090357",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 8,
                    "sourceProductVersionId": 8,
                    "createdOn": "2017-11-09 21:57:31"
                  },
                  {
                    "id": 12,
                    "versionName": "201801170418",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 11,
                    "sourceProductVersionId": 11,
                    "createdOn": "2018-01-17 22:18:19"
                  },
                  {
                    "id": 8,
                    "versionName": "201706120239",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 7,
                    "sourceProductVersionId": 7,
                    "createdOn": "2017-06-12 19:39:19"
                  },
                  {
                    "id": 4,
                    "versionName": "201610121154",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 3,
                    "sourceProductVersionId": 3,
                    "createdOn": "2016-10-12 16:54:06"
                  },
                  {
                    "id": 5,
                    "versionName": "201703161114",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 4,
                    "sourceProductVersionId": 5,
                    "createdOn": "2017-03-16 16:14:56"
                  },
                  {
                    "id": 11,
                    "versionName": "201801020852",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 10,
                    "sourceProductVersionId": 10,
                    "createdOn": "2018-01-02 14:52:57"
                  },
                  {
                    "id": 6,
                    "versionName": "201704051105",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 5,
                    "sourceProductVersionId": 6,
                    "createdOn": "2017-04-05 16:05:36"
                  },
                  {
                    "id": 10,
                    "versionName": "201712070357",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 9,
                    "sourceProductVersionId": 9,
                    "createdOn": "2017-12-07 21:57:31"
                  },
                  {
                    "id": 2,
                    "versionName": "201603220416",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 1,
                    "sourceProductVersionId": 1,
                    "createdOn": "2016-03-22 21:16:15"
                  },
                  {
                    "id": 3,
                    "versionName": "201604200543",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 2,
                    "sourceProductVersionId": 2,
                    "createdOn": "2016-04-20 22:43:27"
                  },
                  {
                    "id": 7,
                    "versionName": "201705230321",
                    "majorVersion": 1,
                    "minorVersion": 0,
                    "revision": 0,
                    "build": 6,
                    "sourceProductVersionId": 6,
                    "createdOn": "2017-05-23 20:21:48"
                  }
                ],
                "moduleFiles": [

                ]
              }
            ],
            "productVersions": [
              {
                "id": 1,
                "versionName": "Initial",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 0,
                "sourceProductVersionId": null,
                "createdOn": "2015-06-11 23:20:23"
              }
            ],
            "moduleFiles": [

            ]
          },
          {
            "id": 8,
            "moduleId": 400,
            "sourceModuleVersionId": 4,
            "majorVersion": 1,
            "minorVersion": 0,
            "revision": 0,
            "build": 1,
            "createdOn": "2016-03-22 21:16:15",
            "moduleOptions": [
              {
                "id": 159,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 8,
                "name": "Sales By Category",
                "description": "",
                "configurationName": "Store Closed Sales By Category Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 172,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 9,
                "name": "Sales Per Crew",
                "description": "",
                "configurationName": "Store Open Flight Closed Sales Per Crew Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 170,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 7,
                "name": "Rental",
                "description": "",
                "configurationName": "Store Open Flight Closed Rental Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 150,
                "parentId": null,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 2,
                "name": "Store (Barset) Open & Flight Closed",
                "description": "",
                "configurationName": "Reports Store Open Flight Closed",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [
                  {
                    "id": 166,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 3,
                    "name": "Inventory \/ C209",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Inventory Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 198,
                        "parentId": 166,
                        "moduleVersionId": 8,
                        "optionTypId": 3,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "AutoPrint Copies at Close (max of 5)",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Inventory Report AutoPrint Copies",
                        "maxLength": 1,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 175,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 12,
                    "name": "Wastage",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Wastage Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 165,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 2,
                    "name": "Change Due",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Change Due Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 174,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 11,
                    "name": "Uplift",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Uplift Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 164,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "Exchange Rate",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Exchange Rate Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 172,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 9,
                    "name": "Sales Per Crew",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Sales Per Crew Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 170,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 7,
                    "name": "Rental",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Rental Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 173,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 10,
                    "name": "Spend Per Head",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Spend Per Head Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 169,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 6,
                    "name": "Promotions",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Promotions Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 168,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 5,
                    "name": "Payment",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Payment Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 269,
                        "parentId": 168,
                        "moduleVersionId": 8,
                        "optionTypId": 3,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "AutoPrint Copies at Close (max of 5)",
                        "description": "",
                        "configurationName": "Store Open Flight Closed Payment Report AutoPrint Copies",
                        "maxLength": 1,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 171,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 8,
                    "name": "Sales By Category",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Sales By Category Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 167,
                    "parentId": 150,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 4,
                    "name": "Item Stock Out Summary",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Item Stock Out Summary",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  }
                ]
              },
              {
                "id": 152,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "Exchange Rate",
                "description": "",
                "configurationName": "Store Closed Exchange Rate Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 187,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 12,
                "name": "Wastage",
                "description": "",
                "configurationName": "Flight Open Wastage Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 180,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 5,
                "name": "Payment",
                "description": "",
                "configurationName": "Flight Open Payment Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 182,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 7,
                "name": "Rental",
                "description": "",
                "configurationName": "Flight Open Rental Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 162,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 11,
                "name": "Uplift",
                "description": "",
                "configurationName": "Store Closed Uplift Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 149,
                "parentId": null,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 3,
                "name": "Store (Barset) Closed",
                "description": "",
                "configurationName": "Reports Store Closed",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [
                  {
                    "id": 159,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 8,
                    "name": "Sales By Category",
                    "description": "",
                    "configurationName": "Store Closed Sales By Category Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 153,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 2,
                    "name": "Change Due",
                    "description": "",
                    "configurationName": "Store Closed Change Due Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 155,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 4,
                    "name": "Item Stock Out Summary",
                    "description": "",
                    "configurationName": "Store Closed Item Stock Out Summary Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 156,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 5,
                    "name": "Payment",
                    "description": "",
                    "configurationName": "Store Closed Payment Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 196,
                        "parentId": 156,
                        "moduleVersionId": 8,
                        "optionTypId": 3,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "AutoPrint Copies at Close (max of 5)",
                        "description": "",
                        "configurationName": "Store Closed Payment Report AutoPrint Copies",
                        "maxLength": 1,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 158,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 7,
                    "name": "Rental",
                    "description": "",
                    "configurationName": "Store Closed Rental Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 163,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 12,
                    "name": "Wastage",
                    "description": "",
                    "configurationName": "Store Closed Wastage Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 152,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "Exchange Rate",
                    "description": "",
                    "configurationName": "Store Closed Exchange Rate Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 157,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 6,
                    "name": "Promotions",
                    "description": "",
                    "configurationName": "Store Closed Promotions Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 161,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 10,
                    "name": "Spend Per Head",
                    "description": "",
                    "configurationName": "Store Closed Spend Per Head Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 162,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 11,
                    "name": "Uplift",
                    "description": "",
                    "configurationName": "Store Closed Uplift Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 154,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 3,
                    "name": "Inventory \/ C209",
                    "description": "",
                    "configurationName": "Store Closed Inventory Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [
                      {
                        "id": 197,
                        "parentId": 154,
                        "moduleVersionId": 8,
                        "optionTypId": 3,
                        "linkeOptionId": null,
                        "displayOrder": 1,
                        "name": "AutoPrint Copies at Close (max of 5)",
                        "description": "",
                        "configurationName": "Store Closed Inventory Report AutoPrint Copies",
                        "maxLength": 1,
                        "url": null,
                        "moduleOptionsForParentId": [

                        ]
                      }
                    ]
                  },
                  {
                    "id": 160,
                    "parentId": 149,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 9,
                    "name": "Sales Per Crew",
                    "description": "",
                    "configurationName": "Store Closed Sales Per Crew Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  }
                ]
              },
              {
                "id": 181,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 6,
                "name": "Promotions",
                "description": "",
                "configurationName": "Flight Open Promotions Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 197,
                "parentId": 154,
                "moduleVersionId": 8,
                "optionTypId": 3,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "AutoPrint Copies at Close (max of 5)",
                "description": "",
                "configurationName": "Store Closed Inventory Report AutoPrint Copies",
                "maxLength": 1,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 186,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 11,
                "name": "Uplift",
                "description": "",
                "configurationName": "Flight Open Uplift Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 156,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 5,
                "name": "Payment",
                "description": "",
                "configurationName": "Store Closed Payment Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [
                  {
                    "id": 196,
                    "parentId": 156,
                    "moduleVersionId": 8,
                    "optionTypId": 3,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "AutoPrint Copies at Close (max of 5)",
                    "description": "",
                    "configurationName": "Store Closed Payment Report AutoPrint Copies",
                    "maxLength": 1,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  }
                ]
              },
              {
                "id": 198,
                "parentId": 166,
                "moduleVersionId": 8,
                "optionTypId": 3,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "AutoPrint Copies at Close (max of 5)",
                "description": "",
                "configurationName": "Store Open Flight Closed Inventory Report AutoPrint Copies",
                "maxLength": 1,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 158,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 7,
                "name": "Rental",
                "description": "",
                "configurationName": "Store Closed Rental Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 151,
                "parentId": null,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "Flight Open",
                "description": "",
                "configurationName": "Reports Flight Open",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [
                  {
                    "id": 178,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 3,
                    "name": "Inventory \/ C209",
                    "description": "",
                    "configurationName": "Flight Open Inventory Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 179,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 4,
                    "name": "Item Stock Out Summary",
                    "description": "",
                    "configurationName": "Flight Open Item Stock Out Summary Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 186,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 11,
                    "name": "Uplift",
                    "description": "",
                    "configurationName": "Flight Open Uplift Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 183,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 8,
                    "name": "Sales By Category",
                    "description": "",
                    "configurationName": "Flight Open Sales By Category Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 187,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 12,
                    "name": "Wastage",
                    "description": "",
                    "configurationName": "Flight Open Wastage Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 176,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "Exchange Rate",
                    "description": "",
                    "configurationName": "Flight Open Exchange Rate Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 177,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 2,
                    "name": "Change Due",
                    "description": "",
                    "configurationName": "Flight Open Change Due Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 180,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 5,
                    "name": "Payment",
                    "description": "",
                    "configurationName": "Flight Open Payment Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 182,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 7,
                    "name": "Rental",
                    "description": "",
                    "configurationName": "Flight Open Rental Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 185,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 10,
                    "name": "Spend Per Head",
                    "description": "",
                    "configurationName": "Flight Open Spend Per Head Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 181,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 6,
                    "name": "Promotions",
                    "description": "",
                    "configurationName": "Flight Open Promotions Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  },
                  {
                    "id": 184,
                    "parentId": 151,
                    "moduleVersionId": 8,
                    "optionTypId": 1,
                    "linkeOptionId": null,
                    "displayOrder": 9,
                    "name": "Sales Per Crew",
                    "description": "",
                    "configurationName": "Flight Open Sales Per Crew Report",
                    "maxLength": null,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  }
                ]
              },
              {
                "id": 164,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "Exchange Rate",
                "description": "",
                "configurationName": "Store Open Flight Closed Exchange Rate Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 173,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 10,
                "name": "Spend Per Head",
                "description": "",
                "configurationName": "Store Open Flight Closed Spend Per Head Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 185,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 10,
                "name": "Spend Per Head",
                "description": "",
                "configurationName": "Flight Open Spend Per Head Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 168,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 5,
                "name": "Payment",
                "description": "",
                "configurationName": "Store Open Flight Closed Payment Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [
                  {
                    "id": 269,
                    "parentId": 168,
                    "moduleVersionId": 8,
                    "optionTypId": 3,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "AutoPrint Copies at Close (max of 5)",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Payment Report AutoPrint Copies",
                    "maxLength": 1,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  }
                ]
              },
              {
                "id": 171,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 8,
                "name": "Sales By Category",
                "description": "",
                "configurationName": "Store Open Flight Closed Sales By Category Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 160,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 9,
                "name": "Sales Per Crew",
                "description": "",
                "configurationName": "Store Closed Sales Per Crew Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 184,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 9,
                "name": "Sales Per Crew",
                "description": "",
                "configurationName": "Flight Open Sales Per Crew Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 179,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 4,
                "name": "Item Stock Out Summary",
                "description": "",
                "configurationName": "Flight Open Item Stock Out Summary Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 153,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 2,
                "name": "Change Due",
                "description": "",
                "configurationName": "Store Closed Change Due Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 155,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 4,
                "name": "Item Stock Out Summary",
                "description": "",
                "configurationName": "Store Closed Item Stock Out Summary Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 177,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 2,
                "name": "Change Due",
                "description": "",
                "configurationName": "Flight Open Change Due Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 161,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 10,
                "name": "Spend Per Head",
                "description": "",
                "configurationName": "Store Closed Spend Per Head Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 167,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 4,
                "name": "Item Stock Out Summary",
                "description": "",
                "configurationName": "Store Open Flight Closed Item Stock Out Summary",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 178,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 3,
                "name": "Inventory \/ C209",
                "description": "",
                "configurationName": "Flight Open Inventory Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 166,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 3,
                "name": "Inventory \/ C209",
                "description": "",
                "configurationName": "Store Open Flight Closed Inventory Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [
                  {
                    "id": 198,
                    "parentId": 166,
                    "moduleVersionId": 8,
                    "optionTypId": 3,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "AutoPrint Copies at Close (max of 5)",
                    "description": "",
                    "configurationName": "Store Open Flight Closed Inventory Report AutoPrint Copies",
                    "maxLength": 1,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  }
                ]
              },
              {
                "id": 175,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 12,
                "name": "Wastage",
                "description": "",
                "configurationName": "Store Open Flight Closed Wastage Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 269,
                "parentId": 168,
                "moduleVersionId": 8,
                "optionTypId": 3,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "AutoPrint Copies at Close (max of 5)",
                "description": "",
                "configurationName": "Store Open Flight Closed Payment Report AutoPrint Copies",
                "maxLength": 1,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 165,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 2,
                "name": "Change Due",
                "description": "",
                "configurationName": "Store Open Flight Closed Change Due Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 174,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 11,
                "name": "Uplift",
                "description": "",
                "configurationName": "Store Open Flight Closed Uplift Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 163,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 12,
                "name": "Wastage",
                "description": "",
                "configurationName": "Store Closed Wastage Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 157,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 6,
                "name": "Promotions",
                "description": "",
                "configurationName": "Store Closed Promotions Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 183,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 8,
                "name": "Sales By Category",
                "description": "",
                "configurationName": "Flight Open Sales By Category Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 176,
                "parentId": 151,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "Exchange Rate",
                "description": "",
                "configurationName": "Flight Open Exchange Rate Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 196,
                "parentId": 156,
                "moduleVersionId": 8,
                "optionTypId": 3,
                "linkeOptionId": null,
                "displayOrder": 1,
                "name": "AutoPrint Copies at Close (max of 5)",
                "description": "",
                "configurationName": "Store Closed Payment Report AutoPrint Copies",
                "maxLength": 1,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 169,
                "parentId": 150,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 6,
                "name": "Promotions",
                "description": "",
                "configurationName": "Store Open Flight Closed Promotions Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [

                ]
              },
              {
                "id": 154,
                "parentId": 149,
                "moduleVersionId": 8,
                "optionTypId": 1,
                "linkeOptionId": null,
                "displayOrder": 3,
                "name": "Inventory \/ C209",
                "description": "",
                "configurationName": "Store Closed Inventory Report",
                "maxLength": null,
                "url": null,
                "moduleOptionsForParentId": [
                  {
                    "id": 197,
                    "parentId": 154,
                    "moduleVersionId": 8,
                    "optionTypId": 3,
                    "linkeOptionId": null,
                    "displayOrder": 1,
                    "name": "AutoPrint Copies at Close (max of 5)",
                    "description": "",
                    "configurationName": "Store Closed Inventory Report AutoPrint Copies",
                    "maxLength": 1,
                    "url": null,
                    "moduleOptionsForParentId": [

                    ]
                  }
                ]
              }
            ],
            "moduleVersions": [

            ],
            "productVersions": [
              {
                "id": 9,
                "versionName": "201711090357",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 8,
                "sourceProductVersionId": 8,
                "createdOn": "2017-11-09 21:57:31"
              },
              {
                "id": 12,
                "versionName": "201801170418",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 11,
                "sourceProductVersionId": 11,
                "createdOn": "2018-01-17 22:18:19"
              },
              {
                "id": 8,
                "versionName": "201706120239",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 7,
                "sourceProductVersionId": 7,
                "createdOn": "2017-06-12 19:39:19"
              },
              {
                "id": 4,
                "versionName": "201610121154",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 3,
                "sourceProductVersionId": 3,
                "createdOn": "2016-10-12 16:54:06"
              },
              {
                "id": 5,
                "versionName": "201703161114",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 4,
                "sourceProductVersionId": 5,
                "createdOn": "2017-03-16 16:14:56"
              },
              {
                "id": 11,
                "versionName": "201801020852",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 10,
                "sourceProductVersionId": 10,
                "createdOn": "2018-01-02 14:52:57"
              },
              {
                "id": 6,
                "versionName": "201704051105",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 5,
                "sourceProductVersionId": 6,
                "createdOn": "2017-04-05 16:05:36"
              },
              {
                "id": 10,
                "versionName": "201712070357",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 9,
                "sourceProductVersionId": 9,
                "createdOn": "2017-12-07 21:57:31"
              },
              {
                "id": 2,
                "versionName": "201603220416",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 1,
                "sourceProductVersionId": 1,
                "createdOn": "2016-03-22 21:16:15"
              },
              {
                "id": 3,
                "versionName": "201604200543",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 2,
                "sourceProductVersionId": 2,
                "createdOn": "2016-04-20 22:43:27"
              },
              {
                "id": 7,
                "versionName": "201705230321",
                "majorVersion": 1,
                "minorVersion": 0,
                "revision": 0,
                "build": 6,
                "sourceProductVersionId": 6,
                "createdOn": "2017-05-23 20:21:48"
              }
            ],
            "moduleFiles": [

            ]
          }
        ],
        "required": false
      });
      return p.promise;
    };

    return {
      getProductVersions: getProductVersions,
      getModules: getModules,
      getModule: getModule
    };

  });
