sap.ui.require([
    "sap/ui/test/opaQunit"
], function(opaTest) {

    "use strict";

    QUnit.module("my/testapp/Main.js");
    opaTest("Main site is build up", function(Given, When, Then) {        
        //Actions
        When.onTheMainPage.iLookAtTheScreen();
        // Assertions
        Then.onTheMainPage.iShouldSeeTheProgressIndicator().and.iShouldSeetheHeadDataTable();
    });
});