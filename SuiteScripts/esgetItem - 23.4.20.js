function getItemById(params) {
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
        var lines = item.getLineItemCount('locations');
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
            obj.serial = search[i].getValue(columns[3]);
            obj.invDetLocation = search[i].getText(columns[4]);
            obj.invDetExpirationDate = search[i].getValue(columns[5]);
            obj.available = search[i].getValue(columns[6]);
            obj.invDetQuantityOnHand = search[i].getValue(columns[7]);
            obj.onOrder = search[i].getValue(columns[8]);
            obj.invDetStatus = search[i].getText(columns[9]);

            obj.reorderPoint = locationObjectReorder[search[i].getText(columns[4])];

            json.locations.push(obj)
        };

        var myJson = JSON.stringify(json);

        nlapiLogExecution('debug', 'myJson', myJson);
        response.write(myJson);
    } catch (e) {
        nlapiLogExecution('ERROR', 'ERROR', e);
    }
}
