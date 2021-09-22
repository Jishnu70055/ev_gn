import frappe

def create(doc, method):
    emp = frappe.get_doc({
        'doctype': 'Employee',
        'first_name': doc.full_name
    })

    emp.insert()
    doc.employee = emp.name
    
