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


    <!--<div data-view="List.Header"></div>-->
    <div class="current-inventory-list-results-container">

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
            {{/if}}
           <!-- <tbody id="" data-view="CreateSalesOrders.List.Items"></tbody>-->
    </div>
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

</section>


{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}