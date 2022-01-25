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
        item = trip[14]
        uom = trip[15] 
        supplier = trip[1]
        supplier_site = trip[2]
        supplier_uom = trip[3]
        supplier_rate = trip[4]
        supplier_quantity = float(trip[5])
        supplier_amount = float(trip[7])
        print("-------------------------")
        supplier_partner = trip[8]
        sales_partner = trip[6]
        if (trip[9] and trip[10] and trip[11] != ''):
            partner_rate = float(trip[9])
            partner_quantity = float(trip[10])
            partner_amount = float(trip[11]) 
        else:
            partner_rate, partner_quantity, partner_amount = 0, 0, 0
        customer = trip[12]
        customer_site = trip[13]
        customer_rate_type = trip[17] 
        if (trip[18] == ''):
            customer_rate = float(0)
        else:
            customer_rate = float(trip[18])
        if (trip[19] == ''):
            customer_quantity = int(0)
        else:
            customer_quantity = float(trip[19])
        customer_amount = float(trip[20])
        if (trip[27] == ''):
            paid_amount = int(0)
        else:
            paid_amount = float(trip[27])
        # payment_method = trip[24]
        total = float(trip[28])
        if (trip[25] == ''):
            no_of_trips = 1
        else:
            no_of_trips = int(trip[25])
        if (trip[31] == ''):
            bata_rate = int(0)
        else:
            bata_rate = float(trip[31])
        if (trip[32] == ''):
            bata_percentage = int(0)
        else:
            bata_percentage = float(trip[32])
        frc = float(trip[29])
        if (trip[26] == ''):
            distance = int(0)
        else:
            distance = int(trip[26])
        if (trip[21] == ''):
            gst_amount = int(0)
        else:
            gst_amount = float(trip[21])
        net_frc = float(trip[30])
        net_total = float(trip[34])
        bata_amount = trip[33]
        if trip[16]:
            gst_percentage = float(trip[16])
        else:
            gst_percentage = 0
        invoice_number = trip[22]
        dispatch_doc_no = trip[23]
        bill_of_lading = trip[24]
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
                    # "payment_method": payment_method,
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
                    "gst_percentage" : gst_percentage,
                    "bill_of_lading" : bill_of_lading ,              
                    "invoice_no" : invoice_number,
                    "dispatch_doc_no" : dispatch_doc_no,
                    "supplier_uom" : supplier_uom
                })
        
    if arg4 == 'hold':
        trip_sheet.save()# trip_sheet.save()
    elif arg4 == 'submit':
        trip_sheet.save()
        trip_sheet.submit()
    return "Success"


def vehicle_share_validation(doc,event):
    total_percentage = 0
    for individual_share in doc.vehicle_owner:
        total_percentage = total_percentage + int(individual_share.share_percentage)
    if total_percentage == 100:
        pass
    else:
        frappe.throw("Share Percentage Not Equals to 100")
