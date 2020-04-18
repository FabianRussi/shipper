define('CurrentInventory.ItemDetail.Model', [
    'SC.Model',
    'Application'
], function (SCModel, Application) {
    'use strict';

    return SCModel.extend({
        name: 'CurrentInventoryItemDetail'

        , getInventoryItem: function (id) {
            // Specify the record type and the saved search ID
            /*  var searchresults = nlapiSearchRecord('customer', 'customsearch8741', null, null);
 
             for (var i = 0; searchresults != null && i < searchresults.length; i++) {
                 var customerrecord = searchresults[i];
 
                 if (customerrecord.getValue('internalid') == id) {
                     return customerrecord; //.getValue('email');
                 }
             }
             return "Item not found.";
         } */

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
    }

    });
});