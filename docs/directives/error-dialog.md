Error Dialog
===

### Using the form object

Angular allows us to manage forms very easily. All you need to do is to have a form with a name attribute and it will be extended in the angular scope

    <form name="myForm">

Turns into

    $scope.myForm

This is important so that you can access the fields and check their validity. Read more about this > https://docs.angularjs.org/guide/forms

### Naming the form inputs

In order for the form object to know about the inputs, each input will need a *name* and *ng-model* attribute. This will add the input object to the form object and it will be extended in the angular scope

    <input type="text" ng-model="username" name="username" />

Turns into

    $scope.myForm.username

**Best Practice: Use the same identifier for both the name and ng-model.** If you don't name / model the inputs, you will receive an error similar to the one below:

    Error: [ngRepeat:dupes] Duplicates in a repeater are not allowed. Use 'track by' expression to
    specify unique keys. Repeater: error in errorRequired, Duplicate key: string:, Duplicate value:

This is because the *name* attribute on two or more fields are blank. Make each input has an unique *name* attribute per *<form>* element.

### Using the Error Dialog

To use the Error Dialog directive, add the following markup to your view:

    <error-dialog form-object="loginForm" error-response="errorResponse" display="displayError">
     </error-dialog>

Please take note of the 3 required attributes of the directive:

 - *form-object* - This is the form object that will be validated
 - *error-response* - Array of response from the API if there is a failed request
 - *display* - A boolean flag to control display of the dialog

Front end validation is taken care of automatically if you follow the conventions mentioned above. For back end errors, use a snippet of code like this in your API error response handler:

    function handleResponseError(responseFromAPI) {
       hideLoadingModal();
       $scope.errorResponse = responseFromAPI;
       $scope.displayError = true;
    }


### Manually validating fields

In some cases, fields will use directives that impact the form object from validating the field. A developer can manually validate a field by using angular's *$setValidity* method:

    // Set the username field in the loginForm to be marked as required and valid
    $scope.loginForm.username.$setValidity('required', false);

    // Set the username field in the loginForm to be marked as required and invalid (will show in error-dialog)
    $scope.loginForm.username.$setValidity('required', true);

    // Set the username field in the loginForm to check the pattern of the field and is valid
    $scope.loginForm.username.$setValidity('pattern', false);

    // Set the username field in the loginForm to check the pattern of the field and is invalid (will show in error-dialog)
    $scope.loginForm.username.$setValidity('pattern', false);

https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#$setValidity
