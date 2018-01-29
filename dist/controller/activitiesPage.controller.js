sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("zpwa_test.controller.activitiesPage", {

	
			onAfterRendering: function() {
				this.app= sap.ui.getCore().byId("appId");
			},
			
			navBack:function() {
				this.app.back();
			},
			handleRefresh: function(evt) {
			setTimeout(function() {
				this.getView().byId("pullToRefresh2").hide();
				this.getView().getModel("actModel").refresh(); 
			}.bind(this), 500);
		}

		

	});

});