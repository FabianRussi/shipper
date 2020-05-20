//ES-Create-Sale-Order-SU.js
function saleOrderCreation(param) {


    try {
        var json = param.getParameter("jsonInfoForm");
        nlapiLogExecution('DEBUG', 'json', json);

        var data = dataOrder(json);
        var items = data.items;
        nlapiLogExecution('DEBUG', 'data', JSON.stringify(data));
        var order = nlapiCreateRecord('salesorder' /*, { recordmode: "dynamic" }*/ );
        order.setFieldValue("entity", data.dataOrder.customerId);
        order.setFieldValue("shippingcost", 0);
        order.setFieldValue("subsidiary", "1");
        order.setFieldValue("otherrefnum", data.dataOrder.orderNumber);
        order.setFieldValue("memo", data.dataOrder.memo);
        order.setFieldValue("taxcode", '11');
        order.setFieldValue('initialamount', "0.0");
        order.setFieldValue("orderstatus", "A");


        if (items && items.length > 0) {

            for (var i = 0; i < items.length; i++) {

                nlapiLogExecution('DEBUG', 'items[i]', JSON.stringify(items[i]));
                order.selectNewLineItem("item");
                order.setCurrentLineItemValue("item", "item", items[i].itemid);
                order.setCurrentLineItemValue("item", "quantity", items[i].qty);
                order.setCurrentLineItemValue('item', 'amount', items[i].amount);
                order.setCurrentLineItemValue("item", "location", items[i].locations);
                order.commitLineItem("item");
            }
        }

        if (!data.addresses.addresses) {
            nlapiLogExecution('DEBUG', 'zip', JSON.stringify(data.addresses.postalCode));
            var subrecord = order.createSubrecord('shippingaddress');
            subrecord.setFieldValue("country", data.addresses.country);
            subrecord.setFieldValue("addressee", data.dataOrder.customer);
            subrecord.setFieldValue("addrphone", "");
            subrecord.setFieldValue("addr1", data.addresses.addr1);
            subrecord.setFieldValue("addr2", data.addresses.addr2);
            subrecord.setFieldValue("city", data.addresses.city);
            subrecord.setFieldValue("state", "");
            subrecord.setFieldValue("zip", data.addresses.postalCode);
            subrecord.setFieldValue("defaultshipping", true);
            subrecord.setFieldValue("defaultbilling", false);
            subrecord.setFieldValue("isresidential", false);

            subrecord.commit();
        } else if (data.addresses.addresses) {
            order.setFieldValue("shipaddresslist", data.addresses.addresses);
        }
        order.setFieldValue("custbodyes_so_order_portal", "T");


        var neewResponse = {}
            // nlapiLogExecution('DEBUG', 'orderId', JSON.stringify(order));
        var idOrder = nlapiSubmitRecord(order);
        if (idOrder) var rcd = nlapiLoadRecord('salesorder', idOrder);
        var soNumber = rcd.getFieldValue('tranid');
        neewResponse.idOrder = idOrder;
        neewResponse.soNumber = soNumber;
        nlapiLogExecution('DEBUG', 'response', JSON.stringify(neewResponse));

    } catch (e) {
        nlapiLogExecution('DEBUG', 'Error', JSON.stringify(e));
    }
    neewResponse = JSON.stringify(neewResponse)
    response.write(neewResponse);
}

function dataOrder(jsonInfo) {
    var jsonInfo = JSON.parse(jsonInfo);
    var obj = {};
    var items = [];
    for (var x = 0; x < jsonInfo.length; x++) {
        if (jsonInfo[x].itemid) {
            items.push(jsonInfo[x])
        }
        if (jsonInfo[x].orderNumber || jsonInfo[x].customerId) {
            obj.dataOrder = jsonInfo[x]
        } else {
            obj.addresses = jsonInfo[x]
        }
        obj.items = items;
    }
    nlapiLogExecution('DEBUG', 'obj====', JSON.stringify(obj));
    return obj;
}