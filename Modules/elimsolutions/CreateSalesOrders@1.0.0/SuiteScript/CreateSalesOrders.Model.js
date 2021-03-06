define('CreateSalesOrders.Model', [
    'SC.Model',
    'Application'
], function(SCModel, Application) {
    'use strict';

    return SCModel.extend({
        name: 'CreateSalesOrders',
        getCustomerId: function() {
            // get id of logged in shopper and set as search criteria
            var customerFields = customer.getFieldValues(['internalid']);
            console.log('Customer Fields', JSON.stringify(customerFields));
            var customerId = customerFields.internalid;
            return customerId;
        },
        listAll: function() {

            try {
                var customerId = this.getCustomerId();
                var url = "https://5445214.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=853&deploy=1&compid=5445214&h=f953005733f94638f9d5&esID=" + customerId;

                var a = { "User-Agent-x": "SuiteScript-Call" };
                var response = nlapiRequestURL(url, null, a, 'GET');
                var body = response.getBody();
                var body = body.replace(/\r?\n|\r/g, '');

                return JSON.parse(body);

            } catch (err) {
                // console.log('JSONERR', JSON.stringify(err));
            }
        }

    });
});