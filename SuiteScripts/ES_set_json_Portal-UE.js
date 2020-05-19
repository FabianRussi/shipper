function aftersubmit(type) {
    nlapiLogExecution("DEBUG", "type", type);

    if (type == "edit" || type == "create") {
        try {
            var customerId = nlapiGetFieldValue('id');
            nlapiLogExecution("DEBUG", "internalidnumber", customerId);

            if (customerId) {

                var scriptId = 'customscript_set_json_for_portal';
                var deployId = 'customdeploy1';
                var params = {
                    custscript_customerid: customerId
                }
                var status = nlapiScheduleScript(scriptId, deployId, params);
                nlapiLogExecution("DEBUG", "status", status);
                nlapiLogExecution("DEBUG", "customerId", customerId)

            }
        } catch (e) {
            nlapiLogExecution("DEBUG", "ERROR:aftersubmit", e);
        }
    }

}