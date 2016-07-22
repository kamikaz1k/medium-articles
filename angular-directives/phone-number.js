app.directive("phoneNumber", function () {
    
    return {
        restrict: "E",
        require: "ngModel",
        scope: {
            parentModel: "=ngModel",
            countryCode: "=",
            required: "=ngRequired",
            template: "phone-number.html"
        }.
        link: function postLink (scope, element, attributes, ngModelCtrl) {

            var directiveUpdate = false;

            // Initialize internal data model
            scope.phone = {
                countryCode: "1",
                areaCode: "",
                phoneOne: "",
                phoneTwo: "",
                international: ""
            }

            // Populate internal model with data from parent model
            if (scope.parentModel) {
                splitModel();
            }

            // Step 2.
            // Set watcher on parentModel so that internal model is updated
            scope.$watch("parentModel", function () {
                splitModel();
            });

            // Step 3.
            scope.validateInput = validateInput;

            function validateInput(fieldId) {

                var phone = scope.phone;

                // Validate input for US/CA Form
                if (/US|CA/.test(scope.countryCode)) {

                    // If all the model values have values, 
                    // then update the parent model
                    if (phone.areaCode && phone.areaCode && 
                        phone.phoneOne && phone.phoneTwo) {

                        ngModelCtrl.$setValidity("validPhone", true);
                        scope.parentModel = phone.countryCode +
                                            phone.areaCode +
                                            phone.phoneOne +
                                            phone.phoneTwo;
                    }
                    // Otherwise the parent model should be emptied because 
                    // the inputs are invalid
                    else {
                        ngModelCtrl.$setValidity("validPhone", false);
                        scope.parentModel = "";
                    }

                }
                // Validate input for International Form
                else {
                    // If the internal model holds a value, 
                    // then update the parent model
                    if (phone.international) {
                        ngModelCtrl.$setValidity("validPhone", true);
                        scope.parentModel = phone.international;
                    }
                    // Otherwise the parent model should be emptied
                    else {
                        ngModelCtrl.$setValidity("validPhone", false);
                        scope.parentModel = "";
                    }
                }

                // Update internal update flag so that splitModel function 
                // knows that it was an internal trigger
                directiveUpdate = true;

                // If areaCode exists, and current focus is on 
                if (phone.areaCode && fieldId === "area") {
                    element.find("#phoneOne").focus();
                }
                else if (phone.phoneOne && fieldId === "one") {
                    element.find("#phoneTwo").focus();
                }

            }

            function splitModel () {
                // If it is a US/CA country then update the dat 
                if (/US|CA/.test(scope.countryCode) && scope.parentModel) {
                    scope.phone.countryCode = scope.parentModel.substr(0,1);
                    scope.phone.areaCode = scope.parentModel.substr(1,3);
                    scope.phone.phoneOne = scope.parentModel.substr(4,3);
                    scope.phone.phoneTwo = scope.parentModel.substr(7,10);
                }
                // IF it is international, then update international model
                else if (scope.parentModel) {
                    scope.phoneNumber.international = scope.parentModel;
                }
                // If parentModel has no value 
                // check if the model was updated by the directive
                // If it was, then don't clear the internal model
                else if (!directiveUpdate) {
                    scope.phone.countryCode = "1";
                    scope.phone.areaCode = "";
                    scope.phone.phoneOne = "";
                    scope.phone.phoneTwo = "";
                    scope.phone.international = "";
                }

                // Reset the directive update flag
                directiveUpdate = false;

                return;
            }
        }
    }
});