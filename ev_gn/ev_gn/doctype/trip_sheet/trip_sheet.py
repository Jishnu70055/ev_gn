# Copyright (c) 2021, sda and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class TripSheet(Document):
	def before_submit(self):
		trip_sheet = frappe.get_doc("Trip Sheet" ,self.name)
		for data in trip_sheet.trip_details:
			sales_invoice = frappe.new_doc("Sales Invoice")
			sales_invoice.update({
				"doctype":"Sales Invoice",
				"customer":data.customer,
				"customer_site":data.customer_site,
				"is_pos":0,
				"is_return":0,
				"posting_date":self.date,
				"delivery_date":self.date,
				"customer_group":'All Customer Groups',
				"update_stock":0,
				"outstanding_amount":data.customer_amount,
				# "sales_partner":so['sales_partner'],
				# "customer_name":so['customer_name'],
				# "delivery_instructions":so['delivery_instructions'],
				# "company":so['company'],
				# "customer_address":so['customer_address'],
				# "address_display":so['address_display'],
				# "territory":so['territory'],
				# "apply_discount_on":so['apply_discount_on'],
				# "base_discount_amount":flt(so['base_discount_amount']),
				# "additional_discount_percentage":flt(so['additional_discount_percentage']),
				# "discount_amount":flt(so['discount_amount'])
				})
			sales_invoice.append("items",{
				#"doctype":"Sales Invoice Item",
				"item_code":data.item,
				"qty":data.customer_quantity,
				"stock_uom":'Nos',
				"rate":data.customer_rate,
				"amount":data.customer_amount,
				# "item_name":x['item_name'],
				# "description":x['description'],
				# "base_rate":flt(x['base_rate']),
				# "base_amount":flt(x['base_amount']),
				# "income_account":x['income_account'],
				# "cost_center":flt(x['selling_cost_center']),
				# "warehouse":x['warehouse'],
				})
			sales_invoice.set_missing_values()
			sales_invoice.save()
			sales_invoice.submit()
    		# sales_invoice.flags.ignore_permissions = 1



			purchase_invoice = frappe.new_doc("Purchase Invoice")
			purchase_invoice.update({
				"doctype":"Purchase Invoice",
				"supplier":data.supplier,
				"supplier_site":data.supplier_site,
				"date":self.date,
				"total":data.supplier_amount,
				})
			purchase_invoice.append("items",{
				#"doctype":"Sales Invoice Item",
				"item_code":data.item,
				"qty":data.supplier_quantity,
				"rate":data.supplier_rate,
				"amount":data.supplier_amount,
				})
			purchase_invoice.set_missing_values()
			purchase_invoice.save()
			purchase_invoice.submit()
    		# sales_invoice.flags.ignore_permissions = 1
			
			
			
			
			
			
			
			
			
			# sales_invoice = frappe.new_doc("Sales Invoice")
			# sales_invoice.date = self.date
			# sales_invoice.payment_due_date = self.date
			# sales_invoice.customer = data.customer
			# sales_invoice.customer_site = data.customer_site
			# sales_invoice.append('Items',{'item_code':data.item ,'quantity':float(data.customer_quantity),'rate':data.customer_rate,'amount':data.customer_amount ,'uom':'Nos'})
			# sales_invoice.debit_to = 'Debtors - E'
			# sales_invoice.save()
			# purchase_invoice = frappe.new_doc("Purchase Invoice")
			# purchase_invoice.date = self.date
			# purchase_invoice.payment_due_date = self.date
			# purchase_invoice.supplier = data.supplier
			# purchase_invoice.supplier_site = data.supplier_site
			# purchase_invoice.append('Items',{'item_code':data.item ,'accepted_qty':float(data.supplier_quantity),'rate':float(data.supplier_rate),'amount':float(data.supplier_amount)})
			# purchase_invoice.set_missing_values()
			# purchase_invoice.save()
			
			
			
		
