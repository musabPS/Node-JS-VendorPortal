"use strict";
// Class definition

var KTDatatableHtmlTableDemo = function() {
    // Private functions

    // demo initializer
    var demo = function() {


		var datatable = $('#kt_datatable').KTDatatable({
			data: {
				saveState: {cookie: false},
			},
			search: {
				input: $('#kt_datatable_search_query'),
				key: 'generalSearch'
			},
		});


        $('#kt_datatable_search_customer').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Customer');
        });

        $('#kt_datatable_search_date').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Date');
        });

		$('#kt_datatable_search_location').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Location');
        });
		$('#kt_datatable_search_soid').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'SO #');
        });
		$('#kt_datatable_search_item').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Item');
        });

        //$('#kt_datatable_search_customer, #kt_datatable_search_type').selectpicker();

    };

    return {
        // Public functions
        init: function() {
            // init dmeo
            demo();
        },
    };
}();

jQuery(document).ready(function() {
	KTDatatableHtmlTableDemo.init();
});
