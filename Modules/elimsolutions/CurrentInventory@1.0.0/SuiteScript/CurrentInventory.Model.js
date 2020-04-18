define('CurrentInventory.Model', [
    'SC.Model',
    'Application'
], function (SCModel, Application) {
    'use strict';

    return SCModel.extend({
        name: 'CurrentInventory'
        , getCustomerId: function () {
            // get id of logged in shopper and set as search criteria
            var customerFields = customer.getFieldValues(['internalid']);
            console.log('Customer Fields', JSON.stringify(customerFields));
            var customerId = customerFields.internalid;
            return customerId;
        }

        , listAll: function () {
            try {
                var customerId = this.getCustomerId();
                //var sb_url = "https://5445214-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=617&deploy=1&compid=5445214_SB1&h=64af2839ca4fe4463c4f&esID="+customerId;
                var url =   "https://5445214.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=853&deploy=1&compid=5445214&h=f953005733f94638f9d5&esID="+customerId;
                console.log('URL' , url);
                var a = {"User-Agent-x": "SuiteScript-Call"};
                var response = nlapiRequestURL(url, null, a, 'GET');
                var body = response.getBody();
                var body = body.replace(/\r?\n|\r/g,'');
                return JSON.parse(body);
            }catch(err){
                console.log('JSONERR', JSON.stringify(err));
            }
        }


    });
});
