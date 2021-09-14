# Copyright (c) 2021, sda and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

				
def create_sales_invoice(self, data):
	sales_invoice = frappe.get_doc({
		"doctype":"Sales Invoice",
		"customer":data.customer,
		"customer_site":data.customer_site,
		"posting_date":self.date,
		"delivery_date":self.date,
		"customer_group":'All Customer Groups',
		"outstanding_amount":data.customer_amount,
		})
	sales_invoice.append("items",{
		"item_code":data.item,
		"qty":data.customer_quantity,
		"stock_uom":'Nos',
		"rate":data.customer_rate,
		"amount":data.customer_amount,
		})
	sales_invoice.submit()

def create_purchase_invoice(self, data):
	purchase_invoice = frappe.get_doc({
		"doctype":"Purchase Invoice",
		"supplier":data.supplier,
		"supplier_site":data.supplier_site,
		"date":self.date,
		"total":data.supplier_amount,
		})
	purchase_invoice.append("items",{
		"item_code":data.item,
		"qty":data.supplier_quantity,
		"rate":data.supplier_rate,
		"amount":data.supplier_amount,
		})
	purchase_invoice.submit()

def create_purchase_invoice_partner(self, data):
	purchase_invoice = frappe.new_doc({
		"doctype":"Purchase Invoice",
		"supplier":data.supplier_partner,
		"supplier_site":data.supplier_site,
		"date":self.date,
		"total":data.supplier_partner_amount,
		})
	purchase_invoice.append("items",{
		"item_code":data.item,
		"qty":data.supplier_partner_quantity,
		"rate":data.supplier_partner_rate,
		"amount":data.supplier_partner_amount,
		})
	purchase_invoice.submit()

class TripSheet(Document):
	def before_submit(self):
		for data in self.trip_details:
			for i in range(data.trip):
				create_sales_invoice(self, data)
				create_purchase_invoice(self, data)
		if data.multiple_supplier == 1:
			create_purchase_invoice_partner(self, data)
