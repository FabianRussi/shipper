define('CreateSalesOrders.Model', ['Backbone'], function(
    Backbone
) {
    'use strict';
    debugger;
    ///app/site/hosting/scriptlet.nl?script=customscript_es_get_curr_inv_items&deploy=1&esID=640
    return Backbone.Model.extend({
        urlRoot: 'services/CreateSalesOrders.service.ss'
    });
});