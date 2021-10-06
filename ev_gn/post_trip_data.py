import frappe
import json

@frappe.whitelist()
def post_data(row_array):
    data = json.loads(row_array) #converting string array into json
    array_length = len(data)     #number of rows passed
    for i in array_length:      #creating trip sheet fofr each row
        driver = data[i][0]
        item = data[i][1]
        supplier = data[i][2]
        supplier_site = data[i][3]
        supplier_rate = data[i][4]
        quantity = data[i][5]
        supplier_unit = data[i][6]
        customer_rate_type = data[i][7]
        customer_rate = data[i][8]
        customer_quantity = data[i][9]
        trip_sheet = frappe.get_doc
        ({
            "doctype": "Trip Sheet",
            "vehicle": "",
            "date": "",
            "trip_details":
            {
                "driver": "",
                "item": "",
                "uom": "",
            }
        })
        trip_sheet.insert()
        trip_sheet.submit()
    # print(data[1])
