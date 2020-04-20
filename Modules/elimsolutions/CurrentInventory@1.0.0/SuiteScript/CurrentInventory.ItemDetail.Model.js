define('CurrentInventory.ItemDetail.Model', [
    'SC.Model',
    'Application'
], function (SCModel, Application) {
    'use strict';

    return SCModel.extend({
        name: 'CurrentInventoryItemDetail'

        , getInventoryItem: function (id) {
            try {
                // var customerId = this.getCustomerId();
                var url = nlapiResolveURL('SUITELET', 'customscript_getitemid', 'customdeploy_getitemid', true);
                console.log('URL', url);
                var response = nlapiRequestURL(url + '&id=' + id);
                var body = response.getBody();

                return JSON.parse(body);
            } catch (err) {
                console.log('JSONERR', JSON.stringify(err));
            }
        }

    });
});