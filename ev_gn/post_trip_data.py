import frappe
import json

from frappe.exceptions import FileAlreadyAttachedException

@frappe.whitelist()
def post_data_test(a):#row_array,,date,selected_vehicle
    # total_trips = json.loads(row_array) #converting string array into json
    print (a)



@frappe.whitelist()
def post_data(arg1=None, arg2=None, arg3=None ,arg4 = None):
    total_trips = json.loads(arg3) #converting string array into json
    trip_sheet = frappe.new_doc("Trip Sheet")
    trip_sheet.vehicle = arg1
    trip_sheet.date = arg2
    for trip in total_trips:     #creating trip sheet for each row
        driver = trip[0]
        item = trip[1]
        uom = trip[2]
        supplier = trip[3]
        supplier_site = trip[4]
        supplier_rate = trip[5]
        supplier_quantity = int(trip[6])
        supplier_amount = int(trip[8])
        print("-------------------------")
        supplier_partner = trip[9]
        sales_partner = trip[7]
        partner_rate = int(trip[10])
        partner_quantity = int(trip[11])
        partner_amount = int(trip[12])
        customer = trip[13]
        customer_site = trip[14]
        customer_rate_type = trip[16]
        if (trip[17] == ''):
            customer_rate = int(0)
        else:
            customer_rate = int(trip[17])
        if (trip[18] == ''):
            customer_quantity = int(0)
        else:
            customer_quantity = int(trip[18])
        customer_amount = int(trip[19])
        if (trip[23] == ''):
            paid_amount = int(0)
        else:
            paid_amount = int(trip[23])
        payment_method = trip[24]
        total = int(trip[25])
        no_of_trips = int(trip[21])
        if (trip[28] == ''):
            bata_rate = int(0)
        else:
            bata_rate = int(trip[28])
        if (trip[29] == ''):
            bata_percentage = int(0)
        else:
            bata_percentage = int(trip[29])
        frc = int(trip[26])
        if (trip[22] == ''):
            distance = int(0)
        else:
            distance = int(trip[22])
        if (trip[20] == ''):
            gst_amount = int(0)
        else:
            gst_amount = float(trip[20])
        net_frc = float(trip[27])
        net_total = int(trip[31])
        bata_amount = trip[30]
        gst_percentage = trip[15]
        trip_sheet.append("trip_details",
                {
                    "sales_person":sales_partner,
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
                    "gst": 1,                                                  
                    "gst_amount": gst_amount,
                    "net_frc": net_frc,
                    "bata_rate": bata_rate,
                    "bata_percentage": bata_percentage,
                    "distance": distance,
                    "net_total": net_total,
                    "bata_amount" : bata_amount,
                    "gst_percentage" : gst_percentage
                })
        
    if arg4 == 'hold':
        trip_sheet.save()# trip_sheet.save()
    elif arg4 == 'submit':
        trip_sheet.save()
        trip_sheet.submit()
    return "Success"
