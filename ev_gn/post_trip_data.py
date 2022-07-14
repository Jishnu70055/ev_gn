import frappe
import json

from frappe.exceptions import FileAlreadyAttachedException



@frappe.whitelist()
def post_data(arg1=None, arg2=None, arg3=None ,arg4 = None):
    from datetime import datetime
    print(arg3)
    date_obj=arg2
    date_format=datetime.strptime(date_obj,'%Y-%m-%d').date()
    total_trips = json.loads(arg3) #converting string array into json
    trip_sheet = frappe.new_doc("Trip Sheet")
    trip_sheet.vehicle = arg1
    trip_sheet.date = date_format
    for trip in total_trips:     #creating trip sheet for each row
        driver = trip[0]
        item = trip[1]
        supplier = trip[2]
        supplier_site = trip[3]
        supplier_uom = trip[4]
        supplier_rate = float(trip[5])
        supplier_quantity = float(trip[6])
        sales_partner = trip[7]
        supplier_amount = float(trip[8])
        supplier_partner = trip[9]
        if (trip[10] and trip[11] and trip[12] != ''):
            partner_rate = float(trip[10])
            partner_quantity = float(trip[11])
            partner_amount = float(trip[12]) 
        else:
            partner_rate, partner_quantity, partner_amount = 0, 0, 0
        customer = trip[13]
        customer_site = trip[14]
        uom = trip[15]
        if trip[16]:
            gst_percentage = float(trip[16])
        else:
            gst_percentage = 0
        gst_type = trip[17]
        customer_rate_type = trip[18]     
        if (trip[19] == ''):
            customer_rate = float(0)
        else:
            customer_rate = float(trip[19])
        if (trip[20] == ''):
            customer_quantity = int(0)
        else:
            customer_quantity = float(trip[20])
        customer_amount = float(trip[21])
        if (trip[22] == ''):
            gst_amount = int(0)
        else:
            gst_amount = float(trip[22])
        invoice_number = trip[23]
        dispatch_doc_no = trip[24]
        bill_of_lading = trip[25]
        if (trip[26] == ''):
            no_of_trips = 1
        else:
            no_of_trips = int(trip[26])
        if (trip[27] == ''):
            distance = int(0)
        else:
            distance = float(trip[27])
        if (trip[28] == ''):
            paid_amount = int(0)
        else:
            paid_amount = float(trip[28])
        total = float(trip[29])
        frc = float(trip[30])
        net_frc = float(trip[31])
        if (trip[32] == ''):
            bata_rate = float(0)
        else:
            bata_rate = float(trip[32])
        if (trip[33] == ''):
            bata_percentage = float(0)
        else:
            bata_percentage = float(trip[33])
        bata_amount = float(trip[34])
        driver_bata_amount = float(trip[35])
        net_total = float(trip[36])
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
                    "gst_type":gst_type,                                                  
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
                    "supplier_uom" : supplier_uom,
                    "driver_bata_amount" : driver_bata_amount
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
        total_percentage = total_percentage + float(individual_share.share_percentage)
    if total_percentage == 100:
        pass
    else:
        frappe.throw("Share Percentage Not Equals to 100")
