sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		datetime: function(value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd HH:mm:ss"
			});

			if (value) {
				//var date = new Date(value);
				var tmp = oDateFormat.format(new Date(value));
				return tmp;
			} else {
				return value;
			}
		},
		truefalseSwitch: function(value) {

			if (value === false || value === "" || value == null) {
				return true;

			} else {
				return false;
			}

		}

	};

});