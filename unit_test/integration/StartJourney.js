sap.ui.require([
    "sap/ui/test/opaQunit",
    "com/OPA5test/localService/mockserver",
], function(opaTest, mockserver) {

    "use strict";

    QUnit.module("my/testapp/Start.js");
    opaTest("Start site is build up", function(Given, When, Then) {
        mockserver.init();
        // Arrangements
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "com/OPA5test"
            },
        });
        
        //Actions
        When.onTheStartPage.iLookAtTheScreen();

        // Assertions
        Then.onTheStartPage.theHeaderText("LeaveQuestionaire").and.theUserNameLabel().and.theUserNameInputField().and.thePinLabel().and.thePinInputField().and.theBeginButton();
    });
    
      opaTest("Press Start Button with input", function (Given, When, Then) {

        // Action
        When.onTheStartPage.iEnterAValidUsername().and.iEnterAValidPin().and.iPressAButton("Start", "Begin");
  
        // Assertion
        Then.onTheStartPage.iShouldNavigateToMain();
      });
});