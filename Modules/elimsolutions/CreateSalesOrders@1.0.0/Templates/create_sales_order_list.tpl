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
                    <td data-column="Customer">Customer <br/> <input type="text"></td>
                    <td data-column="Shipping Postal Code">Shipping Postal Code <br/> <input type="text"></td>
                  </tr>
                  <tr>
                    <td data-column="Order Number">Order Number <br/> <input type="text"></td>
                    <td data-column="Shipping Address Line 1">Shipping Address Line 1 <br/> <input type="text"></td>
                  </tr>
                  <tr>
                    <td data-column="Memo">Memo <br/> <input type="text"></td>
                    <td data-column="Shipping Address Line 2">Shipping Address Line 2 <br/> <input type="text"></td>
                  </tr>
                  <tr>
                    <td data-column="Status">Status <br/> <input type="text"></td>
                    <td data-column="Shipping City">Shipping City <br/> <input type="text"></td>
                  </tr>
                  <tr>
                    <td data-column="Tax Code">Tax Code <br/> <input type="text"></td>
                    <td data-column="Shipping Country">Shipping Country <br/> <input type="text"></td>
                  </tr>
                  <tr>
                    <td data-column="Shipping Addressee">Shipping Addressee <br/>
                        <select id="addressee" name="addressee">
                            <option value="address1">address1</option>
                            <option value="address2">address2</option>
                            <option value="address3">address3</option>
                            <option value="address4">address4</option>
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
                <tbody class="border">
                  
                  <tr class="trclass">
                    <td><img src="https://5445214.app.netsuite.com/c.5445214/SSP Applications/eShipper+_5445214/uat/img/eshipper_logo.jpg" alt=""> </td>
                    <td> Item Number 1 <span> Item Number #1</span> </td>
                    <td> <button type="button" class="delete-item">×</button> </td>
                  </tr>
                  <tr class="trclass">
                    <td><img src="https://5445214.app.netsuite.com/c.5445214/SSP Applications/eShipper+_5445214/uat/img/eshipper_logo.jpg" alt=""> </td>
                    <td> Item Number 1 <span> Item Number #1</span> </td>
                    <td> <button type="button" class="delete-item">×</button> </td>
                  </tr>
                  <tr class="trclass">
                    <td><img src="https://5445214.app.netsuite.com/c.5445214/SSP Applications/eShipper+_5445214/uat/img/eshipper_logo.jpg" alt=""> </td>
                    <td> Item Number 1 <span> Item Number #1</span> </td>
                    <td> <button type="button" class="delete-item">×</button> </td>
                  </tr>
                  <tr class="trclass">
                    <td><img src="https://5445214.app.netsuite.com/c.5445214/SSP Applications/eShipper+_5445214/uat/img/eshipper_logo.jpg" alt=""> </td>
                    <td> Item Number 1 <span> Item Number #1</span> </td>
                    <td> <button type="button" class="delete-item">×</button> </td>
                  </tr>
                </tbody>
              </table>
            
              <table style="display:inline-block;">
                <tbody>
                    <tr>
                        <td data-column="Shipping Addressee">Item <br/>
                            {{#if collectionLength}}
                            <select id="addressee" name="addressee">
                                {{#each collection}}
                                <option value={{id}}>{{Name}}</option>
                            {{/each}}
                    </select>
            {{/if}}
                        </td>
                        <td data-column="Order Number">Location <br/> <input type="text"></td>
                        <td data-column="Shipping Address Line 1">Quantity <br/> <input type="text"></td>
                        <td> <button> Add </button></td>
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