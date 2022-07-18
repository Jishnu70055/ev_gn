frappe.ui.get_print_settings = function(
	pdf,
	callback,
	letter_head,
	pick_columns
) {
	var print_settings = locals[":Print Settings"]["Print Settings"];

	var default_letter_head =
		locals[":Company"] && frappe.defaults.get_default("company")
			? locals[":Company"][frappe.defaults.get_default("company")]["default_letter_head"]
			: "";

	var columns = [
		{
			fieldtype: "Check",
			fieldname: "with_letter_head",
			label: __("With Letter head"),
            default: "1"
		},
		{
			fieldtype: "Select",
			fieldname: "letter_head",
			label: __("Letter Head"),
			depends_on: "with_letter_head",
			options: Object.keys(frappe.boot.letter_heads),
			default: letter_head || default_letter_head
		},
		{
			fieldtype: "Select",
			fieldname: "orientation",
			label: __("Orientation"),
			options: [
				{ value: "Landscape", label: __("Landscape") },
				{ value: "Portrait", label: __("Portrait") }
			],
			default: "Landscape"
		}
	];
    if (pick_columns) {
		columns.push(
			{
				label: __("Pick Columns"),
				fieldtype: "Check",
				fieldname: "pick_columns"
			},
			{
				label: __("Select Columns"),
				fieldtype: "MultiCheck",
				fieldname: "columns",
				depends_on: "pick_columns",
				columns: 2,
				options: pick_columns.map(df => ({
					label: __(df.label),
					value: df.fieldname
				}))
			}
		);
	}

	return frappe.prompt(
		columns,
		function(data) {
			data = $.extend(print_settings, data);
			if (!data.with_letter_head) {
				data.letter_head = null;
			}
			if (data.letter_head) {
				data.letter_head =
					frappe.boot.letter_heads[print_settings.letter_head];
			}
			callback(data);
		},
		__("Print Settings")
	);
};