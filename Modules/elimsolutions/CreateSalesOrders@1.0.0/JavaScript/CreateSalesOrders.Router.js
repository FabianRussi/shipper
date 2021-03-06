define('CreateSalesOrders.Router', ['CreateSalesOrders.List.View', 'Profile.Model', 'CreateSalesOrders.Model', 'Backbone', 'Utils'], function(
    CreateSalesOrdersListView, ProfileModel, CreateSalesOrdersModel, Backbone, Utils
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'create-order': 'GetFilteredResults'
        }

        ,
        initialize: function(application) {
            this.application = application;
            this.collection = new Backbone.Collection( JSON.parse(ProfileModel.getInstance().get('currentinventory')[2].value ));// ProfileModel.getInstance().get('currentinventory');
            this.addresses = ProfileModel.getInstance().get('addresses');
            this.customerId = ProfileModel.getInstance().id;

        },

        createFilteredResults: function(val) {
            var value = val;
            if(this.collection.length === 0)return [];
            var origonalArr = this.collection.models[0].attributes.records.slice();
            var arrFiltered = [];
            if (!value) {
                // console.log("createFilteredResults 1");
                return origonalArr;
            }
            if (value) {
                for (var i = 0; i < origonalArr.length; i++) {
                    var line = origonalArr[i];
                    if (!(line.Name == null || line.Name == undefined || line.Name == "") || !(line.Description == null || line.Description == undefined || line.Description == "")) {
                        if (line.Name.toLowerCase().indexOf(value.toLowerCase()) > -1 || line.Description.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                            arrFiltered.push(line);
                        }
                    } else {
                        console.log("Line NAME at pos " + i + " was empty");
                    }
                }
                return arrFiltered;
            }
        },
        GetFilteredResults: function(options) {
            options = (options) ? Utils.parseUrlOptions(options) : { page: 1 };
            options.page = options.page || 1;
            options.srch = options.srch || '';

            var filteredResults = this.createFilteredResults(options.srch);
            var view = new CreateSalesOrdersListView({
                application: this.application,
                collection: this.collection,
                addresses: this.addresses,
                customerId: this.customerId,
                options: filteredResults
            });
            this.collection.on('reset', view.showContent, view);
            view.showContent();
        }
    });
});