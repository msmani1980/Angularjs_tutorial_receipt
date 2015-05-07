'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesService
 * @description
 * # companiesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companiesService', function ($resource,baseUrl,GlobalMenuService) {

  	var company = GlobalMenuService.company.get();

    // Returns the $resource with a specific URL 
    function returnResource(url, isArray) {

      var resourceURL = baseUrl + url;

      return $resource(resourceURL, {}, {
          query: { 
            method:'GET', 
            isArray:isArray
          }
        });

    } 

    return {
      tags: returnResource('/api/companies/'+company.id+'/tags'),
      salesCategories: returnResource('/api/companies/'+company.id+'/sales-categories'),
      currencies: returnResource('/api/companies/'+company.id+'/currencies'),
      taxTypes: returnResource('/api/companies/'+company.id+'/tax-types'),
      stations: returnResource('/api/companies/'+company.id+'/stations'),
    };

  });
    
