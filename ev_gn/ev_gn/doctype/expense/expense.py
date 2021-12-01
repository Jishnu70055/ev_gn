# Copyright (c) 2021, sda and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import datetime

def create_journal_entry(self):

	expense_doc = frappe.get_doc('Expense Type', self.expense_type)
	debit_account = expense_doc.expense_account


	if self.vehicle:
		vehicle = frappe.get_doc('Vehicle', self.vehicle)
		for row in vehicle.vehicle_owner:
			expense_amount = self.amount * row.share_percentage / 100
			journal_entry_vehicle = frappe.get_doc({
				'doctype': 'Journal Entry',
				'posting_date': self.date,
				"accounts":[
				{
					"account": "Creditors - EJ",
					"party_type": "Supplier",
					"party": row.share_holder,
					"credit_in_account_currency": expense_amount,
					"vehicle": self.vehicle
				},
				{
					"account": "Cost of Vehicle Rent - EJ",
					"debit_in_account_currency": expense_amount,
					"vehicle": self.vehicle
				}
			]
			})

	journal_entry_vehicle.insert()
	journal_entry_vehicle.submit()


	if self.paid == 0:
		credit_account = "Creditors - EJ"
	else:
		if self.paid_by == "Cash":
			credit_account = "Cash - EJ"
		elif self.paid_by == "Bank":
			credit_account = "Bank - EJ"

	journal_entry = frappe.get_doc({
			'doctype': 'Journal Entry',
			'posting_date': self.date,
			"accounts":[
			{
				"account": credit_account,
				"credit_in_account_currency": self.amount,
				"vehicle": self.vehicle
			},
			{
				"account": debit_account,
				"debit_in_account_currency": self.amount,
				"vehicle": self.vehicle
			}
		]
		})

	journal_entry.insert()
	journal_entry.submit()


class Expense(Document):
	def before_submit(self):
		create_journal_entry(self)