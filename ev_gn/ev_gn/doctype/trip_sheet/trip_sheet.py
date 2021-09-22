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
		"uom": data.supplier_unit,
		"rate":data.customer_rate,
		"amount":data.customer_amount,
		})
	sales_invoice.submit()
	return sales_invoice

def create_purchase_invoice(self, data):
	purchase_invoice = frappe.get_doc({
		"doctype":"Purchase Invoice",
		"supplier":data.supplier,
		"supplier_site":data.supplier_site,
		"date":self.date,
		"total":data.supplier_amount
		})
	purchase_invoice.append("items",{
		"item_code":data.item,
		"qty":data.supplier_quantity,
		"rate":data.supplier_rate,
		"amount":data.supplier_amount,
		"uom": data.supplier_unit
		})
	purchase_invoice.submit()
	return purchase_invoice

def create_purchase_invoice_partner(self, data):
	purchase_invoice = frappe.get_doc({
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
		"uom": data.supplier_unit
		})
	purchase_invoice.submit()
	return purchase_invoice

def create_payment_entry(self, data, sales_invoice, amount, mode):
	payment_entry = frappe.get_doc({
		"doctype": "Payment Entry",
		"mode_of_payment": mode,
		"party_type": "Customer",
		"party": data.customer,
		"paid_to": "Cash - EJ",
		"paid_amount": amount,
		"received_amount": amount
	})

	payment_entry.append("references",{
		"reference_doctype": "Sales Invoice",
		"reference_name": sales_invoice,
		"allocated_amount": amount
	})
	payment_entry.insert()
	payment_entry.submit()
	return payment_entry

def expense_claim(bata_amount, emp):
	expense_claim = frappe.get_doc({
		'doctype': 'Expense Claim',
		'employee': emp,
		'expense_approver': 'raheeb@tridz.com',   #change this hardcoded value
		'payable_account': 'Creditors - EJ',
		# 'expenses': {
		# 	'amount': bata_amount,
		# 	'sanctioned_amount': bata_amount
		# }
	})

	expense_claim.append("expenses", {
		"amount": bata_amount
	})

	expense_claim.insert()
	expense_claim.submit()

class TripSheet(Document):
	def before_submit(self):
		for data in self.trip_details:																		#looping through childtable rows
			driver = data.driver
			emp = frappe.db.get_value("Driver", {"name": driver}, ['employee'])
			for i in range(data.trip):																		#code executes to the number of trips taken
				sales_invoice = create_sales_invoice(self, data)											
				purchase_invoice = create_purchase_invoice(self, data)										
				if data.multiple_supplier == 1:																#creating a second supplier for special case
					purchase_invoice_partner = create_purchase_invoice_partner(self, data)
				if data.paid_amount:																		#create payment entry if partial or full payment is made
					amount_paid = data.paid_amount
					payment_mode = data.payment_method
					payment_entry = create_payment_entry(self, data, sales_invoice.name, amount_paid, payment_mode)
				if data.bata_rate:
					bata_amount = data.bata_rate
					expense = expense_claim(bata_amount, emp)
					
					
					
			# if data.gst == 1:
			# 	company = "gst_company"
			# else:
			# 	comppany = "company"
