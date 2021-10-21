# Copyright (c) 2021, sda and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

# def create_journal_entry(self):

# 	accounts = {
# 		"EMI": "EMI - EJ",
# 		"Service": "Service - EJ",
# 		"Others": "Other - EJ"
# 	}

# 	account = accounts.get("EMI", "nothing")

	
# 	journal_entry = frappe.get_doc({
# 			'doctype': 'Journal Entry',
# 		})

# 	journal_entry.append({
# 		"accounts",{
# 			"account": account,
# 			"credit_in_account_currency": self.amount
# 		},
# 		"accounts", {
# 			"account": "EMI - EJ",
# 			"debit_in_account_currency": self.amount
# 		}
# 	})


class Expense(Document):
	pass
	# def before_submit(self):
	# 	create_journal_entry(self)
		
