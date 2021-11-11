# # Copyright (c) 2021, sda and contributors
# # For license information, please see license.txt

from os import name
import frappe
from frappe.model.document import Document

				
def create_sales_invoice(self, data):
	sales_invoice = frappe.get_doc({
		"doctype":"Sales Invoice",
		"customer":data.customer,
		"site":data.customer_site,
		"posting_date": self.date,
		"customer_group":'All Customer Groups',
		"no_of_trips": data.trip,
		"vehicle_number": self.vehicle,
		"vehicle": self.vehicle,
		"trip_id": self.name
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

def create_expense(data, self):
	expense = frappe.get_doc({
		"doctype": "Expense",
		"expense_type": "Driver Bata",
		"driver": data.driver,
		"vehicle": self.vehicle,	
		"amount": data.bata_rate * data.trip,
		"date": self.date
	})
	expense.insert()
	expense.submit()

def create_frc(self, data):
	frc = frappe.get_doc({
		"doctype": "FRC",
		"vehicle": self.vehicle,
		"amount": data.net_frc * data.trip,
		"date": self.date
	})
	vehicle = frappe.get_doc('Vehicle', self.vehicle)
	for row in vehicle.vehicle_owner:
		frc.append("share_holder_value",{
			'share_holder': row.share_holder,
			'share_percentage': row.share_percentage,
			'share_amount': data.net_frc * row.share_percentage / 100
		})
	frc.submit()

	frc_expense = frappe.get_doc({
		"doctype": "Expense",
		"expense_type": "FRC",
		"driver": data.driver,
		"vehicle": self.vehicle,	
		"amount": data.net_frc * data.trip,
		"date": self.date
	})
	frc_expense.insert()
	frc_expense.submit()

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
			if data.customer_rate_type == "Rent":
				data.customer_rate = data.customer_amount / data.customer_quantity													
			sales_invoice = create_sales_invoice(self, data)
			data.sales_invoice_id = sales_invoice										
			purchase_invoice = create_purchase_invoice(data.supplier, data.supplier_site, data.supplier_rate, data.supplier_quantity, data.supplier_amount, data.trip, self.date, data.item, data.uom, self.vehicle, self.name)	
			data.purchase_invoice_id = purchase_invoice						
			if data.multiple_supplier == 1:																
				purchase_invoice_partner = create_purchase_invoice(data.supplier_partner, data.supplier_site, data.supplier_partner_rate, data.supplier_partner_quantity, data.supplier_partner_amount, data.trip, self.date, data.item, data.uom, self.vehicle, self.name)
				data.partner_purchase_invoice_id = purchase_invoice_partner
			frc = create_frc(self, data)
			if data.paid_amount:															
				amount_paid = data.paid_amount
				payment_mode = data.payment_method
				payment_entry = create_payment_entry(self, data, sales_invoice, amount_paid, payment_mode)
			if data.bata_rate:
				data.bata_rate = data.bata_rate
			elif data.bata_percentage:
				data.bata_rate = data.total * data.bata_percentage / 100
			expense = create_expense(data, self)