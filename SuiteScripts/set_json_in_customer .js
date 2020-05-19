function getItems(objRequest, objResponse) {
    try {

        var customerid = nlapiGetContext().getSetting('SCRIPT', "custscript_customerid");
        nlapiLogExecution('DEBUG', 'customerid', customerid);
        var ss = nlapiSearchRecord('customer', null, [
                ['giveaccess', 'is', 'T'], 'and', ['internalid', 'is', customerid]
            ], null)
            // var ss = nlapiSearchRecord('customer', null, null, null);

        if (!ss) return;
        nlapiLogExecution('DEBUG', ' ss length', ss.length);
        for (var t = 0; t < ss.length; t++) {
            var stId = ss[t].getId();
            if (nlapiGetContext().getRemainingUsage() <= 300) {
                setRecoveryPoint();
                checkGovernance();
            }

            var arrSearchResults = E$.search({
                type: 'item',
                search: 'customsearch_es_curr_inv_srch', // [ES] CurrentInventory Search
                filterExp: [
                    ["custitem_es_customer", "anyof", stId], "AND", ["isinactive", "is", "F"], "AND",
                    // ["inventorydetail.status", "anyof", "1"], "AND",
                    ["type", "anyof", "InvtPart"]
                ],
                getAll: true
            });

            var obj = {
                "page": 1,
                "records": [],
                "totalRecordsFound": 0,
                "recordsPerPage": 20,
                "locations": getLocations(),
                "TaxsCode": getTaxGruops()
            };

            var arrItemsCols = [];
            for (var i = 0; i < arrSearchResults.length; i++) {
                nlapiLogExecution('DEBUG', ' item count', arrSearchResults.length);
                if (nlapiGetContext().getRemainingUsage() <= 300) {
                    setRecoveryPoint();
                    checkGovernance();
                }
                var objCurResult = arrSearchResults[i];
                var myObject = JSON.stringify(objCurResult)
                myObject = JSON.parse(myObject);
                nlapiLogExecution('DEBUG', ' items', JSON.stringify(objCurResult));
                nlapiLogExecution('DEBUG', ' items -id', myObject.columns.internalid.internalid);
                if (i == 0) {
                    arrItemsCols = objCurResult.getAllColumns();
                }
                var objLine = { locationsDetails: [] };

                var item = nlapiLoadRecord('inventoryitem', myObject.columns.internalid.internalid);
                var lines = item.getLineItemCount('locations')
                var locationObjectReorder = {};

                for (var t = 1; t <= lines; t++) {
                    var locationName = item.getLineItemValue('locations', 'location_display', t);
                    // nlapiLogExecution('DEBUG', 'reorderpoint: === '+id, item.getLineItemValue('locations', 'reorderpoint', t));
                    objLine.locationsDetails.push({
                        reorderPoint: item.getLineItemValue('locations', 'reorderpoint', t),
                        quantityOnHand: item.getLineItemValue('locations', 'quantityonhand', t),
                        quantityAvailable: item.getLineItemValue('locations', 'quantityavailable', t),
                        quantityCommited: item.getLineItemValue('locations', 'quantitycommitted', t),
                        locationName: locationName
                    })
                }


                for (var iF = 0; iF < arrItemsCols.length; iF++) {
                    var stKey = arrItemsCols[iF].getLabel();

                    if (stKey) {
                        objLine[stKey] = objCurResult.getValue(arrItemsCols[iF]);
                    }
                    if (stKey == "Base Price") {
                        if (isNaN(parseInt(objCurResult.getValue(arrItemsCols[iF]))) || parseInt(objCurResult.getValue(arrItemsCols[iF])) == 0) {
                            objLine[stKey] = "1.00";
                        } //parseFloat(objCurResult.getValue(arrItemsCols[iF])) > 0 ? parseFloat(objCurResult.getValue(arrItemsCols[iF])) : 1;
                    }

                    if (stKey == "On Hand") {
                        objLine[stKey] = objCurResult.getValue(arrItemsCols[iF]) > 0 ? objCurResult.getValue(arrItemsCols[iF]) : 0;
                    }

                    if (stKey == "Available") {
                        objLine[stKey] = objCurResult.getValue(arrItemsCols[iF]) > 0 ? objCurResult.getValue(arrItemsCols[iF]) : 0;
                    }

                    if (stKey == "Committed") {
                        objLine[stKey] = objCurResult.getValue(arrItemsCols[iF]) > 0 ? objCurResult.getValue(arrItemsCols[iF]) : 0;
                    }

                    if (stKey == "Status") {
                        objLine[stKey] = {
                            "id": objCurResult.getValue(arrItemsCols[iF]),
                            "name": objCurResult.getText(arrItemsCols[iF]) == '- None -' ? 'N/A' : objCurResult.getText(arrItemsCols[iF])
                        }
                    }

                    if (stKey == "Internal ID") {
                        objLine.id = objCurResult.getValue(arrItemsCols[iF]);
                    }
                    if (stKey == "Location") {
                        objLine[stKey] = {
                            "id": objCurResult.getValue(arrItemsCols[iF]),
                            "name": objCurResult.getText(arrItemsCols[iF]) == '- None -' ? 'N/A' : objCurResult.getText(arrItemsCols[iF])
                        }
                        nlapiLogExecution('DEBUG', ' objLine[stKey]', JSON.stringify(objLine[stKey]));
                    }

                    objLine.show = true;
                }
                obj.records.push(objLine);
            }

            obj.totalRecordsFound = obj.records.length;
            nlapiSubmitField("customer", stId, 'custentity_json_store', JSON.stringify(obj))
        }
    } catch (grg) {
        E$.logDebug('ERR', 'ERR : ' + grg);
    }

    // objResponse.setContentType('JSON');
    // objResponse.write(JSON.stringify(obj));
}


