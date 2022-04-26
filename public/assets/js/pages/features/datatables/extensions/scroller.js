"use strict";
var KTDatatablesExtensionsScroller = function() {

	var initTable1 = function() {
		var table = $('#kt_datatable');

		// begin first table
		table.DataTable({
			responsive: true,
			ajax:'/purchaseRequestListAjax', 
			deferRender: true,
			scrollY: '500px',
			scrollCollapse: true,
			scroller: true,
			columns: [
				{data: 'RecordID', visible: false},
				{data: 'internalId'},
				{data: 'quantity'},
				{data: 'amount'},
				{data: 'status'},
			
			],
			
		});
	};


	return {

		//main function to initiate the module
		init: function() {
			initTable1();
		}
	};
}();

jQuery(document).ready(function() {
	KTDatatablesExtensionsScroller.init();
});
