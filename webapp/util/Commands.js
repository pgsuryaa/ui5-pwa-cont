jQuery.sap.declare("sap.ui.demo.myFiori.util.Commands");
sap.ui.demo.myFiori.util.Commands = {

	forMasterPage : function(that) {
		var forMaster = [ {
				smart : true,
				indexes : [ "ok fiori search *","ok fury search *" ], 
				action : function(i, wildcard) { 
					artyom.say("Searching");
					that.getView().byId("iSearchOrders").setValue(wildcard);
					that.handleSearch();
				}
			}, {
				indexes : [ "ok fiori select accounts","ok fury select accounts", 
				            "ok fiori select contact persons","ok fury select contact persons" ],
				action : function(i) {
					if (i == 0||i==1) {
						that.getView().byId("btn1").firePress();
					} else {
						that.getView().byId("btn2").firePress();
					}
			}
			}, {
				indexes : [ "ok fiori clear search", "ok fiori cancel search",
				            "ok fury clear search", "ok fury cancel search"],
				action : function(i) {
					that.getView().byId("iSearchOrders").setValue("");
					that.handleSearch();
			}
			}, {
				indexes : [ "ok fiori create account", "ok fiori create new account",
				            "ok fury create account", "ok fury create new account"],
				action : function(i) {
					that.createAccountPressed();
			}
		}

		];
		artyom.addCommands(forMaster);
	},

	forDetailPage : function(that) {
		var forSaveClose1=[
		                   {
			indexes : [ "ok fiori close", "ok fiori close fragment", "ok fiori cancel",
			            "ok fury close", "ok fury close fragment", "ok fury cancel"],
			action : function(i) {
				if(that._oDialogCr)
					{
					that.closeLCrPressed();
					}
				else if(that.getView().getId()=="CreateServiceReq")
					{
					that.handle2NavButtonPressed();
					}
				else{
					that.closePressed();
				}
			}
		},
		{
			indexes : [ "ok fiori save it", "ok fiori save details","ok fiori save",
			            "ok fury save it", "ok fury save details","ok fury save"],
			action : function(i) {
				if(that._oDialogCr){
				that.saveCpCrPressed();
				}
				else{
					that.savebtnPressed();
				}
				}
			
		},]
		var forAccDetails=[{
			indexes : [ "ok fiori edit account details",
			            "ok fury edit account details",],
			action : function(i) {
				that.getView().byId("iIconTabBar1").setSelectedKey(
				"1");
					that.editPressed();
				}
		},
		
		{
			indexes : [ "ok fiori create contanct person","ok fiori create new contact person",
			            "ok fiori create a new contact person","ok fiori create a contact person",
			            "ok fury create contanct person","ok fury create new contact person",
			            "ok fury create a new contact person","ok fury create a contact person"],
			action : function(i) {
					that.addContactPressed();
				}
			
		}
		];
		var forDetail = [
		    {
				indexes : [ "ok fiori select account details",
							"ok fiori open account details",
							"ok fiori select interaction history",
							"ok fiori open interaction history",
							"ok fiori select service request", "ok fiori open service request",
							"ok fury select account details",
							"ok fury open account details",
							"ok fury select interaction history",
							"ok fury open interaction history",
							"ok fury select service request", "ok fury open service request"],
					// execution of the command
				action : function(i) {
						if (i == 0 || i == 1) {
							that.getView().byId("iIconTabBar1").setSelectedKey(
									"1");
							artyom.addCommands(forSaveClose1);
							artyom.addCommands(forAccDetails);
							
						} else if (i == 2 || i == 3) {
							artyom.removeCommands(forAccDetails);
							that.getView().byId("iIconTabBar1").setSelectedKey(
									"2");
						} else {
							artyom.removeCommands(forAccDetails);

							that.getView().byId("iIconTabBar1").setSelectedKey(
									"4");
						}
					}

			},
			{
				indexes : [ "ok fiori create service request",
							"ok fiori create new service request",
							"ok fury create a service request",
							"ok fury create service request",
							"ok fury create new service request",
							"ok fury create a service request"],
				action : function(i) {
						that.handleCreatePress();
					}
				},
				{
					indexes: ["ok fiori cancel call", "ok fiori reject call",
					          "ok fury cancel call", "ok fury reject call"],
					action: function(){
						that.declinePressed();
					}
				},
				{
					indexes: ["ok fiori go to homepage", "ok fiori move to homepage",
					          "ok fury go to homepage", "ok fury move to homepage"],
					action: function(){
						that.homePressed();
					}
				}];
		
		artyom.addCommands(forDetail);
	},
	forCreReqPage : function(that) {
		var forCreReq = [

		{
			// smart : true,
			indexes : [ "ok fiori select details", "ok fiori open details", "ok fiori move to details",
					"ok fiori select notes", "ok fiori open notes", "ok fiori move to notes",
					"ok fiori select attachments", "ok fiori open attachments",
					"ok fiori move to attachments",
					"ok fury select details", "ok fury open details", "ok fury move to details",
					"ok fury select notes", "ok fury open notes", "ok fury move to notes",
					"ok fury select attachments", "ok fury open attachments",
					"ok fury move to attachments" ],
			// execution of the command
			action : function(i) {
				if (i == 0 || i == 1 || i == 2||i==9||i==10||i==11) {
					that.getView().byId("iconTabCR").setSelectedKey("1");
				} else if (i == 3 || i == 4 || i == 5||i == 12 || i == 13 || i == 14) {
					that.getView().byId("iconTabCR").setSelectedKey("5");
				} else {

					that.getView().byId("iconTabCR").setSelectedKey("6");
				}
			}

		},
		{
			smart: true,
			indexes: ["ok fiori add a note *", "ok fiori create a note *",
			          "ok fiori create a new note *","ok fiori enter log *","ok fiori create a log *",
			          "ok fury create log *","ok fury create a new log *",
			          "ok fury add a note *", "ok fury create a note *",
			          "ok fury create a new note *","ok fury enter log *","ok fury create a log *",
			          "ok fury create log *","ok fury create a new log *"],
			action :function(i, wildcard){
				that.getView().byId("noteInput").setValue(wildcard);
			    that.onPostCsr();
			    that.getView().byId("noteInput").setValue("");
			}
		},
		{
			indexes:["ok fiori close serive request creation","ok fiori cancel creation",
			         "ok fury close serive request creation","ok fury cancel creation"],
			action : function(){
				that.handle2NavButtonPressed();
			}
		},
		{
			indexes: ["ok fiori save service request","ok fiori save request",
			          "ok fury save service request","ok fury save request"],
			action:function(){
				that.createSRPressed();
			}
		}];
//		artyom.removeCommands("asdfg");
		artyom.addCommands(forCreReq);
	},
	forCreAccPage : function(that) {
		var forCreAcc = [
				{
					indexes : [ "ok fiori close account creation",
							"ok fiori close creation",
							"ok fury close account creation",
							"ok fury close creation" ],
					action : function(i) {
						that.handle2NavButtonPressed();
					}
				},
				{
					indexes : [ "ok fiori save account",
							"ok fiori save account creation",
							"ok fury save account creation",
							"ok fury save account" ],
					action : function(i) {
						that.onSaveAccountPressed();
					}
				} ];
		artyom.addCommands(forCreAcc);
	}

};