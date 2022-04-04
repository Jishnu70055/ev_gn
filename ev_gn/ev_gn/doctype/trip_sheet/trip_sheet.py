# # Copyright (c) 2021, sda and contributors
# # For license information, please see license.txt

from os import name
import frappe
from frappe.model.document import Document


				
def create_sales_invoice(self, data, gst_template):
	if data.customer_rate_type == 'Rent':
		rent = float(data.customer_rate/data.customer_quantity)
		if gst_template == 'GST 5% - ET':
			charge_type = "On Net Total"
			account_head = "CGST - ET"
			description = "CGST"
			rate = 2.5
			charge_type_2 = "On Net Total"
			account_head_2 = "SGST - ET"
			description_2 = "SGST"
			rate_2 = 2.5
			sales_invoice = frappe.get_doc({
				"doctype":"Sales Invoice",
				"naming_series" : "SRET-.YY.-",
				"customer":data.customer,
				"site":data.customer_site,
				"trip_entry_date" : self.date ,
				"customer_group":'All Customer Groups',
				"no_of_trips": data.trip,
				"vehicle_number": self.vehicle,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - ET",
				"trip_id": self.name,
				"taxes_and_charges": gst_template,
				"bill_of_lading":data.bill_of_lading,
				"invoice_no":data.invoice_no,
				"dispatch_doc_no":data.dispatch_doc_no,
				"taxes": [{
					"charge_type": charge_type,
					"account_head": account_head,
					"description": description,
					"rate": rate
					},
					{
					"charge_type": charge_type_2,
					"account_head": account_head_2,
					"description": description_2,
					"rate": rate_2
					}]
				})
			sales_invoice.append("items",{
				"item_code":data.item,
				"qty": data.trip * data.customer_quantity,
				"uom": data.uom,
				"rate": rent,
				"amount":data.trip * data.customer_amount,
				})
			sales_invoice.save()
			for tax_data in sales_invoice.taxes:
				if tax_data.account_head == "CGST - ET":
					cgst_amount = tax_data.tax_amount
					cgst_rate = tax_data.rate
					cgst_total = tax_data.total
				if tax_data.account_head == "SGST - ET":
					sgst_amount = tax_data.tax_amount
					sgst_rate = tax_data.rate
					sgst_total = tax_data.total	
				
			delivery_challan = frappe.get_doc({
			"doctype":"Delivery Challan",
			"challan_date":sales_invoice.posting_date,
			"customer":data.customer,
			"tax_invoice_number":data.invoice_no,
			"vehicle_number":self.vehicle,
			"site":data.customer_site,
			"total_amount":sales_invoice.base_total,
			"total_tax":sales_invoice.base_total_taxes_and_charges,
			"total_value":sales_invoice.base_rounded_total,
			"sales_taxes_and_charges": [{
					"charge_type": charge_type,
					"account_head": account_head,
					"description": description,
					"rate": rate,
					"tax_amount":cgst_amount,
					"total":cgst_total
					},
					{
					"charge_type": charge_type_2,
					"account_head": account_head_2,
					"description": description_2,
					"rate": rate_2,
					"tax_amount":sgst_amount,
					"total":sgst_total
					}],
			"delivery_challan_item":[{
				"item":data.item,
				"quantity":data.trip * data.customer_quantity,
				"rate":rent,
				"taxable_value":data.trip * data.customer_amount,
				}]		
			})
			delivery_challan.save()
			
			# delivery_challan.append("items_1",{
			# 	"item_code":data.item,
			# 	"qty": data.trip * data.customer_quantity,
			# 	"uom": data.uom,
			# 	"rate": data.customer_rate,
			# 	"amount":data.trip * data.customer_amount,
			# 	})
			# delivery_challan.append("sales_taxes_and_charges": {
			# 		"charge_type": charge_type,
			# 		"account_head": account_head,
			# 		"description": description,
			# 		"rate": rate
			# 		},
			# 		{
			# 		"charge_type": charge_type_2,
			# 		"account_head": account_head_2,
			# 		"description": description_2,
			# 		"rate": rate_2
			# 		})

			delivery_challan.save()
			delivery_challan.challan_no = delivery_challan.name
			delivery_challan.sales_invoice_id = sales_invoice.name
			delivery_challan.save()
			sales_invoice.challan_no = delivery_challan.name
			sales_invoice.submit()
			delivery_challan.submit()
			return sales_invoice.name
		else:
			sales_invoice = frappe.get_doc({
				"doctype":"Sales Invoice",
				"customer":data.customer,
				"site":data.customer_site,
				"trip_entry_date" : self.date ,
				"customer_group":'All Customer Groups',
				"no_of_trips": data.trip,
				"vehicle_number": self.vehicle,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - ET",
				"trip_id": self.name,
				})
			sales_invoice.append("items",{
				"item_code":data.item,
				"qty": data.trip * data.customer_quantity,
				"uom": data.uom,
				"rate": rent,
				"amount":data.trip * data.customer_amount,
				})
			sales_invoice.save()

			sales_invoice.submit()
			return sales_invoice.name
	else :
		if gst_template == 'GST 5% - ET':
			charge_type = "On Net Total"
			account_head = "CGST - ET"
			description = "CGST"
			rate = 2.5
			charge_type_2 = "On Net Total"
			account_head_2 = "SGST - ET"
			description_2 = "SGST"
			rate_2 = 2.5
			sales_invoice = frappe.get_doc({
				"doctype":"Sales Invoice",
				"naming_series" : "SRET-.YY.-",
				"customer":data.customer,
				"site":data.customer_site,
				"trip_entry_date" : self.date ,
				"customer_group":'All Customer Groups',
				"no_of_trips": data.trip,
				"vehicle_number": self.vehicle,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - ET",
				"trip_id": self.name,
				"taxes_and_charges": gst_template,
				"bill_of_lading":data.bill_of_lading,
				"invoice_no":data.invoice_no,
				"dispatch_doc_no":data.dispatch_doc_no,
				"taxes": [{
					"charge_type": charge_type,
					"account_head": account_head,
					"description": description,
					"rate": rate
					},
					{
					"charge_type": charge_type_2,
					"account_head": account_head_2,
					"description": description_2,
					"rate": rate_2
					}]
				})
			sales_invoice.append("items",{
				"item_code":data.item,
				"qty": data.trip * data.customer_quantity,
				"uom": data.uom,
				"rate": data.customer_rate,
				"amount":data.trip * data.customer_amount,
				})
			sales_invoice.save()
			for tax_data in sales_invoice.taxes:
				if tax_data.account_head == "CGST - ET":
					cgst_amount = tax_data.tax_amount
					cgst_rate = tax_data.rate
					cgst_total = tax_data.total
				if tax_data.account_head == "SGST - ET":
					sgst_amount = tax_data.tax_amount
					sgst_rate = tax_data.rate
					sgst_total = tax_data.total	
				
			delivery_challan = frappe.get_doc({
			"doctype":"Delivery Challan",
			"challan_date":sales_invoice.posting_date,
			"customer":data.customer,
			"tax_invoice_number":data.invoice_no,
			"vehicle_number":self.vehicle,
			"site":data.customer_site,
			"total_amount":sales_invoice.base_total,
			"total_tax":sales_invoice.base_total_taxes_and_charges,
			"total_value":sales_invoice.base_rounded_total,
			"sales_taxes_and_charges": [{
					"charge_type": charge_type,
					"account_head": account_head,
					"description": description,
					"rate": rate,
					"tax_amount":cgst_amount,
					"total":cgst_total
					},
					{
					"charge_type": charge_type_2,
					"account_head": account_head_2,
					"description": description_2,
					"rate": rate_2,
					"tax_amount":sgst_amount,
					"total":sgst_total
					}],
			"delivery_challan_item":[{
				"item":data.item,
				"quantity":data.trip * data.customer_quantity,
				"rate":data.customer_rate,
				"taxable_value":data.trip * data.customer_amount,
				}]		
			})
			delivery_challan.save()
			
			# delivery_challan.append("items_1",{
			# 	"item_code":data.item,
			# 	"qty": data.trip * data.customer_quantity,
			# 	"uom": data.uom,
			# 	"rate": data.customer_rate,
			# 	"amount":data.trip * data.customer_amount,
			# 	})
			# delivery_challan.append("sales_taxes_and_charges": {
			# 		"charge_type": charge_type,
			# 		"account_head": account_head,
			# 		"description": description,
			# 		"rate": rate
			# 		},
			# 		{
			# 		"charge_type": charge_type_2,
			# 		"account_head": account_head_2,
			# 		"description": description_2,
			# 		"rate": rate_2
			# 		})

			delivery_challan.save()
			delivery_challan.challan_no = delivery_challan.name
			delivery_challan.sales_invoice_id = sales_invoice.name
			delivery_challan.save()
			sales_invoice.challan_no = delivery_challan.name
			sales_invoice.submit()
			delivery_challan.submit()
			return sales_invoice.name
		else:
			sales_invoice = frappe.get_doc({
				"doctype":"Sales Invoice",
				"customer":data.customer,
				"site":data.customer_site,
				"trip_entry_date" : self.date ,
				"customer_group":'All Customer Groups',
				"no_of_trips": data.trip,
				"vehicle_number": self.vehicle,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - ET",
				"trip_id": self.name,
				})
			sales_invoice.append("items",{
				"item_code":data.item,
				"qty": data.trip * data.customer_quantity,
				"uom": data.uom,
				"rate": data.customer_rate,
				"amount":data.trip * data.customer_amount,
				})
			sales_invoice.save()

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
		"trip_entry_date" : date,
		"vehicle": vehicle,
		"cost_center": "Vehicle - ET",
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
		"paid_to": "Cash - ET",
		"paid_amount": amount,
		"received_amount": amount,
		"vehicle": self.vehicle,
		"cost_center": "Vehicle - ET"
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
	bata_amount = data.bata_amount * data.trip
	driver = frappe.get_doc('Driver',data.driver)
	driver_employee = driver.employee
	if bata_amount != 0 :
		expense = frappe.get_doc({
				'doctype': 'Journal Entry',
				'posting_date': self.date,
				"accounts":[
				{
					"account": "Driver Bata - ET",
					"party_type" : "Employee",
					"party" : driver_employee,
					"credit_in_account_currency": bata_amount,
					"vehicle": self.vehicle,
					"cost_center": "Vehicle - ET"
				},
				{
					"account": "Transit Charge - ET",
					"debit_in_account_currency": bata_amount,
					"vehicle": self.vehicle,
					"cost_center": "Vehicle - ET"
				}
			]
			})
		expense.insert()
		expense.submit()

