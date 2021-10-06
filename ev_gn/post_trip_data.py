import frappe
import json

from frappe.exceptions import FileAlreadyAttachedException

@frappe.whitelist()
def post_data(row_array):
    total_trips = json.loads(row_array) #converting string array into json
    # array_length = len(data)     #number of rows passed
    for trip in total_trips:     #creating trip sheet fofr each row
        driver = trip[0]
        item = trip[1]
        uom = trip[2]
        supplier = trip[3]
        supplier_site = trip[4]
        supplier_rate = trip[5]
        supplier_quantity = trip[6]
        supplier_amount = trip[7]
        supplier_partner = trip[8]
        partner_rate = trip[9]
        partner_quantity = trip[10]
        partner_amount = trip[11]
        customer = trip[12]
        customer_site = trip[13]
        customer_rate_type = trip[14]
        customer_rate = trip[15]
        customer_quantity = trip[16]
        customer_amount = trip[17]
        paid_amount = trip[18]
        payment_method = trip[19]
        total = trip[20]
        no_of_trips = trip[21]
        bata_rate = trip[22]
        bata_percentage = trip[23]
        frc = trip[24]
        distance = trip[25]
        gst_amount = trip[26]
        net_frc = trip[27]
        net_total = trip[28]

        trip_sheet = frappe.get_doc
        ({
            "doctype": "Trip Sheet",
            "vehicle": "",
            "date": "",
            "trip_details":
            {
                "driver": driver,
                "item": item,
                "uom": uom,
                "supplier": supplier,
                "supplier_rate": supplier_rate,
                "supplier_site": supplier_site,
                "supplier_quantity": supplier_quantity,
                "supplier_amount": supplier_amount,
                "multiple_supplier": 0,                                     # change this value
                "supplier_partner": supplier_partner,
                "supplier_partner_quantity": partner_quantity,
                "supplier_partner_rate": partner_rate,
                "supplier_partner_amount": partner_amount,
                "customer": customer,
                "customer_rate_type": customer_rate_type,
                "customer_quantity": customer_quantity,
                "paid_amount": paid_amount,
                "customer_site": customer_site,
                "customer_rate": customer_rate,
                "customer_amount": customer_amount, 
                "payment_method": payment_method,
                "total": total,
                "trip": no_of_trips, 
                "frc": frc,
                "gst": 1,                                                   #change this value
                "gst_amount": gst_amount,
                "net_frc": net_frc,
                "bata_rate": bata_rate,
                "bata_precentage": bata_percentage,
                "distance": distance,
                "net_total": net_total
            }
        })
        trip_sheet.insert()
        trip_sheet.submit()
# print(data[1])
