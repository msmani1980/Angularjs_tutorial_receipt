Error Dialog
===

### Using the form object

Angular allows us to manage forms very easily. All you need to do is to have a form with a name attribute and it will be extended in the angular scope

    <form name="myForm">

Turns into

    $scope.myForm

This is important so that you can access the fields and check their validity. Read more about this > https://docs.angularjs.org/guide/forms

### Naming the form inputs

In order for the form object to know about the inputs, each input will need a name attribute. This will add the input object to the form object and it will be extended in the angular scope

    <input type="text" name="username" />

Turns into

    $scope.myForm.username

Using the Error Dialog

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
    
