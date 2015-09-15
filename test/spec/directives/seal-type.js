'use strict';

fdescribe('the Seal Type directive', function() {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));

  var element;
  var scope;
  var compile;
  var isolatedScope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
    scope.sealTypesList = [
      {
        name:'Outbound',
        code: 'OB',
        color:'#00B200',
        seals: {
            numbers:[]
        }
      },
      {
        name:'Handover',
        code: 'HO',
        color:'#E5E500',
        seals: {
            numbers:[]
        },
        actions: [
          {
            label: 'Copy From Outbound',
            trigger: function() {
              return scope.copySeals('Outbound','Handover');
            }
          }
        ]
      }
    ];
  }));

  function compileDirective() {
    var newDirective = angular.element('<seal-type seal-type-object="sealTypesList[0]"></seal-type>');
    element = compile(newDirective)(scope);
    scope.$digest();
    isolatedScope = element.isolateScope();
  }

  describe('When the seal-type directive is compiled, it', function() {

    beforeEach(inject(function() {
      compileDirective();
    }));

    it('should be defined', function() {
      expect(element).toBeDefined();
    });

    it('should contain an element with the class .seal-type', function() {
      expect(element.find('.seal-type')).toBeDefined();
    });

  });

  describe('The seal-type directive Scope,', function() {

    beforeEach(inject(function() {
      compileDirective();
    }));

    it('should have the sealTypeObject.label match the label passed from the parent scope', function() {
      expect(isolatedScope.sealTypeObject.label).toEqual(scope.sealTypesList[0].label);
    });

    it('should have the sealTypeObject.code match the code passed from the parent scope', function() {
      expect(isolatedScope.sealTypeObject.code).toEqual(scope.sealTypesList[0].code);
    });

    it('should have the sealTypeObject.color match the color passed from the parent scope', function() {
      expect(isolatedScope.sealTypeObject.color).toEqual(scope.sealTypesList[0].color);
    });

    it('should have the sealTypeObject.seals array that equals the seals passed from the parent scope', function() {
      expect(isolatedScope.sealTypeObject.seals).toEqual(scope.sealTypesList[0].seals);
    });

    it('should have the sealTypeObject.actions array that equals the actions passed from the parent scope', function() {
      expect(isolatedScope.sealTypeObject.actions).toEqual(scope.sealTypesList[0].actions);
    });

    describe('The sequentialPossible method,', function() {

      beforeEach(inject(function() {
        spyOn(isolatedScope, 'isSequentialPossible').and.callThrough();
      }));

      it('should define method', function() {
        expect(isolatedScope.isSequentialPossible).toBeDefined();
      });

      it('should be true', function() {
        scope.sealTypesList[0].seals.numbers = ['123'];
        isolatedScope.isSequentialPossible();
        expect(isolatedScope.isSequentialPossible).toBeTruthy();
      });

    });

    describe('The addSealsSequentially method,', function() {

      beforeEach(inject(function() {
        spyOn(isolatedScope, 'addSealsSequentially').and.callThrough();
      }));

      it('should define method', function() {
        expect(isolatedScope.addSealsSequentially).toBeDefined();
      });

      it('should add seals sequentially', function() {
        scope.sealTypesList[0].seals.numbers = [10];
        isolatedScope.numberOfSeals = 10;
        isolatedScope.addSealsSequentially();
        expect(scope.sealTypesList[0].seals.numbers).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
      });

    });

    describe('The showClearButton method,', function() {

      beforeEach(inject(function() {
        spyOn(isolatedScope, 'showClearButton').and.callThrough();
      }));

      it('should define method', function() {
        expect(isolatedScope.showClearButton).toBeDefined();
      });

      it('should return true and show button', function() {
        scope.sealTypesList[0].seals.numbers = [5, 3, 4, 1];
        expect(isolatedScope.showClearButton).toBeTruthy();
      });

    });

    describe('The clearSeals method,', function() {

      beforeEach(inject(function() {
        spyOn(isolatedScope, 'clearSeals').and.callThrough();
      }));

      it('should define method', function() {
        expect(isolatedScope.clearSeals).toBeDefined();
      });

      it('should clearSeals model', function() {
        scope.sealTypesList[0].seals.numbers = [5, 3, 4, 1];
        isolatedScope.clearSeals();
        expect(scope.sealTypesList[0].seals.numbers).toEqual([]);
      });

    });

  });

});
