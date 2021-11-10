// Copyright (c) 2021, sda and contributors
// For license information, please see license.txt


// frappe.ui.form.on("Trip Details", "supplier_rate", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "supplier_amount", row.supplier_quantity * row.supplier_rate);
// });

// frappe.ui.form.on("Trip Details", "supplier_quantity", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "supplier_amount", row.supplier_quantity * row.supplier_rate);
// });

// frappe.ui.form.on("Trip Details", "supplier_partner_rate", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "supplier_partner_amount", row.supplier_partner_quantity * row.supplier_partner_rate);
// });

// frappe.ui.form.on("Trip Details", "supplier_partner_quantity", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "supplier_partner_amount", row.supplier_partner_quantity * row.supplier_partner_rate);
// });

// frappe.ui.form.on("Trip Details", "customer_quantity", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "customer_amount", row.customer_quantity * row.customer_rate);
// });

// frappe.ui.form.on("Trip Details", "customer_rate", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "customer_amount", row.customer_quantity * row.customer_rate);
// });

// frappe.ui.form.on("Trip Details", "net_frc", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "total", row.customer_amount - row.total_supplier_amount - row.net_frc);
// });

// frappe.ui.form.on("Trip Details", "net_frc", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "total", row.customer_amount - row.total_supplier_amount - row.net_frc);
// });

// frappe.ui.form.on("Trip Details", "bata_rate", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "net_total", row.total - row.bata_rate);
// });

// frappe.ui.form.on("Trip Details", "bata_percentage", function(frm, cdt, cdn)
// {
//     var row = locals[cdt][cdn];
//     frappe.model.set_value(cdt, cdn, "net_total", row.total - row.bata_percentage);
// });

// frappe.ui.form.on("Trip Sheet",  "onload", function(frm)
// {
//     frm.set_query("supplier_site", "trip_details", function(frm,cdt, cdn)
//     {
//         var row = locals[cdt][cdn];
//         return{
//             filters: [["Site", "supplier_owner", "=", row.supplier]]
//         }
//     })
// });