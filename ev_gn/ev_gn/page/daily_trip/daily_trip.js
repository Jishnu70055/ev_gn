let flag = false;
let validation_array = [] // add value in validation 
frappe.pages['daily-trip'].on_page_load = function (wrapper) {

    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Trip Page',
        single_column: true
    });

    // Append required html template for the table initialisation
    $(frappe.render_template("daily_trip")).appendTo(page.main);

    // An object of libararies to be loaded to this page
    let js_libs = {
        "jquery_ui": "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js",
        "jquery_loading_overlay": "https://cdnjs.cloudflare.com/ajax/libs/jquery-loading-overlay/2.1.7/loadingoverlay.min.js",
        "jquery_chosen": "https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery.min.js",
        "jquery_datatable": "https://cdn.datatables.net/v/dt/dt-1.11.0/datatables.min.js",
        "jquery_auto": "https://unpkg.com/contenteditable-autocomplete@1.0.2/dist/contenteditable-autocomplete.js",
        "css_auto": "https://unpkg.com/contenteditable-autocomplete@1.0.2/dist/contenteditable-autocomplete.css",
        "css_datatable": "https://cdn.datatables.net/v/dt/dt-1.11.0/datatables.min.css",
        "css_chosen": "https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.min.css"
    };



    // Decalre required variables
    let myList = ''
    let count = 0
    let liSelected = ''
    let a = ''
    var ul_value = ''
    var li_nodes = ''
    var selected_ul = 0;

    let validtion_point = false // 
    let validation_int_array = [] //array
    let current_date //set date 
    let selected_vehicle //selected option for vehicle 
    let table //used for creating datatable 
    let counts = 0
    let rows //used for storing rows empty array
    let col_count = 35 //The count of empty arrays to be created
    let partner_amount_array
    let Options = ['Rent', 'Rate'];
    let payment_method = ['Cash', 'Bank']
    let gst_percentage = [5, 0];

    // index of cell in table  
    let driver_ = 0
    let supplier_ = 1
    let supplier__site = 2
    let supplier_uom = 3
    let supplier_rate = 4
    let supplier_qty = 5
    let sales__person = 6
    let supplier_amt = 7
    let supplier_partner = 8
    let partner__rate = 9
    let partner__qty = 10
    let partner__amt = 11
    let coustomer_ = 12
    let coustomer__site = 13
    let item_ = 14
    let uom_ = 15
    let gst_p_ = 16
    let coustomer__rate__type = 17
    let coustomer__rate = 18
    let coustomer__qty = 19
    let coustomer__amt = 20
    let gst_amount = 21
    let Invoice_number = 22
    let Dispatch_DocNo = 23
    let BillofLading__LR_RRNo = 24
    let no__of__tips = 25
    let distance_ = 26
    let recived__cash__amt = 27
    // let payment__method = 28
    let total_vehicle_rent = 28
    let frc_ = 29
    let frc_gst = 30
    let bata__rate = 31
    let bata__percentage = 32
    let bata__amount = 33
    let net_vehicle_balance = 34





    // Load Jquery UI using Jquery getScript function.
    $.getScript(js_libs.jquery_ui)
        // Done is a chained with multiple function called
        // one after the other.
        .done(function (script, textStatus) {
            $.getScript(js_libs.jquery_loading_overlay)
                .done(function (script, textStatus) {
                    // console.log("ui loaded")
                    $.getScript(js_libs.jquery_chosen)
                        .done(
                            function (e) {
                                frappe.db.get_list('Vehicle', { fields: ['license_plate'] })
                                    .then(
                                        r => {
                                            // console.log("value are ", r)
                                            r.map((x) => {
                                                // console.log("vehicle no plate mapping", x.license_plate)
                                                // var optn = elmts[x.license_plate];
                                                var el = document.createElement("option");
                                                el.textContent = x.license_plate;
                                                el.value = x.license_plate;
                                                select.appendChild(el);
                                            })
                                            $("#vehicle").chosen({ no_results_text: "Oops, nothing found!" })
                                            $('#vehicle').chosen().change(function (e) {
                                                //when 'one' is selected, add another chosen. 
                                                console.log('working now')
                                                default_driver()
                                            });
                                        }
                                    )
                                    .catch(err => console.log("erorr is", err))
                                // console.log("js libs call jquery chosen")
                            },
                            function (e) {
                                //Add Css for chosen jquery
                                $.ajax({
                                    dataType: "text",
                                    url: js_libs.css_chosen,
                                }).done(function (text) {
                                    $("<style>").html(text).appendTo("head");
                                });


                            },
                            //On success load the datatable jquery plugin using getScript function
                            //This is only executed if previous call was a success
                            $.getScript(js_libs.jquery_datatable)
                                .done(
                                    //First function in done
                                    function (script, textStatus) {
                                        // console.log("table loaded")

                                        //On success load the CSS for datatable.
                                        //CODE TO BE ADDED

                                        //Binding for Add Row event
                                        function row_add() {
                                            rows = [];
                                            counts = 0

                                            //Array for adding row
                                            for (i = 1; i <= col_count; i++) {
                                                rows.push("");

                                            }

                                            table.row.add(rows).draw(true);
                                        };


                                        today_date(); //onload  set date
                                        default_driver() //default driver
                                        $(".suggestions").addClass("d-none"); // onload to remove suggestion box
                                        $('#addRow').on('click', function add_row() {
                                            rows = [];
                                            counts = 0
                                            //Array for adding row
                                            for (i = 1; i <= col_count; i++) {
                                                rows.push("");

                                            }
                                            console.log('rows', table)
                                            default_driver()
                                            table.row.add(rows).draw(true);
                                            $('.suggestions li').removeClass('active');
                                        });
                                        //creating new row on entering press inside the table
                                        $("#myTable").keypress(function (event) {
                                            // if (event.keyCode === 13) {
                                            //     row_add()
                                            //     $("#body").find("td.active").show().focus();

                                            // }
                                            if (event.keyCode === 9) {
                                                row_add()
                                                $("#body").find("td.active").next().show().focus();

                                            }
                                        });

                                        //Cell for table creation     
                                        const createdCell = function (cell) {
                                            let original
                                            //condition for contenteditable true or false --start
                                            counts == supplier_amt || counts == partner__amt || counts == net_vehicle_balance || counts == coustomer__amt || counts == partner__qty || counts == frc_gst || counts == total_vehicle_rent || counts == bata__amount ?
                                                cell.setAttribute('contenteditable', false) //set read only data
                                                :
                                                cell.setAttribute('contenteditable', true)
                                            //condition for contenteditable true or false --end
                                            counts == gst_p_ ? table.cell({ row: table.rows().count() - 1, column: gst_p_ }).data(5) : ""
                                            counts == coustomer__rate__type ? table.cell({ row: table.rows().count() - 1, column: coustomer__rate__type }).data("Rate") : ""


                                            cell.setAttribute('spellcheck', false)
                                            cell.setAttribute('class', "cell")

                                            counts = counts + 1
                                            cell.addEventListener('focus', function (e) {
                                                original = e.target.textContent
                                            })
                                        }

                                        //Init DataTable
                                        table = $('#myTable').DataTable({
                                            searching: false,
                                            paging: false,
                                            info: false,
                                            stateSave: true,
                                            columnDefs: [{
                                                targets: '_all',
                                                createdCell: createdCell,
                                                className: 'select-checkbox',
                                                // targets: 0  
                                            }],
                                            select: {
                                                style: 'os',
                                                selector: 'td:first-child',
                                            },
                                            "ordering": false //sorting removed
                                        })

                                    },
                                    // Second function in done
                                    function (e) {
                                        rows = []

                                        //Array for adding row
                                        for (i = 1; i <= col_count; i++) {
                                            rows.push("");

                                        }
                                        // window.location.reload()
                                        $('#myTable').DataTable().row.add(rows).draw(true)
                                        $("#body").find("tbody").on('click', '#myTable', function (e) {
                                            console.log('td working and add active tag')
                                            $("td").removeClass("active")
                                            e.target.classList.add('active');
                                        })

                                        $("#body").find("tbody").on(' keypress paste input focus', '[contenteditable]', 'td', function (e) {
                                            totalrow = $('#myTable').DataTable().cell(this).index().row //find totalrow in table
                                            //Get value of TD
                                            var query = e.target.innerHTML == "<br><br>" ? '' : e.target.innerHTML.replace(/<br>/g, " ").trim()
                                            query = query.replace(/&nbsp;/g, " ").trim()
                                            var pos = this.getBoundingClientRect();
                                            var layout_pos = document.querySelector(".layout-main").getBoundingClientRect()
                                            // console.log(pos)
                                            $(".suggestions").css({
                                                position: "absolute",
                                                top: (pos.top + pos.height - layout_pos.top) + "px",
                                                left: (pos.left - layout_pos.left) + "px",
                                                zIndex: 9999
                                            }).show();

                                            //console.log("clicked TD!")
                                            $("td").removeClass("active")
                                            e.target.classList.add('active');
                                            $('.suggestions li').addClass('py-4');
                                            $('.suggestions li').remove();
                                            $(".suggestions").removeClass("d-none") // to remove d-none in suggestion div
                                            $('#myTable').css({ 'position': 'relative' })

                                            if (e.which == 27) {
                                                $(".suggestions").addClass("d-none")
                                            }

                                            // if (e.which == 38) {
                                            //     console.log("keyup pressed")
                                            // }
                                            // if (e.which == 40) {
                                            //     console.log("keydown pressed")
                                            // }

                                            //api fetch for suggestion part start
                                            if ($('#myTable').DataTable().cell(this).index().column == driver_) { //fetch data customer api 
                                                // console.log("td values are", query);



                                                q = "%" + query + "%"
                                                console.log(q)

                                                frappe.call({
                                                    method: 'frappe.client.get_list',
                                                    args: {
                                                        doctype: 'Driver',
                                                        fields: ['name'],
                                                        filters: [
                                                            ['name', 'like', q],

                                                        ]
                                                    },
                                                    callback: (e) => {
                                                        $('.suggestions li').remove();
                                                        array_alpha(e.message, 'name')
                                                    }
                                                })
                                            }
                                            if ($('#myTable').DataTable().cell(this).index().column == item_) {
                                                q = "%" + query + "%"
                                                frappe.call({
                                                    method: 'frappe.client.get_list',
                                                    args: {
                                                        doctype: 'Item',
                                                        fields: ['item_code'],
                                                        filters: [
                                                            ['item_code', 'like', q],

                                                        ]
                                                    },
                                                    callback: (e) => {
                                                        // r = e.message
                                                        array_alpha(e.message, 'item_code')
                                                    }
                                                })
                                            }

                                            if ($('#myTable').DataTable().cell(this).index().column == uom_ || $('#myTable').DataTable().cell(this).index().column == supplier_uom) {
                                                q = "%" + query + "%"
                                                frappe.call({
                                                    method: 'frappe.client.get_list',
                                                    args: {
                                                        doctype: 'UOM',
                                                        fields: ['uom_name'],
                                                        filters: [
                                                            ['uom_name', 'like', q],

                                                        ]
                                                    },
                                                    callback: (e) => {
                                                        array_alpha(e.message, 'uom_name')
                                                    }
                                                })
                                            }
                                            if ($('#myTable').DataTable().cell(this).index().column == sales__person) {
                                                q = "%" + query + "%"
                                                frappe.call({
                                                    method: 'frappe.client.get_list',
                                                    args: {
                                                        doctype: 'Sales Person',
                                                        fields: ['sales_person_name'],
                                                        filters: [
                                                            ['sales_person_name', 'like', q],

                                                        ]
                                                    },
                                                    callback: (e) => {
                                                        array_alpha(e.message, 'sales_person_name')
                                                    }
                                                })
                                            }
                                            if ($('#myTable').DataTable().cell(this).index().column == supplier_) {
                                                q = "%" + query + "%"
                                                frappe.call({
                                                    method: 'frappe.client.get_list',
                                                    args: {
                                                        doctype: 'Supplier',
                                                        fields: ['supplier_name'],
                                                        filters: [
                                                            ['supplier_name', 'like', q],

                                                        ]
                                                    },

                                                    callback: (e) => {
                                                        array_alpha(e.message, 'supplier_name')
                                                    }
                                                })
                                            }

                                            if ($('#myTable').DataTable().cell(this).index().column == supplier__site) {

                                                let cell = $('#myTable').DataTable().cell("td.active")
                                                let r = cell.index().row
                                                frappe.db.get_doc('Supplier', table.cell({ row: r, column: supplier_ }).data())
                                                    .then(doc => {
                                                        let items = doc.supplier_site_list
                                                        // console.log('items in the doc are', items)
                                                        array_alpha(doc.supplier_site_list, 'site')
                                                    })

                                            }
                                            if ($('#myTable').DataTable().cell(this).index().column == supplier_partner) {

                                                q = "%" + query + "%"
                                                frappe.call({
                                                    method: 'frappe.client.get_list',
                                                    args: {
                                                        doctype: 'Supplier',
                                                        fields: ['supplier_name'],
                                                        filters: [
                                                            ['supplier_name', 'like', q],

                                                        ]
                                                    },
                                                    callback: (e) => {
                                                        array_alpha(e.message, 'supplier_name')
                                                    }
                                                })

                                            }
                                            if ($('#myTable').DataTable().cell(this).index().column == coustomer_) {
                                                q = "%" + query + "%"
                                                frappe.call({
                                                    method: 'frappe.client.get_list',
                                                    args: {
                                                        doctype: 'Customer',
                                                        fields: ['customer_name'],
                                                        filters: [
                                                            ['customer_name', 'like', q],

                                                        ]
                                                    },
                                                    callback: (e) => {
                                                        array_alpha(e.message, 'customer_name')
                                                    }
                                                })

                                            }
                                            //FILTER COUSTOMER SITE AS PER COUSTOMER FILED
                                            if ($('#myTable').DataTable().cell(this).index().column == coustomer__site) {
                                                let cell = $('#myTable').DataTable().cell("td.active")
                                                let r = cell.index().row
                                                frappe.db.get_doc('Customer', table.cell({ row: r, column: coustomer_ }).data())
                                                    .then(doc => {
                                                        let items = doc.site_list
                                                        array_alpha(doc.site_list, 'site')
                                                    })
                                            }
                                            if ($('#myTable').DataTable().cell(this).index().column == coustomer__rate__type) {
                                                Options.map((x) => {
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x}</li>`);
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                                myList = document.getElementById('suggestion_list');
                                                a = myList.firstElementChild
                                                a.classList.add("bg-selection")
                                            }

                                            if ($('#myTable').DataTable().cell(this).index().column == gst_p_) {
                                                gst_percentage.map((x) => {
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x}</li>`);
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                                myList = document.getElementById('suggestion_list');
                                                a = myList.firstElementChild
                                                a.classList.add("bg-selection")
                                            }
                                            //api fetch for suggestion part end

                                        });
                                        //hide suggestion area 
                                        $('body').on('click', function () {
                                            $(".suggestions").addClass("d-none")
                                        })

                                        // //CODE ADDING STACKOVERFLOW
                                        $("#body").find("tbody").on('keydown', '[contenteditable]', '#myTable', function (e) {
                                            // console.log('keypressed')
                                            var pos = this.getBoundingClientRect();
                                            if (e.which != 40 && e.which != 38 && e.which != 13) {
                                                myList = document.getElementById('suggestion_list');
                                                count = 0
                                                liSelected = document.querySelectorAll('#suggestion_list li')
                                                a = myList.firstElementChild
                                                // console.log('class list', myList)
                                                // a.classList.add("bg-selection");
                                            }
                                            if (e.which == 39) {
                                                myList = document.getElementById('suggestion_list');
                                                count = 0
                                                liSelected = document.querySelectorAll('#suggestion_list li')
                                                a = myList.firstElementChild
                                                a.classList.add("bg-selection");
                                            }
                                            if (e.which == 13) {
                                                var cell = $('#myTable').DataTable().cell("td.active")
                                                a ?
                                                    a.innerHTML == "Close" ?
                                                        cell.data('').draw() :
                                                        cell.index().column == driver_ || cell.index().column == supplier_ || cell.index().column == supplier__site || cell.index().column == supplier_partner || cell.index().column == supplier_uom || cell.index().column == sales__person || cell.index().column == coustomer_ || cell.index().column == coustomer__site || cell.index().column == item_ || cell.index().column == uom_ || cell.index().column == coustomer__rate__type || cell.index().column == gst_p_ ?
                                                            cell.data(a.innerHTML).draw() :
                                                            '' :
                                                    ''
                                                a = ''
                                                $(".suggestions").addClass("d-none")
                                                // $("#body").find("td.active").next().show().focus();

                                                if (e.target.innerHTML == "Close") {
                                                    $(".suggestions").addClass("d-none")
                                                } else {
                                                    let r = cell.index().row
                                                    if (cell.index().column == sales__person || cell.index().column == item_) {
                                                        cell.index().column == sales__person ?
                                                            $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${supplier_partner + 1})`).show().focus() :
                                                            ''
                                                        cell.index().column == item_ ? default_value(cell.index().row, cell.index().column, e.target.innerHTML) : ""
                                                    } else {
                                                        $("#body").find("td.active").next().show().focus();
                                                    }
                                                    if (cell.index().column == bata__percentage || cell.index().column == bata__rate) {
                                                        rows = [];
                                                        counts = 0
                                                        //Array for adding row
                                                        for (i = 1; i <= col_count; i++) {
                                                            rows.push("");

                                                        }
                                                        table.row.add(rows).draw(true);
                                                        $("#body").find("td.active").next().show().focus();
                                                        $(`#myTable tr:nth-child(${r + 2}) td:nth-child(${supplier_ + 1})`).show().focus()
                                                        default_driver()
                                                    }
                                                }

                                            }
                                            if (e.which == 38) {

                                                var li = $('#suggestion_list > li');
                                                if (count + 1 <= liSelected.length + 1 && count > 1) {
                                                    a = a.previousElementSibling
                                                    a.classList.add("bg-selection");
                                                    a.classList.add("scrolltome");
                                                    a.nextElementSibling.classList.remove("bg-selection")
                                                    a.nextElementSibling.classList.remove("scrolltome")
                                                    count = count - 1;
                                                }

                                                if (count <= li.length - 9) {
                                                    var s = [].indexOf.call(li, a);
                                                    if (s === -1) return;

                                                    selected = s;

                                                    var elHeight = $(a).height();
                                                    var scrollTop = $(li).scrollTop();
                                                    var viewport = scrollTop + $(ul_value).height();
                                                    var elOffset = elHeight * selected + 10;
                                                    $('ul').animate({ scrollTop: elOffset }, "slow")
                                                }

                                            }
                                            if (e.which == 40) {
                                                // console.log('node', li_nodes, 'node selected value', li_nodes[selected_ul + 1])
                                                // select_ul(li_nodes[count])
                                                var li = $('#suggestion_list > li');
                                                if (count + 1 <= liSelected.length && count > 0) {
                                                    a = a.nextElementSibling
                                                    a.classList.add("bg-selection");
                                                    a.previousElementSibling.classList.remove("bg-selection")
                                                    count = count + 1;

                                                } else if (count == 0) {
                                                    a = myList.firstElementChild
                                                    a.classList.add("bg-selection");
                                                    myList = document.getElementById('suggestion_list');
                                                    liSelected = document.querySelectorAll('#suggestion_list li')

                                                    // a=a.nextElementSibling
                                                    count = count + 1;

                                                }

                                                if (count >= 9) {
                                                    var li = $('#suggestion_list > li');
                                                    if (count >= 10) {
                                                        a.previousElementSibling.classList.remove("scrolltome")
                                                        li.eq(count - 9).removeClass('btwin');
                                                        console.log('count value is 8', count - 7)
                                                    }
                                                    a.classList.add("scrolltome");
                                                    console.log('count value is 8', count - 6)
                                                    // $('.scrolltome').offset().top > 0 ?
                                                    var s = [].indexOf.call(li, a);
                                                    if (s === -1) return;

                                                    selected = s;

                                                    var elHeight = $(a).height();
                                                    var scrollTop = $(li).scrollTop();
                                                    var viewport = scrollTop + $(ul_value).height();
                                                    var elOffset = elHeight * selected + 10;
                                                    $('ul').animate({ scrollTop: elOffset }, "slow")
                                                }
                                            }
                                        })

                                        // add data into a cell
                                        $("#body").find("tbody").on('click', '[contenteditable]', '#myTable', function (e) {
                                            $('td.active').removeClass('active');
                                            $('td.active').add('active');



                                        })
                                        $('.suggestions').click('li', (e) => {
                                            let table = $('#myTable').DataTable()



                                            //check close value is selected 
                                            if (e.target.innerHTML == "Close") {
                                                $(".suggestions").addClass("d-none")
                                            }
                                            //Ensure only click on li triggers adding data to td
                                            else if ($(e.target).is('li')) {
                                                $(".suggestions").addClass("d-none")
                                                // $("td.active").html(e.target.innerText)
                                                var cell = $('#myTable').DataTable().cell("td.active")
                                                cell.data(e.target.innerText).draw()
                                                $("#body").find("td.active").next().show().focus();
                                                let r = cell.index().row
                                                cell.index().column == sales__person ?
                                                    $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${supplier_partner + 1})`).show().focus() :
                                                    ''
                                                cell.index().column == item_ ? default_value(cell.index().row, cell.index().column, e.target.innerHTML) : ""
                                                // cell.index().column == coustomer_ ? default_customerlist(cell.index().row, cell.index().column, e.target.innerHTML) : ""


                                            }



                                        })

                                        //         //keyup
                                        $("#body").find("tbody").on('blur', 'td', function (e) {

                                            let table = $('#myTable').DataTable()
                                            let cell = table.cell(this)
                                            let row = cell.index().row
                                            let column = cell.index().column
                                            cell_data=this.innerText.replace(/<br>/g, " ").trim()
                                            cell_data=cell_data.replace(/&nbsp;/g, " ").trim()
                                            cell.data(cell_data).draw()
                                            if (
                                                cell.index().column == supplier_rate || cell.index().column == supplier_qty ||
                                                cell.index().column == partner__rate || cell.index().column == partner__qty ||
                                                cell.index().column == coustomer__rate || cell.index().column == coustomer__qty ||
                                                cell.index().column == frc_ || cell.index().column == no__of__tips

                                            ) {
                                                if (cell.index().column == partner__rate) {
                                                    let r = cell.index().row
                                                    table.cell({ row: r, column: supplier_partner }).data() ?
                                                        console.log("supplier partner data found", table.cell({ row: r, column: supplier_partner }).data()) :
                                                        console.log('supplier partner data not found')


                                                    table.cell({ row: r, column: supplier_partner }).data() ?
                                                        (
                                                            check_integer() ? cell_border_error_remove(row, cell.index().column) :
                                                                ($('#alertdata').empty(),
                                                                    $('#alertdata').append("Please Enter a valid Number"),
                                                                    $("#alert_card").fadeIn(),
                                                                    validtion_point = true,
                                                                    closeSnoAlertBox(),
                                                                    cell_border_error(row, cell.index().column))
                                                        ) :
                                                        console.log('supplier partner data not found')



                                                } else {
                                                    check_integer() ? cell_border_error_remove(row, cell.index().column) :
                                                        ($('#alertdata').empty(),
                                                            $('#alertdata').append("Please Enter a valid Number"),
                                                            $("#alert_card").fadeIn(),
                                                            validtion_point = true,
                                                            closeSnoAlertBox(),
                                                            cell_border_error(row, cell.index().column))
                                                }
                                            }
                                            if (cell.index().column == gst_p_) {
                                                table.cell({ row: row, column: gst_p_ }).data() == "5" || table.cell({ row: row, column: gst_p_ }).data() == "0" ?
                                                    cell_border_error_remove(row, cell.index().column) :
                                                    ($('#alertdata').empty(),
                                                        $('#alertdata').append("GST should be 5 or 0"),
                                                        $("#alert_card").fadeIn(),
                                                        validtion_point = true,
                                                        closeSnoAlertBox(),
                                                        cell_border_error(row, cell.index().column))
                                                let r = cell.index().row
                                                table.cell({ row: r, column: gst_p_ }).data() == "5" ?
                                                    (console.log('changes added in conteneditable true'),
                                                        $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${Invoice_number + 1})`).attr('contenteditable', true),
                                                        $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${Dispatch_DocNo + 1})`).attr('contenteditable', true),
                                                        $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${BillofLading__LR_RRNo + 1})`).attr('contenteditable', true),
                                                        console.log('changes added in conteneditable true,now its done')
                                                    ) :
                                                    (console.log('changes added in conteneditable false'),
                                                        $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${Invoice_number + 1})`).attr('contenteditable', false),
                                                        $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${Dispatch_DocNo + 1})`).attr('contenteditable', false),
                                                        $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${BillofLading__LR_RRNo + 1})`).attr('contenteditable', false),
                                                        console.log('changes added in conteneditable false,now its done')
                                                    )
                                            }

                                            if (cell.index().column == supplier_qty) {
                                                value_a = table.cell({ row: row, column: supplier_qty }).data()
                                                table.cell({ row: row, column: partner__qty }).data(parseInt(value_a)) //add calculation 
                                            }
                                            if (cell.index().column == supplier_rate || cell.index().column == supplier_qty) {
                                                let r = cell.index().row
                                                muliple_calutlation(r, supplier_rate, supplier_qty, supplier_amt)
                                            }
                                            // partner total == partner rate*partner_qty
                                            if (cell.index().column == partner__rate || cell.index().column == partner__qty) {
                                                let r = cell.index().row
                                                muliple_calutlation(r, partner__rate, partner__qty, partner__amt)
                                            }

                                            //gst amount auto generate when gst % is 5%
                                            if (
                                                cell.index().column == coustomer__rate || cell.index().column == coustomer__qty ||
                                                cell.index().column == gst_p_ || cell.index().column == coustomer__amt || cell.index.column == coustomer__rate__type

                                            ) {
                                                let r = cell.index().row
                                                let customer_amount = table.cell({ row: r, column: coustomer__amt }).data() ? parseFloat(table.cell({ row: r, column: coustomer__amt }).data()) : 0;
                                                table.cell({ row: r, column: gst_p_ }).data() == 5 ? table.cell({ row: row, column: gst_amount }).data((customer_amount * .05).toFixed(2)) : table.cell({ row: row, column: gst_amount }).data((0).toFixed(2))

                                            }
                                            //check customer type ==rate ,then,customer total == customer rate*customer_qty
                                            if (cell.index().column == coustomer__rate || cell.index().column == coustomer__qty || cell.index().column == coustomer__amt) {
                                                let r = cell.index().row
                                                table.cell({ row: r, column: coustomer__rate__type }).data() == "Rate" ? muliple_calutlation(r, coustomer__rate, coustomer__qty, coustomer__amt) : ""

                                                // customer type='rent' => coustomer amt / coustomer qty
                                                table.cell({ row: r, column: coustomer__rate__type }).data() == "Rent" ? (

                                                    value_a = table.cell({ row: row, column: coustomer__rate }).data() ? parseInt(table.cell({ row: row, column: coustomer__rate }).data()) : 0, //column_A is rate  
                                                    // console.log('value a in coustomer rate ', value_a),
                                                    table.cell({ row: row, column: coustomer__amt }).data(value_a) //add calculation 

                                                ) : ""
                                                let coustomer_amt = table.cell({ row: row, column: coustomer__amt }).data() ? parseInt(table.cell({ row: row, column: coustomer__amt }).data()) : 1;
                                                table.cell({ row: r, column: gst_p_ }).data() == 5 ? table.cell({ row: row, column: gst_amount }).data((coustomer_amt * .05).toFixed(2)) : table.cell({ row: row, column: gst_amount }).data((0).toFixed(2))

                                            }

                                            //NET FRC = FRC+GST AMOUNT
                                            if (cell.index().column == frc_ || cell.index().column == gst_amount || cell.index().column == coustomer__rate || cell.index().column == coustomer__qty || cell.index().column == coustomer__amt) {
                                                let r = cell.index().row
                                                let frc = table.cell({ row: r, column: frc_ }).data() ? parseFloat(table.cell({ row: r, column: frc_ }).data()) : 0;
                                                let gst_amt = table.cell({ row: r, column: gst_amount }).data() ? parseFloat(table.cell({ row: r, column: gst_amount }).data()) : 0;
                                                table.cell({ row: r, column: frc_gst }).data((frc + gst_amt).toFixed(2));
                                            }
                                            //BATA TOTAL = BATE RATE 
                                            if (cell.index().column == bata__rate) {
                                                console.log("bata_rate")
                                                let r = cell.index().row;
                                                // console.log('no fo row', r)
                                                table.cell({ row: r, column: bata__rate }).data() == "" ?
                                                    $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${bata__percentage + 1})`).attr('contenteditable', true) :
                                                    $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${bata__percentage + 1})`).attr('contenteditable', false)
                                                // table.cell({ row: r, column: bata__percentage }).setAttribute('contenteditable', false)
                                                let bata_rate = table.cell({ row: r, column: bata__rate }).data() ? parseFloat(table.cell({ row: r, column: bata__rate }).data()) : 0;
                                                table.cell({ row: r, column: bata__percentage }).data("");
                                                table.cell({ row: r, column: bata__amount }).data(bata_rate);
                                            }
                                            // BATA TOTAL = BATA PERCENTAGE * TOTAL VEHICLE RENT
                                            if (cell.index().column == bata__percentage) {
                                                let r = cell.index().row;
                                                table.cell({ row: r, column: bata__percentage }).data() == "" ?
                                                    $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${bata__rate + 1})`).attr('contenteditable', true) :
                                                    $(`#myTable tr:nth-child(${r + 1}) td:nth-child(${bata__rate + 1})`).attr('contenteditable', false)
                                                // console.log("bata_percentage", table.cell({ row: r, column: bata__percentage }).data())
                                                console.log(table.cell({ row: r, column: bata__percentage }).data())
                                                table.cell({ row: r, column: bata__percentage }).data() ? table.cell({ row: r, column: bata__rate }).data("") : ""
                                                let bata_percentage = table.cell({ row: r, column: bata__percentage }).data() ? (parseInt(table.cell({ row: r, column: bata__percentage }).data()) / 100) * parseFloat(table.cell({ row: r, column: total_vehicle_rent }).data()) : 0;
                                                table.cell({ row: r, column: bata__percentage }).data() != "" && table.cell({ row: r, column: bata__percentage }).data() >= 0 ? table.cell({ row: r, column: bata__amount }).data(bata_percentage.toFixed(2)) : ""
                                            }

                                            //TOTAL = CUSTOMER_AMOUNT - PARTNER_AMOUNT-SUPPLIER_AMOUNT-NETFRC
                                            if (
                                                cell.index().column == supplier_rate || cell.index().column == supplier_qty ||
                                                cell.index().column == partner__rate || cell.index().column == partner__qty ||
                                                cell.index().column == coustomer__rate || cell.index().column == coustomer__qty ||
                                                cell.index().column == frc_ || cell.index().column == gst_amount ||
                                                cell.index().column == frc_gst || cell.index().column == coustomer__amt
                                            ) {
                                                let r = cell.index().row
                                                let partner_amount = table.cell({ row: r, column: partner__amt }).data() ? parseInt(table.cell({ row: r, column: partner__amt }).data()) : 0;
                                                let customer_amount = table.cell({ row: r, column: coustomer__amt }).data() ? parseInt(table.cell({ row: r, column: coustomer__amt }).data()) : 0;
                                                let supplier_amount = table.cell({ row: r, column: supplier_amt }).data() ? parseInt(table.cell({ row: r, column: supplier_amt }).data()) : 0;
                                                let net_frc = table.cell({ row: r, column: frc_gst }).data() ? parseFloat(table.cell({ row: r, column: frc_gst }).data()) : 0;
                                                // console.log("customer amt",customer_amount,"partner amt",partner_amount,"supplier_amount",supplier_amount,"net_frc",net_frc)
                                                let total = customer_amount - partner_amount - supplier_amount - net_frc
                                                // console.log("total value is ",total)
                                                table.cell({ row: r, column: total_vehicle_rent }).data(total) //total value
                                            }

                                            //NET TOTAL = TOTAL - BATA RATE
                                            if (
                                                cell.index().column == supplier_rate || cell.index().column == supplier_qty ||
                                                cell.index().column == partner__rate || cell.index().column == partner__qty ||
                                                cell.index().column == coustomer__rate || cell.index().column == coustomer__qty ||
                                                cell.index().column == frc_ || cell.index().column == gst_amount ||
                                                cell.index().column == frc_gst || cell.index().column == coustomer__amt ||
                                                cell.index().column == total_vehicle_rent || cell.index().column == bata__rate ||
                                                cell.index().column == bata__percentage || cell.index().column == bata__amount

                                            ) {
                                                let r = cell.index().row
                                                let total = table.cell({ row: r, column: total_vehicle_rent }).data() ? parseFloat(table.cell({ row: r, column: total_vehicle_rent }).data()) : 0;
                                                let bata_amt = table.cell({ row: r, column: bata__amount }).data() ? parseInt(table.cell({ row: r, column: bata__amount }).data()) : 0;
                                                // console.log("total",total,"bata_amt",bata_amt)
                                                let net_total = total - bata_amt
                                                // console.log("net_total",net_total)
                                                table.cell({ row: r, column: net_vehicle_balance }).data(net_total) //net_total
                                            }

                                        })

                                        $('body').on('focus', '[contenteditable]', function () {
                                            $("td").removeClass("active")
                                            $(".suggestions").addClass("d-none"); // onload to remove suggestion box
                                            const $this = $(this);
                                            $this.data('before', $this.html());

                                            // console.log("AAA")
                                        }).on('blur keyup paste input', '[contenteditable]', function (e) {
                                            $("td").removeClass("active")
                                            e.target.classList.add('active');
                                            const $this = $(this);
                                            if ($this.data('before') !== $this.html()) {
                                                $this.data('before', $this.html());
                                                $this.trigger('change', e.target.value);
                                                // console.log("changed", )
                                            }
                                            // console.log("not changed")
                                        });



                                    },
                                    // Third function in done (not used)
                                    function (e) {
                                        // console.log("3");

                                        //Add Css for DataTable
                                        $.ajax({
                                            dataType: "text",
                                            url: js_libs.css_datatable,
                                        }).done(function (text) {
                                            $("<style>").html(text).appendTo("head");
                                        });

                                        //Add Css for Auto Suggest
                                        $.ajax({
                                            dataType: "text",
                                            url: js_libs.css_auto,
                                        }).done(function (text) {
                                            $("<style>").html(text).appendTo("head");
                                        });

                                    })
                                .fail(function (jqxhr, settings, exception) {
                                    $("div.log").text("Triggered ajaxError handler.")
                                })

                        )
                        .fail(function (jqxhr, settings, exception) {
                            $("div.log").text("Triggered ajaxError handler.")
                        });

                })
                .fail(function (jqxhr, settings, exception) {
                    $("div.log").text("Triggered jquery loading overlay handler.")
                });
        })
        .fail(function (jqxhr, settings, exception) {
            $("div.log").text("Triggered ajaxError handler.")
        });





    // Post data from DataTable to backend
    $('#getData').on('click', function () {

        ////start////

        // $('#myTable').loading();
        $('body').LoadingOverlay("show", {
            image: "",
            text: ""
        });

        // $('#myTable tr:nth-child(1) td:nth-child(1)').addClass('border border-danger bg-warning');
        let table = $('#myTable').DataTable()

        // let selected_value = $("#vehicle option:first").attr('selected', 'selected');
        console.log($('#vehicle option').filter(':selected').val())
        selected_vehicle = $('#vehicle option').filter(':selected').val();
        current_date ? current_date : today_date()
        // $table_data = table.rows().data();
        // console.log("table row is",table.row(':eq(0)').cell(':eq(11)').data( "safwan" ).draw()) 
        console.log("row count", table.rows().count())
        console.log("partner_amt_array", partner_amount_array)
        let row = table.rows().count()
        console.log("validation call", row)

        let total_rows = table.rows().count()

        validation_scan()
        validation_array.length > 0 ?
            (
                $('body').LoadingOverlay("hide"),
                $("#alert_card").fadeIn(),
                closeSnoAlertBox(),
                validation_handler()
            ) :
            (
                $table_data = $('#myTable').DataTable().rows().data().toArray(),
                console.log("data in table", $table_data, "current date", current_date, "selected data", selected_vehicle),
                frappe.call({
                    method: 'ev_gn.post_trip_data.post_data',
                    args: { arg1: selected_vehicle, arg2: current_date, arg3: $table_data, arg4: "submit" }
                })
                    .then(
                        (e) => {
                            console.log("Success", e);
                            location.reload();
                            $('body').LoadingOverlay("hide")
                        }
                    )
                    .catch((e) => {
                        $('body').LoadingOverlay("hide");
                        console.log("Error", e);
                        $('#alertdata').empty();
                        $('#alertdata').append("Something went wrong");
                        $("#alert_card").fadeIn();
                        validtion_point = true;
                        closeSnoAlertBox()

                    })
            )

        ////end////




    });
    $('#SaveAndHoldData').on('click', function () {
        // $('#myTable').loading();
        $('body').LoadingOverlay("show", {
            image: "",
            text: ""
        });

        // $('#myTable tr:nth-child(1) td:nth-child(1)').addClass('border border-danger bg-warning');
        let table = $('#myTable').DataTable()

        // let selected_value = $("#vehicle option:first").attr('selected', 'selected');
        console.log($('#vehicle option').filter(':selected').val())
        selected_vehicle = $('#vehicle option').filter(':selected').val();
        current_date ? current_date : today_date()
        current_date ? console.log(current_date) : today_date()
        // $table_data = table.rows().data();
        // console.log("table row is",table.row(':eq(0)').cell(':eq(11)').data( "safwan" ).draw()) 
        console.log("row count", table.rows().count())
        console.log("partner_amt_array", partner_amount_array)
        let row = table.rows().count()
        console.log("validation call", row)

        let total_rows = table.rows().count()

        validation_scan()
        validation_array.length > 0 ?
            (
                $('body').LoadingOverlay("hide"),
                $("#alert_card").fadeIn(),
                closeSnoAlertBox(),
                validation_handler()
            ) :
            (
                $table_data = $('#myTable').DataTable().rows().data().toArray(),
                console.log("data in table", $table_data, "current date", current_date, "selected data", selected_vehicle),
                frappe.call({
                    method: 'ev_gn.post_trip_data.post_data',
                    args: { arg1: selected_vehicle, arg2: current_date, arg3: $table_data, arg4: "hold" }
                })
                    .then(
                        (e) => {
                            console.log("Success", e);
                            location.reload();
                            $('body').LoadingOverlay("hide")
                        }
                    )
                    .catch((e) => {
                        $('body').LoadingOverlay("hide");
                        console.log("Error", e);
                        $('#alertdata').empty();
                        $('#alertdata').append("Something went wrong");
                        $("#alert_card").fadeIn();
                        validtion_point = true;
                        closeSnoAlertBox()

                    })
            )
    });
    // Autoselect Data


    // Creating drop down list funtion
    var select = document.getElementById("vehicle");
    $('#vehicle').trigger("change")

    // $('#vehicle').chosen().change(function(e){
    //     console.log("changes call")
    //         //when 'one' is selected, add another chosen. 

    //     });
    $('#vehicle').on('change', function (e) {
        console.log("vehicle changed ", e.target.value)
        // alert( this.value );
        selected_vehicle = ''
        selected_vehicle = this.value
        console.log('selected vehicle', selected_vehicle)
        default_driver()
    });

    // });
    $('#date').on('change', function () {
        var date = new Date($('#date').val());
        day = date.getDate()
        month = date.getMonth() + 1;
        year = date.getFullYear();
        day = day < 10 ? "0" + day : day
        month = month < 10 ? "0" + month : month
        console.log('day', day, 'month', month, 'year', year)
        current_date = ''
        current_date = [year, month, day].join('-');
    });

    // Select row on clicking it
    // $('#myTable').on('click', 'tr', function () {


    //     $("tr").toggleClass('selected');
    // });


    $('#deleteRow').click('#myTable', function (e) {
        console.log('deletion btn working')
        // var row = table.row($('#myTable tr:last'));
        var row = table.row($('td.active').parents('tr'));
        if (confirm('Are you sure to delete the row')) {
            // Save it!
            row.remove();

            table
                .draw();
        } else {
            // Do nothing!
            console.log('row deletion canceled');
        }
    });

    // <-- dependency function are begin -->   


    function muliple_calutlation(row, column_a, column_b, calc) { // multiplication calucultation

        value_a = table.cell({ row: row, column: column_a }).data() ? parseInt(table.cell({ row: row, column: column_a }).data()) : 0; //column_A is rate  
        value_b = table.cell({ row: row, column: column_b }).data() ? parseInt(table.cell({ row: row, column: column_b }).data()) : 1; //coloumn_b is qty
        // console.log("value_a ", value_a)
        // console.log("value_B ", value_b)
        table.cell({ row: row, column: calc }).data(value_a * value_b); //add calculation 
    }

    function today_date() {
        let today = new Date()
        // console.log('today date is ', today)
        today = today.toISOString().split('T')[0]
        current_date = today.split("-").join("-");
        document.getElementById("date").value = today;
    }


    function default_value(row, column, value) {
        // console.log('value is value', value)
        frappe.db.get_value('Item', value, 'stock_uom')
            .then(r => {

                // console.log("Item date and stock_uom", r.message.stock_uom);
                table.cell({ row: row, column: uom_ }).data(r.message.stock_uom); //add default value in uom 
                $(`#myTable tr:nth-child(${row + 1}) td:nth-child(${uom_ + 1})`).show().focus()
            })
            .catch(e => console.log("error", e))
    }

    function default_customerlist(row, column, value) {
        // console.log('value is value', value)
        // frappe.db.get_value('Customer', {"site": value}, 'site_list', function(value) {
        //     site = value})
        //     .then(r => {

        //         console.log("Customer date and site_list", r.message);
        //         table.cell({ row: row, column: coustomer__site }).data(r.message); //add default value in uom 
        //     })
        //     .catch(e => console.log("error", e))
        frappe.db.get_doc('Customer', value)
            .then(doc => {
                // let s_coustomer =
                array_alpha(doc.doc.site_list, 'site')

                // let items = doc.site_list
                // console.log('items in the doc are', items)
                // $('.suggestions li').remove();
                // s_coustomer.map((x) => {
                //     // console.log("current value are", x.site_name)
                //     $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x}</li>`); //add value to suggestion part
                // })
                // $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`);

            })
    }

    function default_driver() {
        // console.log("default driver")
        let selected_vehicle = $('#vehicle option').filter(':selected').val();
        // console.log('selected vehicle', selected_vehicle)
        frappe.db.get_value('Vehicle', selected_vehicle, 'driver')

            .then(r => {

                // console.log("Driver date and driver", r, table.rows().count());
                table.cell({ row: table.rows().count() - 1, column: driver_ }).data(r.message.driver); //add default value in driver
            })
            .catch(e => console.log("error", e))
    }

    function validation_scan() {
        validation_array = []
        let table = $('#myTable').DataTable()
        let row = table.rows().count();
        let net_col = 32
        console.log("validation calling", row, 32)
        for (i = 0; i < row; i++) {
            console.log("row value is ", i)
            for (j = 0; j < net_col; j++) {
                // table.cell({ row: i, column: j }).data()?console.log(`value not found in cell row :${i} column:${J}`):console.log(`value not found in cell row :${i} column:${J}`);

                table.cell({ row: i, column: j }).data() ?
                    (console.log(`%c value  found : ${table.cell({ row: i, column: j }).data()}`, 'background:yellow;color:green'),
                        console.log("flag value is", flag)
                    ) :
                    (
                        j == driver_ || j == item_ || j == uom_ || j == sales__person ||
                            j == supplier_rate || j == supplier_qty || j == supplier_amt || j == supplier__site ||
                            j == coustomer_ || j == coustomer__site || j == coustomer__amt ||
                            j == coustomer__qty || j == coustomer__rate || j == coustomer__rate__type ||
                            j == supplier_ || j == frc_ || j == total_vehicle_rent || j == frc_gst ||
                            j == bata__amount || j == net_vehicle_balance ?
                            (
                                validation_array = [...validation_array, { "row": i, "column": j }]
                            ) :
                            ""
                    )
            }
        }
    }

    function validation_handler() {
        $('#alertdata').empty()
        $('#alertdata').append("Mandatory Field Are Not Completed"),
            console.log('validation handler calling ', validation_array)
        let rows_ = table.rows().count()
        for (i = 1; i <= rows_; i++) {
            for (j = 1; j <= col_count; j++) {
                console.log(`row:${i},column:${j}`)
                $(`#myTable tr:nth-child(${i}) td:nth-child(${j})`).removeClass('border border-danger bg-light')
            }
        }
        validation_array.length >= 1 ?
            (
                validation_array.map(x => {
                    cell_border_error(x.row, x.column)
                })) :
            ""
    }

    function cell_border_error(row, column) {
        $(`#myTable tr:nth-child(${row + 1}) td:nth-child(${column + 1})`).addClass('border border-danger bg-light')
    }

    function cell_border_error_remove(row, column) {
        $(`#myTable tr:nth-child(${row + 1}) td:nth-child(${column + 1})`).removeClass('border border-danger bg-light')
    }

    function check_integer() {
        let tdvalue = parseInt($('#myTable').DataTable().cell("td.active").data())
        // console.log("td value is ", tdvalue)
        // Number.isInteger(tdvalue)&&tdvalue>0?true:false
        if (Number.isInteger(tdvalue) && tdvalue > 0) {
            return true
        }
    }

    function closeSnoAlertBox() {
        window.setTimeout(function () {
            $("#alert_card").fadeOut(300)
        }, 3000);
    }

    //set array value to alphabet order and lowercase
    function array_alpha(value, attr) {
        let array_space = []
        value.filter(m => {
            array_space = [...array_space, `${m[`${attr}`].toLowerCase()}`]
        })
        $('.suggestions li').remove();
        array_space = array_space.sort()
        $('.suggestions li').remove();
        array_space.map((x) => {
            $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary pe-auto hover pe-auto nav-link list-group-item-action">${x}</li>`); //add value to suggestion part
        })
        $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover pe-auto nav-link list-group-item-action select list-group-item ">Close</li>`); //close btn value selected
        myList = document.getElementById('suggestion_list');
        count = 0
        liSelected = document.querySelectorAll('#suggestion_list li')
        ul_value = document.querySelector('#suggestion_list');
        li_nodes = document.querySelectorAll('#suggestion_list > li');
        // console.log('ul-value', ul_value, 'li-node', li_nodes)

        // return array_space
    }

    // <-- dependency function are END -->


}