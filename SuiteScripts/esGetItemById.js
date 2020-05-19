/*function getItemById(params) {
    try {
        var returnJson = [];
        var id = params.getParameter('id');
        nlapiLogExecution('debug', 'items', params.getParameter('items'));

        var filter = [new nlobjSearchFilter('internalid', null, 'is', id)];
        var search = nlapiSearchRecord('item', 'customsearch8741', filter, null) || null;
        var json = {
            locations: []
        }

        var search2 = nlapiSearchRecord('item', null, filter, null) || null;

        var item = nlapiLoadRecord(search2[0].getRecordType(), search2[0].getId());
        var lines = item.getLineItemCount('locations')
        var locationObjectReorder = {};

        for (var t = 1; t <= lines; t++) {
            var locationName = item.getLineItemValue('locations', 'location_display', t);
            locationObjectReorder[locationName] = item.getLineItemValue('locations', 'reorderpoint', t);
        }

        for (var i = 0; i < search.length && search != null; i++) {
            var columns = search[i].getAllColumns();
            var obj = {};
            json.id = search[i].getId();
            json.name = search[i].getText(columns[0]);
            json.height = search[i].getValue(columns[1]);
            json.weight = search[i].getValue(columns[2]);
            obj.serial = search[i].getValue(columns[4]);
            obj.invDetLocation = search[i].getText(columns[4]);
            obj.invDetExpirationDate = search[i].getValue(columns[8]);
            obj.available = search[i].getValue(columns[7]);
            obj.invDetQuantityOnHand = search[i].getValue(columns[5]);
            obj.onOrder = search[i].getValue(columns[6]);
            obj.invDetStatus = search[i].getText(columns[9]);
            obj.reorderPoint = locationObjectReorder[search[i].getValue(columns[10])];

            json.locations.push(obj)
        };

        var myJson = JSON.stringify(json);

        nlapiLogExecution('debug', 'myJson', myJson);
        response.write(myJson);
    } catch (e) {
        nlapiLogExecution('ERROR', 'ERROR', e);
    }
}*/
function getItemById(params) {
    try {
        var returnJson = [];
        var id = params.getParameter('id');
        nlapiLogExecution('debug', 'items', params.getParameter('items'));

        var filter = [new nlobjSearchFilter('internalid', null, 'is', id)];
        var searchBin = nlapiSearchRecord('item', 'customsearch8741', filter, null) || null;
        var json = {
            locations: [],
            serials: []
        }
        var ss = nlapiSearchRecord('inventorydetail', 8972, ['item', 'is', id], null)
        if (ss) {
            for (var ii = 0; ii < ss.length; ii++) {
                var columns = ss[ii].getAllColumns();  
              
                    json.serials.push({
                        serial : ss[ii].getText(columns[0]), 
                        expirationdate: ss[ii].getValue(columns[5]), 
                        inventorystatus: ss[ii].getText(columns[2]),
                        location:ss[ii].getText(columns[6]),
                        qtyOnOrder: ss[ii].getValue(columns[7]),
                        qtyIndividual: ss[ii].getValue(columns[3]),
                        qtySum: ss[ii].getValue(columns[8]),
                        qtyAvailable: ss[ii].getValue(columns[9])
                      })
            
                

            }
        }
        var ss = nlapiSearchRecord('item', null, filter, null)
        var item = nlapiLoadRecord(ss[0].getRecordType(), ss[0].getId());
        var lines = item.getLineItemCount('locations')
        var locationObjectReorder = {};

        for (var t = 1; t <= lines; t++) {
            var locationName = item.getLineItemValue('locations', 'location_display', t);
            nlapiLogExecution('DEBUG', 'reorderpoint: === ' + id, item.getLineItemValue('locations', 'reorderpoint', t));
            json.locations.push({
                reorderPoint: item.getLineItemValue('locations', 'reorderpoint', t),
                quantityOnHand: item.getLineItemValue('locations', 'quantityonhand', t),
                quantityAvailable: item.getLineItemValue('locations', 'quantityavailable', t),
                locationName: locationName
            })
        }


        var search = nlapiSearchRecord('item', null, filter, null) || null;
        var item = nlapiLoadRecord(search[0].getRecordType(), search[0].getId());
        json.id = search[0].getId();
        json.name = item.getFieldValue("itemid")
        json.height = item.getFieldValue("custitem_es_height")
        json.weight = item.getFieldValue("weight")
        json.width = item.getFieldValue("custitem_es_depth")
        json.length = item.getFieldValue("custitem_es_length")


        var myJson = JSON.stringify(json);

        nlapiLogExecution('debug', 'myJson', myJson);
        response.write(myJson);
    } catch (e) {
        nlapiLogExecution('ERROR', 'ERROR', e);
    }
}