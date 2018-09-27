/* global oServer */

sap.ui.require([], function() {

    "use strict";

    oServer.respondWith("HEAD", /\/api\/v1\/(?:.+)\/(?:.+)/, [200, {
        "Content-Type": "application/json"
    }, ""]);
});