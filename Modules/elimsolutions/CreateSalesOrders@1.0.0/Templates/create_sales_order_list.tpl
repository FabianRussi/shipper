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





<section class="current-inventory-list">

    <header class="current-inventory-list-header">
        <h2>{{Title}}</h2>
    </header>


    <div class="modal-body">

        <table style="display:inline-block;">
            <tbody>
                <tr>
                    <td data-column="Customer">Customer <br /> <input type="text"></td>
                    <td data-column="Shipping Postal Code">Shipping Postal Code <br /> <input type="text"></td>
                </tr>
                <tr>
                    <td data-column="Order Number">Order Number <br /> <input type="text"></td>
                    <td data-column="Shipping Address Line 1">Shipping Address Line 1 <br /> <input type="text"></td>
                </tr>
                <tr>
                    <td data-column="Memo">Memo <br /> <input type="text"></td>
                    <td data-column="Shipping Address Line 2">Shipping Address Line 2 <br /> <input type="text"></td>
                </tr>
                <tr>
                    <td data-column="Status">Status <br /> <input disabled placeholder="Pending Approval" type="text"></td>
                    <td data-column="Shipping City">Shipping City <br /> <input type="text"></td>
                </tr>
            
                <tr>
                    <td data-column="Shipping Addressee">Shipping Addressee <br />
                        <select id="addressesee" name="addressesee">
                            <option value="address0"></option>
                            {{#if addresses}}
                            {{log addresses}}
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

        <table id="item-table">
            <thead>
                <tr id="table-header">
                    <th colspan="3"> Items Added </th>
                </tr>
            </thead>
            <tbody id="table-summary" class="border">

            </tbody>
        </table>

        <table style="display:inline-block;">
            <tbody>
                <tr>
                    <td data-column="Shipping Addressee">Item <br />
                        {{#if collectionLength}}
                            <select id="items" name="addressee">
                            <option value=""></option>
                                {{#each collection}}
                                    <option value={{id}}>{{Name}}</option>
                                {{/each}}
                            </select>
                        {{/if}}
                    </td>
                    <td data-column="Order Number">Location <br /> 
                  
                            <select id="locations" name="locations">
                            <option value=""></option>
                                {{#each locations}}
                                    <option value={{id}}>{{name}}</option>
                                {{/each}}
                            </select>
                      
                    </td>
                    <td data-column="Order Number">Tax Code <br /> 
                  
                            <select id="taxcode" name="taxcode">
                            <option value=""></option>
                                {{#each taxcode}}
                                    <option value={{id}}>{{name}}</option>
                                {{/each}}
                            </select>
                      
                    </td>
                     <td data-column="">Amount <br /> <input disabled="" id="amount" value="" type="text"></td>
                    <td data-column="">Quantity <br /> <input id='qty' type="number"></td>
                    <td> <button id="add-items"> Add </button></td>
                </tr>
            </tbody>
        </table>

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