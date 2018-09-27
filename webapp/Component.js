sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/m/MessageBox",
	"com/OPA5test/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, MessageBox, models,JSONModel) {
	"use strict";

	return UIComponent.extend("com.OPA5test.Component", {

		metadata: {
			manifest: "json"
		},
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
				var xhReq = new XMLHttpRequest();
				xhReq.open("GET", "/sap/ydev_logon?sap-client=002", false);
				xhReq.send(null);
			}
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},
		/**
		 * Show error Message
		 * @public
		 * @override
		 */
		genErrorObject: function(sMessage, sBody) {
			var oError = {};
			oError.message = sMessage;
			oError.response = {};
			oError.response.body = sBody;
			return oError;
		},
		showError: function(oError, headtext) {
			var err = "";
			var head = "";
			head = headtext;

			var sMessage = "",
				sDetails = "",
				oEvent = null,
				oResponse = null;

			if (oError.mParameters !== undefined) {
				oEvent = oError;
				sMessage = oEvent.getParameter("message");
				sDetails = oEvent.getParameter("responseText");
			} else {
				oResponse = oError;
				sMessage = oResponse.message;
				sDetails = oResponse.response.body;
			}

			if (sDetails !== null) {
				if (sDetails.indexOf("<message") > 0) {
					err = $(sDetails).find('message').first().text();
				} else {
					try {
						var errorMessage = JSON.parse(sDetails);
						err = errorMessage.error.message.value;
					} catch (oErr) {
						err = sDetails;
					}
				}
				head = sMessage;
			} else {
				err = sMessage;
			}

			var dialog = new Dialog({
				title: 'Error:' + head,
				type: 'Message',
				content: [
					new Label({
						text: 'Please try to restart your browser. If the error occurs again you can open an Support Message',
						labelFor: 'rejectDialogTextarea'
					}),
					new TextArea('errorTextDialog', {
						width: '100%',
						placeholder: '',
						value: err
					})

				],
				beginButton: new Button({
					text: 'Create Support Message',
					press: function() {
						this.translationBundle = sap.ushell.resources.i18n;
						var oClientContext = sap.ushell.UserActivityLog.getMessageInfo();
						var oSupportTicketService = sap.ushell.Container.getService("SupportTicket"),
							oText = sap.ui.getCore().byId('errorTextDialog'),
							oSupportTicketData = {
								text: oText,
								clientContext: oClientContext
							},
							promise = oSupportTicketService.createTicket(oSupportTicketData);
						promise.done(function() {
							sap.ushell.Container.getService("Message").info(this.translationBundle.getText("supportTicketCreationSuccess"));
						}.bind(this));
						promise.fail(function() {
							sap.ushell.Container.getService("Message").error(this.translationBundle.getText("supportTicketCreationFailed"));
						}.bind(this));
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});

});