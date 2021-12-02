# # Copyright (c) 2021, sda and contributors
# # For license information, please see license.txt

from os import name
import frappe
from frappe.model.document import Document

				
def create_sales_invoice(self, data, gst_template):
	sales_invoice = frappe.get_doc({
		"doctype":"Sales Invoice",
		"customer":data.customer,
		"site":data.customer_site,
		"posting_date": self.date,
		"customer_group":'All Customer Groups',
		"no_of_trips": data.trip,
		"vehicle_number": self.vehicle,
		"vehicle": self.vehicle,
		"cost_center": "Vehicle - EJ",
		"trip_id": self.name,
		"taxes_and_charges": gst_template
		})
	sales_invoice.append("items",{
		"item_code":data.item,
		"qty": data.trip * data.customer_quantity,
		"uom": data.uom,
		"rate": data.customer_rate,
		"amount":data.trip * data.customer_amount,
		})
	sales_invoice.submit()	
	return sales_invoice.name

def create_purchase_invoice(supplier, site, rate, quantity, amount, trip, date, item, uom, vehicle, name):
	purchase_invoice = frappe.get_doc({
		"doctype":"Purchase Invoice",
		"supplier": supplier,
		"supplier_site": site,
		"date": date,
		"total": trip * amount,
		"no_of_trips": trip,
		"vehicle": vehicle,
		"cost_center": "Vehicle - EJ",
		"paid_amount": trip * amount,
		"trip_id": name
		})
	purchase_invoice.append("items",{
		"item_code": item,
		"qty":trip * quantity,
		"rate":rate,
		"amount":trip * amount,
		"uom": uom
		})
	purchase_invoice.submit()
	return purchase_invoice.name

def create_payment_entry(self, data, sales_invoice, amount, mode):
	payment_entry = frappe.get_doc({
		"doctype": "Payment Entry",
		"mode_of_payment": mode,
		"party_type": "Customer",
		"party": data.customer,
		"paid_to": "Cash - EJ",
		"paid_amount": amount,
		"received_amount": amount,
		"vehicle": self.vehicle,
		"cost_center": "Vehicle - EJ"
	})

	payment_entry.append("references",{
		"reference_doctype": "Sales Invoice",
		"reference_name": sales_invoice,
		"allocated_amount": amount
	})
	payment_entry.insert()
	payment_entry.submit()
	return payment_entry

def create_expense(data, self):
	expense = frappe.get_doc({
			'doctype': 'Journal Entry',
			'posting_date': self.date,
			"accounts":[
			{
				"account": "Cash - EJ",
				"credit_in_account_currency": data.bata_amount,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - EJ"
			},
			{
				"account": "Driver Bata - EJ",
				"debit_in_account_currency": data.bata_amount,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - EJ"
			}
		]
		})
	expense.insert()
	expense.submit()

def calculate_net_balance(self, data):
	vehicle = frappe.get_doc('Vehicle', self.vehicle)
	for row in vehicle.vehicle_owner:
		share_amount = data.net_total * row.share_percentage / 100
		journal_entry = frappe.get_doc({
			'doctype': 'Journal Entry',
			'posting_date': self.date,
			"accounts":[
			{
				"account": "Cost of Vehicle Rent - EJ",
				"debit_in_account_currency": share_amount,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - EJ"
			},
			{
				"account": "Vehicle Owners - EJ",
				"party_type": "Supplier",
				"party": row.share_holder,
				"credit_in_account_currency": share_amount,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - EJ"
			}
		]
		})

		journal_entry.insert()
		journal_entry.submit()
		
class TripSheet(Document):

	# calculating total balance of vehicle
	def validate(self):
		self.total = 0
		for row in self.trip_details:
			self.total = self.total + row.net_total
			if row.supplier_partner_amount:
				row.total_supplier_amount = row.supplier_partner_amount + row.supplier_amount
		
		

	def before_submit(self):
		for data in self.trip_details:																	
			if data.gst_percentage == 5:
				gst_template = "GST 5% - EJ"
			else:
				gst_template = None
			sales_invoice = create_sales_invoice(self, data, gst_template)
			data.sales_invoice_id = sales_invoice									
			purchase_invoice = create_purchase_invoice(data.supplier, data.supplier_site, data.supplier_rate, data.supplier_quantity, data.supplier_amount, data.trip, self.date, data.item, data.uom, self.vehicle, self.name)	
			data.purchase_invoice_id = purchase_invoice						
			if data.multiple_supplier == 1:																
				purchase_invoice_partner = create_purchase_invoice(data.supplier_partner, data.supplier_site, data.supplier_partner_rate, data.supplier_partner_quantity, data.supplier_partner_amount, data.trip, self.date, data.item, data.uom, self.vehicle, self.name)
				data.partner_purchase_invoice_id = purchase_invoice_partner
			if data.paid_amount:															
				amount_paid = data.paid_amount
				payment_mode = data.payment_method
				payment_entry = create_payment_entry(self, data, sales_invoice, amount_paid, payment_mode)
			expense = create_expense(data, self)
			balance = calculate_net_balance(self, data)