function getLocations() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');

    var location = nlapiSearchRecord('location', null, ['isinactive', 'is', 'F'], columns);
    var allLocations = []
    if (location) {
        for (var i = 0; i < location.length; i++) {
            allLocations.push({
                id: location[i].getId(),
                name: location[i].getValue(columns[0])
            })
        }
        nlapiLogExecution('DEBUG', 'allLocations', JSON.stringify(allLocations));
    }


    return allLocations;
}

function getTaxGruops() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('itemid');
    var taxs = nlapiSearchRecord('taxgroup', null, null, columns);
    var allTaxs = []
    if (taxs) {
        for (var i = 0; i < taxs.length; i++) {
            allTaxs.push({
                id: taxs[i].getId(),
                name: taxs[i].getValue(columns[0])
            })
        }
    }

    return allTaxs;
}

function setRecoveryPoint() {
    var state = nlapiSetRecoveryPoint(); //100 point governance
    if (state.status == 'SUCCESS') return; //we successfully create a new recovery point
    if (state.status == 'RESUME') //a recovery point was previously set, we are resuming due to some unforeseen error
    {
        nlapiLogExecution("ERROR", "Resuming script because of " + state.reason + ".  Size = " + state.size);
        handleScriptRecovery();
    } else if (state.status == 'FAILURE') //we failed to create a new recovery point
    {
        nlapiLogExecution("ERROR", "Failed to create recovery point. Reason = " + state.reason + " / Size = " + state.size);
        handleRecoveryFailure(state);
    }
}

function checkGovernance() {
    var context = nlapiGetContext();
    var state = nlapiYieldScript();

    if (state.status == 'FAILURE') {
        nlapiLogExecution("ERROR", "Failed to yield script, exiting: Reason = " + state.reason + " / Size = " + state.size);
        throw "Failed to yield script";
    } else if (state.status == 'RESUME') {
        nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason + ".  Size = " + state.size);
    }
    // state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield

}

function handleRecoverFailure(failure) {
    if (failure.reason == 'SS_MAJOR_RELEASE') throw "Major Update of NetSuite in progress, shutting down all processes";
    if (failure.reason == 'SS_CANCELLED') throw "Script Cancelled due to UI interaction";
    if (failure.reason == 'SS_EXCESSIVE_MEMORY_FOOTPRINT') { cleanUpMemory();
        setRecoveryPoint(); } //avoid infinite loop
    if (failure.reason == 'SS_DISALLOWED_OBJECT_REFERENCE') throw "Could not set recovery point because of a reference to a non-recoverable object: " + failure.information;
}