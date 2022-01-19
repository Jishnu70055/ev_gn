import frappe
import json

from frappe.exceptions import FileAlreadyAttachedException



@frappe.whitelist()
def post_data(arg1=None, arg2=None, arg3=None ,arg4 = None):
    from datetime import datetime
    date_obj=arg2
    date_format=datetime.strptime(date_obj,'%Y-%m-%d').date()
    print (date_format)
    print(type(date_format))
    total_trips = json.loads(arg3) #converting string array into json
    trip_sheet = frappe.new_doc("Trip Sheet")
    trip_sheet.vehicle = arg1
    trip_sheet.date = date_format
    for trip in total_trips:     #creating trip sheet for each row
        driver = trip[0]
        item = trip[13]#1
        uom = trip[14]#2
        supplier = trip[1]#3
        supplier_site = trip[2]#4
        supplier_rate = trip[3]#5
        supplier_quantity = int(trip[4])#6
        supplier_amount = int(trip[6])#8
        print("-------------------------")
        supplier_partner = trip[7]#9
        sales_partner = trip[5]#7
        if (trip[8] and trip[9] and trip[10] != ''):
            partner_rate = int(trip[8])#10
            partner_quantity = int(trip[9])#11
            partner_amount = int(trip[10])#12
        else:
            partner_rate, partner_quantity, partner_amount = 0, 0, 0
        customer = trip[11]#13 #customer = 11 ,customer site =12,partner quantity = 9 
        customer_site = trip[12]#14
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
        if (trip[21] == ''):
            no_of_trips = 1
        else:
            no_of_trips = int(trip[21])
        if (trip[28] == ''):
            bata_rate = int(0)
        else:
            bata_rate = int(trip[28])
        if (trip[29] == ''):
            bata_percentage = int(0)
        else:
            bata_percentage = float(trip[29])
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
        if trip[15]:
            gst_percentage = int(trip[15])
        else:
            gst_percentage = 0
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
