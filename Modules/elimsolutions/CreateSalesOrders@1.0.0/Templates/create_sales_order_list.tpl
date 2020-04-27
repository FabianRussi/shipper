<style>
    tbody#curInv td.recordviews-title a.recordviews-title-anchor {
        color: #000;
        font-weight: 100;
        cursor: default;
        position: relative;
    }

    tbody#curInv td.recordviews-title:before {
        background: transparent;
        content: "";
        width: 100%;
        height: 50px;
        position: absolute;
        z-index: 555;
    }
</style>

{{#if showBackToAccount}}
<a href="/" class="reorder-items-list-button-back">
    <i class="reorder-items-list-button-back-icon"></i>
    {{translate 'Back to Account'}}
</a>
{{/if}}

<section class="current-inventory-list">

    <header class="current-inventory-list-header">
        <h2 style="margin-left: 29px">Create New Order</h2>
    </header>

    <div class="container">
        <div class="row">
            <div class="col-xs-6">
                <table style="display:inline-block;">
                    <tbody>
                        <tr>
                            <td data-column="Customer">Customer Name <br /> <input id="customer" type="text"></td>
                            <td data-column="Shipping Postal Code">Shipping Postal Code <br /> <input id="postalCode"
                                    type="text"></td>
                        </tr>
                        <tr>
                            <td data-column="Order Number">Order Number <br /> <input id="orderNumber" type="text"></td>
                            <td data-column="Shipping Address Line 1">Shipping Address Line 1 <br /> <input id="addr1"
                                    type="text"></td>
                        </tr>
                        <tr>
                            <td data-column="Memo">Memo <br /> <input id="memo" type="text"></td>
                            <td data-column="Shipping Address Line 2">Shipping Address Line 2 <br /> <input id="addr2"
                                    type="text"></td>
                        </tr>
                        <tr>
                            <!-- <td data-column="Status">Status <br /> <input disabled placeholder="Pending Approval" type="text"></td> -->
                            <td data-column="Shipping City">Shipping City <br /> <input id="city" type="text"></td>
                        </tr>

                        <tr>
                            <td data-column="Shipping Addressee">Shipping Addressee <br />
                                <select id="addressesee" name="addressesee">
                                    <option value=""></option>
                                    {{#if addresses}}
                                    {{#each addresses}}
                                    {{#if addr1}}
                                    <option value={{internalid}}>{{addr1}}</option>
                                    {{/if}}
                                    {{#if addr2}}
                                    <option value={{internalid}}>{{addr2}}</option>
                                    {{/if}}
                                    {{#if addr3}}
                                    <option value={{internalid}}>{{addr3}}</option>
                                    {{/if}}
                                    {{/each}}

                                    {{/if}}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-xs-5">
                <table id="item-table">
                    <thead>
                        <tr id="table-header">
                            <th colspan="3"> Items Added </th>
                        </tr>
                    </thead>
                    <tbody id="table-summary" class="border">

                    </tbody>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-6">
                <table style="display:inline-block;">
                    <tbody>
                        <tr>
                            <td data-column="Shipping Addressee">Item <br />
                                {{#if collectionLength}}
                                <select id="items" name="addressee" style="
                            font-size: 0.7rem!important;">
                                    <option value=""></option>
                                    {{#each collection}}
                                    <option value={{id}}>{{Name}}</option>
                                    {{/each}}
                                </select>
                                {{/if}}
                            </td>
                            <td data-column="Order Number">Location <br />

                                <select id="locations" name="locations" style="
                            font-size: 0.7rem!important;">
                                    <option value=""></option>
                                    {{#each locations}}
                                    <option value={{id}}>{{name}}</option>
                                    {{/each}}
                                </select>
                            </td>
                            <td style="display:none" data-column="Order Number">Tax Code <br />

                                <select id="taxcode" name="taxcode">
                                    <option value='11'>CA-S-ON</option>
                                </select>

                            </td>
                            <!-- <td   style="display:none" data-column="">Amount <br /> <input disabled="" id="amount" value="" type="text"></td> 
                    <td data-column="">Quantity <br /> <input id='qty' type="number"></td>
                    <td> <button id="add-items"> Add </button></td> -->
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        </td>
                        <td style="display:none" data-column="">Amount <br /> <input disabled="" id="amount" value=""
                                type="text"></td>
                        <td data-column="">Quantity <br /> <input id='qty' type="number"></td>
                        <td> <button id="add-items" class="place-order-btn"> Add </button></td>
                        <td> <button id="place-order" class="place-order-btn">Place Order</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!--<div data-view="List.Header"></div>-->
    <!-- <div class="current-inventory-list-results-container">

        <table class="current-inventory-list-current-inventorys-table">
<label > Items </label>
            {{#if collectionLength}}
                {{log this}}
                <div id="items">
                    <select id="select">
                        <option value=""></option>
                        {{#if collection }}
                            {{#each collection}}
                                <option value={{id}}>{{Name}}</option>
                            {{/each}}
                    </select>
            {{/if}} -->
    <!-- <tbody id="" data-view="CreateSalesOrders.List.Items"></tbody>-->
    <!-- </div>
    </table>


    {{else}}
        {{#if isLoading}}
            <p class="current-inventory-list-empty">{{translate 'Loading...'}}</p>
        {{else}}
            <div class="current-inventory-list-empty-section">
                <h5>{{translate 'No current inventory found'}}</h5>
            </div>
        {{/if}}
        {{/if}}
        </div>

</section> -->

    {{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}