{{log this}}

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
    {{!--     <header class="current-inventory-list-header">
        <h2>{{Title}}</h2>
    </header> --}}

    {{!--   <input type="text" placeholder="search for an item..." class="form-control curr-inv-srch" data-type="curr-inv-srch"
        id="currInv" value="{{searchFilterValue}}" autofocus />
    <button class="btn btn-lg btn-primary goSearch" data-type="goSearch">Search Items</button> --}}

    <div data-view="List.Header"></div>
    {{!--     <div class="current-inventory-list-results-container">
        {{#if collectionLength}}

        <table class="current-inventory-list-current-inventorys-table">
            <thead class="current-inventory-list-content-table">
                <tr class="current-inventory-list-content-table-header-row">
                    <th class="current-inventory-list-content-table-header-row-title">
                        <span>{{translate 'Name'}}</span>
                    </th>
                    <th class="current-inventory-list-content-table-header-row-request-date">
                        <span>{{translate 'Description'}}</span>
                    </th>
                    <th class="current-inventory-list-content-table-header-row-expiration-date">
                        <span>{{translate 'Available Quantity'}}</span>
                    </th>
                    <th class="current-inventory-list-content-table-header-row-currency">
                        <span>{{translate 'On Hand Quantity'}}</span>
                    </th>
                    <th class="current-inventory-list-content-table-header-row-status">
                        <span>{{translate 'Committed Quantity'}}</span>
                    </th>
                </tr>
            </thead>
            <tbody id="curInv" data-view="CurrentInventory.List.Items"></tbody>
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
    </div> --}}
    {{#if showPagination}}
    <div class="current-inventory-list-case-list-paginator">
        <div data-view="GlobalViews.Pagination"></div>
        {{#if showCurrentPage}}
        <div data-view="GlobalViews.ShowCurrentPage"></div>
        {{/if}}
    </div>
    {{/if}}
</section>

{{!-- <h3>ID:: {{model.id}}</h3> --}}

<div class="container">
    <div class="row">
        <div class="col-xs-3">
            <div style="width: 100%; height: 100%; background: gray;"></div>
        </div>
        <div class="col-xs-9">
            <h4>{{Title}}</h4>
            {{!-- <br />
            Item Description: {{model.description}} --}}
            <br />
            Height: {{model.height}}
            <br />
            Length: {{model.type}}
            <br />
            Weight: {{model.weight}}
        </div>
    </div>
</div>

<br />

<div class="container">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Location</th>
                <th>Quantity on Hand</th>
                <th>Lot Numbers</th>
                <th>Expiration Date</th>
                <th>Reorder Point</th>
                <th>Quantity On Order</th>
                <th>Quantity Available</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {{#each model.locations}}
            <tr>
                <td>{{invDetLocation}}</td>
                <td>{{invDetQuantityOnHand}}</td>
                <td>{{serial}}</td>
                <td>{{invDetExpirationDate}}</td>
                <td>{{reorderPoint}}</td>
                <td>{{onOrder}}</td>
                <td>{{available}}</td>
                <td>{{invDetStatus}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>

    {{!-- <div class="row">
        <div class="col-xs-6">
            Location: {{location}}
            <br />
            Quantity on Hand: {{quantity}}
            <br />
            Lot Numbers:
            <br />
            Expiration Date: {{expirationDate}}
        </div>
        <div class="col-xs-6">
            Quantity Available: {{available}}
            <br />
            Status:
            <br />
            Reorder Point: {{reorderPoint}}
            <br />
            Quantity on Order:
        </div>
    </div> --}}
    {{!-- <br /> --}}
    {{!-- {{/each}} --}}
</div>

{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}