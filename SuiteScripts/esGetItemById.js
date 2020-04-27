function getItemById(params) {
    try {
        var returnJson = [];
        var id = params.getParameter('id');
        nlapiLogExecution('debug', 'items', params.getParameter('items'));

        var filter = [new nlobjSearchFilter('internalid', null, 'is', id)];
        var search = nlapiSearchRecord('item', 'customsearch8741', filter, null) || null;

        for (var i = 0; i < search.length && search != null; i++) {
            var columns = search[i].getAllColumns();
            var obj = {};
            obj.internalId = search[i].getText(columns[0]);
            obj.name = search[i].getValue(columns[1]);
            obj.description = search[i].getValue(columns[2]);
            obj.type = search[i].getValue(columns[3]);
            obj.basePrice = search[i].getValue(columns[4]);
            obj.height = search[i].getValue(columns[5]);
            obj.weight = search[i].getValue(columns[6]);
            obj.location = search[i].getValue(columns[7]);
            obj.reorderPoint = search[i].getValue(columns[8]);
            obj.serial = search[i].getValue(columns[9]);
            obj.onHand = search[i].getValue(columns[10]);
            obj.available = search[i].getValue(columns[11]);
            obj.stockUnit = search[i].getValue(columns[12]);
            obj.binNumber = search[i].getValue(columns[13]);
            obj.status = search[i].getValue(columns[14]);
            obj.quantity = search[i].getValue(columns[15]);
            obj.expirationDate = search[i].getValue(columns[16]);
            obj.locationDetails = search[i].getValue(columns[17]);
            obj.locationCommited = search[i].getValue(columns[18]);

            obj.id = search[i].getId();
            returnJson.push(obj);
        };

        var myJson = JSON.stringify(returnJson);

        nlapiLogExecution('debug', 'myJson', myJson);
        response.write(myJson);
    } catch (e) {
        nlapiLogExecution('ERROR', 'ERROR', e);
    }
}
