<style>
    tbody#curInv td.recordviews-title a.recordviews-title-anchor {
        color: #000;
        font-weight: 100;
        cursor: pointer;
        position: relative;
        z-index: 9999;
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
        <h2>{{Title}}</h2>
    </header>

    <input type="text" placeholder="Search for an item" class="form-control curr-inv-srch" data-type="curr-inv-srch"
        id="currInv" value="{{searchFilterValue}}" autofocus />
    <button class="btn btn-lg btn-primary goSearch" data-type="goSearch">Search Items</button>

    <div data-view="List.Header"></div>
    <div class="current-inventory-list-results-container">

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
                    <th class="current-inventory-list-content-table-header-row-status">
                        <span>{{translate 'Committed Quantity'}}</span>
                    </th>
                    <th class="current-inventory-list-content-table-header-row-currency">
                        <span>{{translate 'On Hand Quantity'}}</span>
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
    </div>
    {{#if showPagination}}
    <div class="current-inventory-list-case-list-paginator">
        <div data-view="GlobalViews.Pagination"></div>
        {{#if showCurrentPage}}
        <div data-view="GlobalViews.ShowCurrentPage"></div>
        {{/if}}
    </div>
    {{/if}}
</section>


{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}