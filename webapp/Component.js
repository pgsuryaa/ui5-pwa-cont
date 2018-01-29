jQuery.sap.require("zpwa_test/artyom");
jQuery.sap.require("zpwa_test/util/ApiAi");
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zpwa_test/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("zpwa_test.Component", {

		// metadata: {
		// 	manifest: "json"
		// },

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		createContent: function() {
			var that=this;
			// create root view
			var oView = sap.ui.view({
				id: "loginView",
				viewName: "zpwa_test.view.loginPage",
				type: "XML",
				viewData: {
					component: this
				}
			});
			this.app = new sap.m.App("appId");
			this.app.addPage(oView);
			oView = sap.ui.view({
				id: "homeView",
				viewName: "zpwa_test.view.homePage",
				type: "XML",
				viewData: {
					component: this
				}
			});
			this.app.addPage(oView);
			oView = sap.ui.view({
				id: "actView",
				viewName: "zpwa_test.view.activitiesPage",
				type: "XML",
				viewData: {
					component: this
				}
			});
			this.app.addPage(oView);
			// set i18n model
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/messageBundle.properties"
			});
			oView.setModel(i18nModel, "i18n");

			//		// Using OData model to connect against a real service
			//		var url = "/proxy/http/<server>:<port>/sap/opu/odata/sap/ZGWSAMPLE_SRV/";
			//		var oModel = new sap.ui.model.odata.ODataModel(url, true, "<user>", "<password>");
			//		oView.setModel(oModel);

			// Using a local model for offline development
			var oModel = new sap.ui.model.json.JSONModel("model/mock.json");
			this.setModel(oModel, "actModel");
			oModel.attachRequestCompleted(function(oData) {
				//console.log(oData);
				//oData.oSource.oData.d.results.sort(that.compare);
			});
			// set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isPhone: jQuery.device.is.phone,
				listMode: (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
				listItemType: (jQuery.device.is.phone) ? "Active" : "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");
			this.setModel(deviceModel, "device");

			// done
			return this.app;
		},
		compare: function(a, b) {
			if (a.StartDate < b.StartDate)
				return -1;
			if (a.StartDate > b.StartDate)
				return 1;
			return 0;
		}
	});
});