def calculate_net_balance(self, data):
	vehicle = frappe.get_doc('Vehicle', self.vehicle)
	for row in vehicle.vehicle_owner:
		share_amount_trips = data.net_total * data.trip
		share_amount = share_amount_trips * row.share_percentage / 100
		journal_entry = frappe.get_doc({
			'doctype': 'Journal Entry',
			'posting_date': self.date,
			"accounts":[
			{
				"account": "Cost of Vehicle Rent - ET",
				"debit_in_account_currency": share_amount,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - ET"
			},
			{
				"account": "Vehicle Owners - ET",
				"party_type": "Supplier",
				"party": row.share_holder,
				"credit_in_account_currency": share_amount,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - ET"
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
				gst_template = "GST 5% - ET"
				sales_invoice = create_sales_invoice(self, data, gst_template)
			else:
				gst_template = None
				sales_invoice = create_sales_invoice(self, data, gst_template)
			data.sales_invoice_id = sales_invoice									
			purchase_invoice = create_purchase_invoice(data.supplier, data.supplier_site, data.supplier_rate, data.supplier_quantity, data.supplier_amount, data.trip, self.date, data.item, data.uom, self.vehicle, self.name)	
			data.purchase_invoice_id = purchase_invoice						
			if data.supplier_partner:																
				purchase_invoice_partner = create_purchase_invoice(data.supplier_partner, data.supplier_site, data.supplier_partner_rate, data.supplier_partner_quantity, data.supplier_partner_amount, data.trip, self.date, data.item, data.uom, self.vehicle, self.name)
				data.partner_purchase_invoice_id = purchase_invoice_partner
			if data.paid_amount:															
				amount_paid = data.paid_amount
				payment_mode = data.payment_method
				payment_entry = create_payment_entry(self, data, sales_invoice, amount_paid, payment_mode)
			expense = create_expense(data, self)
			balance = calculate_net_balance(self, data)

			if data.customer_rate_type == 'Rent':
				rent = float(data.customer_rate/data.customer_quantity)
				data.customer_rate = rent

