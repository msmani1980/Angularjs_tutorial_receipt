Custom Focus
===
Custom Focus  is an attribute only directive that allows the developers to
set the focus to a given form input element.

    $scope.whenOptionalIsSelected = function() {
      return true;
    }

    <input name="optionalField" custom-focus="whenOptionalIsSelected()">
