define('CreateSalesOrders.Collection', ['CreateSalesOrders.Model'

    , 'underscore', 'Backbone', 'Utils'
], function(
    CreateSalesOrdersModel

    , _, Backbone
) {
    'use strict';

    return Backbone.Collection.extend({
        model: CreateSalesOrdersModel

        ,
        initialize: function(response) {



            // this.totalRecordsFound = response.totalRecordsFound;
            // this.recordsPerPage = response.recordsPerPage;

        }

    });
});