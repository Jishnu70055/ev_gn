import frappe
import json

from frappe.exceptions import FileAlreadyAttachedException

@frappe.whitelist()
def post_data():#row_array
    # total_trips = json.loads(row_array) #converting string array into json
    # array_length = len(data)     #number of rows passed
    total_trips = [["ram",
        "DEM001",
        "Box",
        "Demosuppllier",
        "Demo Site",
        "100",
        "10",
        "1000",
        "Demosuppllier",
        "10",
        "10",
        "100",
        "Demo Customer",
        "Demo Site",
        "Rate",
        "100",
        "10",
        "100",
        "100",
        "Cash",
        "121",
        "1",
        "1",
        "21",
        "73",
        "21",
        "21",
        "94",
        "-101"
    ],["nandhu",
        "DEM001",
        "Box",
        "Demosuppllier",
        "Demo Site",
        "100",
        "10",
        "1000",
        "Demosuppllier",
        "10",
        "10",
        "100",
        "Demo Customer",
        "Demo Site",
        "Rate",
        "100",
        "10",
        "100",
        "100",
        "Cash",
        "121",
        "1",
        "1",
        "21",
        "73",
        "21",
        "21",
        "94",
        "-101"
    ]]
    trip_sheet = frappe.new_doc("Trip Sheet")
    trip_sheet.vehicle = "KL 11 Q 369"
    for trip in total_trips:     #creating trip sheet for each row
        driver = trip[0]
        item = trip[1]
        uom = trip[2]
        supplier = trip[3]
        supplier_site = trip[4]
        supplier_rate = trip[5]
        supplier_quantity = int(trip[6])
        supplier_amount = int(trip[7])
        supplier_partner = trip[8]
        partner_rate = int(trip[9])
        partner_quantity = int(trip[10])
        partner_amount = int(trip[11])
        customer = trip[12]
        customer_site = trip[13]
        customer_rate_type = trip[14]
        customer_rate = int(trip[15])
        customer_quantity = int(trip[16])
        customer_amount = int(trip[17])
        paid_amount = int(trip[18])
        payment_method = trip[19]
        total = int(trip[20])
        no_of_trips = int(trip[21])
        bata_rate = int(trip[22])
        bata_percentage = int(trip[23])
        frc = int(trip[24])
        distance = trip[25]
        gst_amount = int(trip[26])
        net_frc = int(trip[27])
        net_total = int(trip[28])
        trip_sheet.append("trip_details",
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
                })
        
    
    trip_sheet.save()# trip_sheet.save()
    # trip_sheet.submit()# trip_sheet.submit()
        


# print(data[1])
