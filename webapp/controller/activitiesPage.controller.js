sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("zpwa_test.controller.activitiesPage", {

	
			onAfterRendering: function() {
				 this.app= sap.ui.getCore().byId("appId");
				// var oModel=this.getView().getModel('actModel');
				// oModel.oData.d.results.sort(this.compare);
			},
			
			navBack:function() {
				this.app.back();
			},
			handleRefresh: function(evt) {
			setTimeout(function() {
				this.getView().byId("pullToRefresh2").hide();
				this.getView().getModel("actModel").refresh(); 
			}.bind(this), 500);
		},
		compare: function(a, b) {
			a.StartDate=a.StartDate.replace("/Date(","").replace(")/","");
			b.StartDate=b.StartDate.replace("/Date(","").replace(")/","");
			if (a.StartDate < b.StartDate)
				return -1;
			if (a.StartDate > b.StartDate)
				return 1;
			return 0;
		}
		

	});

});