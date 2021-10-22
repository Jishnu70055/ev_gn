# Copyright (c) 2021, sda and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import datetime

def create_journal_entry(self):

	accounts = {
		"EMI": "EMI - EJ",
		"Service": "Service - EJ",
		"Others": "Other - EJ",
		"Salary": "Salary - EJ"
	}

	account = accounts.get(self.expense_type, "Other - EJ")
	account2 = "Cash - EJ"

	journal_entry = frappe.get_doc({
			'doctype': 'Journal Entry',
			'posting_date': datetime.today(),
			"accounts":[
			{
				"account": account,
				"credit_in_account_currency": self.amount
			},
			{
				"account": account2,
				"debit_in_account_currency": self.amount
			}
		]
		})

	journal_entry.insert()
	journal_entry.submit()


class Expense(Document):
	def before_submit(self):
		create_journal_entry(self)
		
