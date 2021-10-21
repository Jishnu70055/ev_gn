# # Copyright (c) 2021, sda and contributors
# # For license information, please see license.txt

import frappe
from frappe.model.document import Document

				
def create_sales_invoice(vehicle, date, data, number_of_trips):
	sales_invoice = frappe.get_doc({
		"doctype":"Sales Invoice",
		"customer":data.customer,
		"site":data.customer_site,
		"posting_date": date,
		"customer_group":'All Customer Groups',
		"no_of_trips": number_of_trips,
		"vehicle_number": vehicle
		})
	sales_invoice.append("items",{
		"item_code":data.item,
		"qty": number_of_trips * data.customer_quantity,
		"uom": data.uom,
		"rate": number_of_trips * data.customer_rate,
		"amount":number_of_trips * data.customer_amount,
		})
	sales_invoice.submit()
	return sales_invoice

def create_purchase_invoice(supplier, site, rate, quantity, amount, trip, date, item, uom):
	purchase_invoice = frappe.get_doc({
		"doctype":"Purchase Invoice",
		"supplier": supplier,
		"supplier_site": site,
		"date": date,
		"total": trip * amount,
		"no_of_trips": trip
		})
	purchase_invoice.append("items",{
		"item_code": item,
		"qty":trip * quantity,
		"rate":trip * rate,
		"amount":trip * amount,
		"uom": uom
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

def create_expense(bata_amount, data, self):
	expense = frappe.get_doc({
		"doctype": "Expense",
		"expense_type": "Driver Bata",
		"driver": data.driver,
		"vehicle": self.vehicle,
		"data": self.date,
		"amount": bata_amount
	})
	expense.insert()
	expense.submit()

def create_frc(self, data):
	frc = frappe.get_doc({
		"doctype": "FRC",
		"vehicle": self.vehicle,
		"amount": data.net_frc,
		"date": self.date
	})
	frc.submit()


class TripSheet(Document):

	# calculating total balance of vehicle
	def validate(self):
		self.total = 0
		for row in self.trip_details:
			self.total = self.total + row.net_total
		
		

	def before_submit(self):
		for data in self.trip_details:																		
			driver = data.driver
			emp = frappe.db.get_value("Driver", {"name": driver}, ['employee'])
			number_of_trips = data.trip																
			sales_invoice = create_sales_invoice(self.vehicle, self.date, data, number_of_trips)											
			purchase_invoice = create_purchase_invoice(data.supplier, data.supplier_site, data.supplier_rate, data.supplier_quantity, data.supplier_amount, data.trip, self.date, data.item, data.uom)	
			frc = create_frc(self, data)									
			if data.multiple_supplier == 1:																
				purchase_invoice_partner = create_purchase_invoice(data.supplier_partner, data.supplier_site, data.supplier_partner_rate, data.supplier_partner_quantity, data.supplier_partner_amount, data.trip, self.date, data.item, data.uom)
			if data.paid_amount:															
				amount_paid = data.paid_amount
				payment_mode = data.payment_method
				payment_entry = create_payment_entry(self, data, sales_invoice.name, amount_paid, payment_mode)
			if data.bata_rate:
				bata_amount = data.bata_rate
			elif data.bata_percentage:
				bata_amount = data.bata_rate
			expense = create_expense(bata_amount, data, self)
					
					
					
# 			# if data.gst == 1:
# 			# 	company = "gst_company"
# 			# else:
# 			# 	comppany = "company"
