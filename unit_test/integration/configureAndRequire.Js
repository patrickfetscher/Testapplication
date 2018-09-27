/* global QUnit, jQuery, sinon */

var oModuleConfig;// eslint-disable-line no-unused-vars

// Require the testing framework
jQuery.sap.require("sap.ui.qunit.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-coverage");

//KarmaJS might have loaded SinonJS
if (typeof sinon === "undefined") {
    jQuery.sap.require("sap.ui.thirdparty.sinon");
    jQuery.sap.require("sap.ui.thirdparty.sinon-server");
}

jQuery.sap.require("my.testapp.sinon.sinonServer");

/**
 * Delayed start of QUnit or KarmaJS might break.
 * @returns {void}
 */
function checkStart() {// eslint-disable-line no-unused-vars

    "use strict";

    var aModules, i, iLength;

    if (!window["sap-ui-config"] || !window["sap-ui-config"].libs || !sap) {

        setTimeout(checkStart, 500);

        return;
    }

    aModules = window["sap-ui-config"].libs.replace(/sap./g, "").replace(/\s/g, "").split(",");

    for (i = 0, iLength = aModules.length; i < iLength; i++) {

        if ((aModules[i].indexOf(".") !== -1 && !sap[aModules[i].split(".")[0]]) || (aModules[i].indexOf(".") === -1 && !sap[aModules[i]])) {

            setTimeout(checkStart, 500);

            return;
        }
    }

    QUnit.load();
    // QUnit.start();
}

/*
 * This object will be used whenever a module is defined.
 */
oModuleConfig = {

    /**
     * Executed before each test.
     * @returns {void}
     */
    beforeEach: function() {

        "use strict";
    },

    /**
     * Executed after each test.
     * @returns {void}
     */
    afterEach: function() {// eslint-disable-line require-jsdoc/require-jsdoc

        "use strict";

        // Hacks to ensure the component is teared down even in case an element could not be found
        var clock = sinon.useFakeTimers();

        new sap.ui.test.Opa5().iTeardownMyUIComponent();
        sap.ui.test.Opa.emptyQueue();
        clock.tick(1000);
        clock.restore();
    }
};

// Do not auto start, to ensure all components are loaded
QUnit.config.autostart = false;