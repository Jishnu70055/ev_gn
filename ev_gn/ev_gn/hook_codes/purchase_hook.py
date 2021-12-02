import frappe

def update_vehicle_owner_ledgers(doc, event):
    if (doc.is_vehicle_purchase == 1):
        for item in doc.items:
            debit_account = item.expense_account
            amount = item.net_amount
            vehicle = frappe.get_doc("Vehicle", doc.vehicle)
            credit_account = "Vehicle Owners - EJ"
            for row in vehicle.vehicle_owner:
                expense_amount = amount * row.share_percentage / 100
                journal_entry_vehicle = frappe.get_doc({
                    'doctype': 'Journal Entry',
                    'posting_date': doc.posting_date,
                    "accounts":[
                    {
                        "account": credit_account,
                        "party_type": "Supplier",
                        "party": row.share_holder,
                        "debit_in_account_currency": expense_amount,
                        "vehicle": doc.vehicle,
                        "cost_center": "Vehicle - EJ"
                    },
                    {
                        "account": debit_account,
                        "credit_in_account_currency": expense_amount,
                        "vehicle": doc.vehicle,
                        "cost_center": "Vehicle - EJ"
                    }
                ]
                })
                journal_entry_vehicle.insert()
                journal_entry_vehicle.submit()