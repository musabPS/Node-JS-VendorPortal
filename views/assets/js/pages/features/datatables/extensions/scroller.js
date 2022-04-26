"use strict";
var KTDatatablesExtensionsScroller = function() {

	var initTable1 = function() {
		var table = $('#kt_datatable');

		// begin first table
		table.DataTable({
			responsive: true,
			ajax: 'http://localhost:3000/purchaseRequestListAjax',
			deferRender: true,
			scrollY: '500px',
			scrollCollapse: true,
			scroller: true,
			columns: [
				{data: 'RecordID', visible: false},
				{data: 'OrderID'},
				{data: 'ShipCity'},
				{data: 'ShipAddress'},
				{data: 'CompanyAgent'}, 
				{data: 'CompanyName'},
				{data: 'ShipDate'},
				{data: 'Status'},
				{data: 'Type'},
				{data: 'Actions', visible: false},
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
