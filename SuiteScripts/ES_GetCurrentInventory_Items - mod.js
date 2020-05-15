function getItems(objRequest, objResponse) {
  try {
    var stId = objRequest.getParameter('esID');
    var arrSearchResults = E$.search({
      type: 'item',
      search: 'customsearch_es_curr_inv_srch', // [ES] CurrentInventory Search
      filterExp: [
        ["custitem_es_customer", "anyof", stId], "AND",
        ["isinactive", "is", "F"], "AND",
        ["inventorydetail.status", "anyof", "1"], "AND",
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
      var objCurResult = arrSearchResults[i];
      if (i == 0) {
        arrItemsCols = objCurResult.getAllColumns();
      }
      var objLine = {};

      for (var iF = 0; iF < arrItemsCols.length; iF++) {
        var stKey = arrItemsCols[iF].getLabel();

        if (stKey) {
          objLine[stKey] = objCurResult.getValue(arrItemsCols[iF]);
        }
        if (stKey == "Base Price") {
          if (isNaN(parseInt(objCurResult.getValue(arrItemsCols[iF]))) || parseInt(objCurResult.getValue(arrItemsCols[iF])) == 0) {
            objLine[stKey] = "1.00";
          }  //parseFloat(objCurResult.getValue(arrItemsCols[iF])) > 0 ? parseFloat(objCurResult.getValue(arrItemsCols[iF])) : 1;
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
  }
  catch (grg) {
    E$.logDebug('ERR', 'ERR : ' + grg);
  }
  objResponse.setContentType('JSON');
  objResponse.write(JSON.stringify(obj));
}


function getLocations() {
  var columns = new Array();
  columns[0] = new nlobjSearchColumn('name');
  var location = nlapiSearchRecord('location', null, null, columns);
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

