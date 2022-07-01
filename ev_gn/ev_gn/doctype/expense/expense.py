# Copyright (c) 2021, sda and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import datetime

def create_journal_entry(self, credit_account, debit_account):
	journal_entry_supplier = frappe.get_doc({
		'doctype': 'Journal Entry',
		'posting_date': self.date,
		"accounts":[
			{
				"account": credit_account,
				"credit_in_account_currency": self.amount

			},
			{
				"account": debit_account,
				"debit_in_account_currency": self.amount
				
			}
		]
		})
	journal_entry_supplier.insert()
	journal_entry_supplier.submit()

def journal_entry_supplier(self, credit_account, debit_account):
		journal_entry_vehicle = frappe.get_doc({
			'doctype': 'Journal Entry',
			'posting_date': self.date,
			"accounts":[
			{
				"account": credit_account,
				"party_type": "Supplier",
				"party": self.supplier,
				"credit_in_account_currency": self.amount
			},
			{
				"account": debit_account,
				"debit_in_account_currency": self.amount
			}
		]
		})
		journal_entry_vehicle.insert()
		journal_entry_vehicle.submit()



def create_journal_entry_vehicle(self, debit_account):
	vehicle = frappe.get_doc("Vehicle", self.vehicle)
	credit_account = "Vehicle Owners - ET"
	for row in vehicle.vehicle_owner:
		expense_amount = self.amount * row.share_percentage / 100
		journal_entry_vehicle = frappe.get_doc({
			'doctype': 'Journal Entry',
			'posting_date': self.date,
			"accounts":[
			{
				"account": credit_account,
				"party_type": "Supplier",
				"party": row.share_holder,
				"debit_in_account_currency": expense_amount,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - ET"
			},
			{
				"account": debit_account,
				"credit_in_account_currency": expense_amount,
				"vehicle": self.vehicle,
				"cost_center": "Vehicle - ET"
			}
		]
		})
		journal_entry_vehicle.insert()
		journal_entry_vehicle.submit()


class Expense(Document):
	def before_submit(self):
		
		expense_doc = frappe.get_doc('Expense Type', self.expense_type)
		debit_account = expense_doc.expense_account

		bank = frappe.get_doc("Mode of Payment", "Bank")
		bank_account = bank.accounts[0].default_account
		
		if self.paid == 0:
			credit_account = "Creditors - ET"
			journal_entry_supplier(self, credit_account, debit_account)
		else:
			if self.paid_by == "Cash":
				credit_account = "Cash - ET"
			elif self.paid_by == "Bank":
				credit_account = bank_account
			create_journal_entry(self, credit_account, debit_account)


		if self.vehicle:
			create_journal_entry_vehicle(self, debit_account)