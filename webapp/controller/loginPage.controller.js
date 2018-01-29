sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("zpwa_test.controller.loginPage", {
	onLoginPressed:function(oEvent){
		this.app= sap.ui.getCore().byId("appId");
		var username=this.getView().byId('unameId').getValue();
		var password=this.getView().byId('passId').getValue();
		if(username==="")
		this.getView().byId("unameId").setValueState(sap.ui.core.ValueState.Error);
		if(password==="")
		this.getView().byId("passId").setValueState(sap.ui.core.ValueState.Error);
		
		if(username!=""&&password!=""){
			this.app.username=username;
			this.app.password=password;
			this.app.to("homeView");
			this.getView().byId('unameId').setValue("");
			this.getView().byId('passId').setValue("");
		}
	}

	});

});