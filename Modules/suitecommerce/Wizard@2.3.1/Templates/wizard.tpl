{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showBreadcrumb}}
<header class="wizard-header">
<span class="back-to-customercenter"><a href="https://customercenter.eshipperplus.com/portal/my_account.ssp?sc=6">&#171; Back to Customer Center</a></span>
<br><br>

	<h1 class="wizard-header-title">{{translate 'Checkout'}}</h1>
	<div data-view="Wizard.StepNavigation"></div>
</header>
{{/if}}
<div id="wizard-content" class="wizard-content"></div>



{{!----
Use the following context variables when customizing this template: 
	
	showBreadcrumb (Boolean)

----}}
