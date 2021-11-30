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
        "jquery_chosen": "https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery.min.js",
        "jquery_datatable": "https://cdn.datatables.net/v/dt/dt-1.11.0/datatables.min.js",
        "jquery_auto": "https://unpkg.com/contenteditable-autocomplete@1.0.2/dist/contenteditable-autocomplete.js",
        "css_auto": "https://unpkg.com/contenteditable-autocomplete@1.0.2/dist/contenteditable-autocomplete.css",
        "css_datatable": "https://cdn.datatables.net/v/dt/dt-1.11.0/datatables.min.css",
        "css_chosen": "https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.min.css"
    };



    // Decalre required variables
    let current_date //set date 
    let selected_vehicle //selected option for vehicle 
    let table //used for creating datatable 
    let counts = 0
    let rows //used for storing rows empty array
    let col_count = 32  //The count of empty arrays to be created
    let partner_amount_array
    let Options = ['Rent', 'Rate'];
    let gst_percentage = ['5%'];
    // index of cell in table  
    let driver_ = 0
    let item_ = 1
    let uom_ = 2
    let supplier_ = 3
    let supplier__site = 4
    let supplier_rate = 5
    let supplier_qty = 6
    let sales__person = 7
    let supplier_amt = 8
    let supplier_partner = 9
    let partner__rate = 10
    let partner__qty = 11
    let partner__amt = 12
    let coustomer_ = 13
    let coustomer__site = 14
    let gst_p_ = 15
    let coustomer__rate__type = 16
    let coustomer__rate = 17
    let coustomer__qty = 18
    let coustomer__amt = 19
    let gst_amount = 20
    let no__of__tips = 21
    let distance_ = 22
    let recived__cash__amt = 23
    let payment__method = 24
    let total_vehicle_rent = 25
    let frc_ = 26
    let frc_gst = 27
    let bata__rate = 28
    let bata__percentage = 29
    let bata__amount = 30
    let net_vehicle_balance = 31





    // Load Jquery UI using Jquery getScript function.
    $.getScript(js_libs.jquery_ui)
        // Done is a chained with multiple function called
        // one after the other.
        .done(function (script, textStatus) {

            console.log("ui loaded")
            $.getScript(js_libs.jquery_chosen)
                .done(
                    function (e) {
                        frappe.db.get_list('Vehicle', { fields: ['license_plate'] })
                            .then(
                                r => {
                                    // console.log("value are ", r)
                                    r.map((x) => {
                                        console.log("vehicle no plate mapping", x.license_plate)
                                        // var optn = elmts[x.license_plate];
                                        var el = document.createElement("option");
                                        el.textContent = x.license_plate;
                                        el.value = x.license_plate;
                                        select.appendChild(el);
                                    })
                                    $("#vehicle").chosen({ no_results_text: "Oops, nothing found!" })
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
                                console.log("table loaded")

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
                                today_date();//onload  set date
                                $(".suggestions").addClass("d-none");// onload to remove suggestion box
                                $('#addRow').on('click', function add_row() {
                                    rows = [];
                                    counts = 0
                                    //Array for adding row
                                    for (i = 1; i <= col_count; i++) {
                                        rows.push("");

                                    }
                                    table.row.add(rows).draw(true);
                                    $('.suggestions li').removeClass('active');
                                });
                                //creating new row on entering press inside the table
                                $("#myTable").keypress(function (event) {
                                    if (event.keyCode === 13) {
                                        row_add()

                                    }
                                });

                                //Cell for table creation     
                                const createdCell = function (cell) {
                                    let original
                                    console.log("cell creation", counts)
                                    //condition for contenteditable true or false --start
                                    counts == supplier_amt ?
                                        cell.setAttribute('contenteditable', false)
                                        :
                                        cell.setAttribute('contenteditable', true)
                                    //condition for contenteditable true or false --end

                                    cell.setAttribute('spellcheck', false)
                                    cell.setAttribute('class', "cell")

                                    counts=counts+1
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
                                    "ordering": false   //sorting removed
                                })

                            },
                            // Second function in done
                            function (e) {
                                rows = []

                                //Array for adding row
                                for (i = 1; i <= col_count; i++) {
                                    rows.push("");

                                }

                                $('#myTable').DataTable().row.add(rows).draw(true)
                                $("#body").find("tbody").on('click', '#myTable', function (e) {
                                    console.log('td working and add active tag')
                                    $("td").removeClass("active")
                                    e.target.classList.add('active');
                                })

                                $("#body").find("tbody").on(' keypress paste input ', '[contenteditable]', 'td', function (e) {
                                    totalrow = $('#myTable').DataTable().cell(this).index().row //find totalrow in table
                                    //Get value of TD  

                                    var query = e.target.innerHTML
                                    //console.log(this.innerHTML)
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
                                    $(".suggestions").removeClass("d-none")// to remove d-none in suggestion div
                                    $('#myTable').css({ 'position': 'relative' })
                                    // $('.suggestions').css({ 'margin-left': '40px', 'width': '200px', 'background-color': 'black', 'color': 'white' })
                                    // $('#customfield_10102').css({ 'width': '200px' });

                                    // frappe.db.get_list('Driver', { fields: ['full_name'] })

                                    if (e.which == 27) {
                                        $(".suggestions").addClass("d-none")
                                    }
                                    if (e.which == 38) {
                                        console.log("keyup pressed")
                                    }



                                    if (e.which == 40) {
                                        console.log("keydown pressed")
                                    }

                                    //api fetch for suggestion part start
                                    if ($('#myTable').DataTable().cell(this).index().column == driver_) { //fetch data customer api 
                                        // console.log("td values are", query);


                                        q = query + "%"
                                        console.log(q)

                                        frappe.call({
                                            method: 'frappe.client.get_list',
                                            args: {
                                                doctype: 'Driver',
                                                fields: ['full_name'],
                                                filters: [
                                                    ['full_name', 'like', q],

                                                ]
                                            },
                                            callback: (e) => {
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {


                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary pe-auto hover pe-auto nav-link list-group-item-action">${x.full_name}</li>`); //add value to suggestion part


                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover pe-auto nav-link list-group-item-action select list-group-item ">Close</li>`); //close btn value selected
                                            }
                                        })
                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == item_) {
                                        q = query + "%"
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
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.item_code)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.item_code}</li>`); //add value to suggestion part

                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })
                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == uom_) {
                                        q = query + "%"
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
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.uom_name)
                                                    // console.log("length of box is ", $('.suggestions  li').length)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.uom_name}</li>`); //add value to suggestion part
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })
                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == sales__person) {
                                        q = query + "%"
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
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.uom_name)
                                                    // console.log("length of box is ", $('.suggestions  li').length)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.sales_person_name}</li>`); //add value to suggestion part
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })
                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == supplier_) {
                                        q = query + "%"
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
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.supplier_name)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.supplier_name}</li>`); //add value to suggestion part
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })
                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == supplier__site) {
                                        q = query + "%"
                                        frappe.call({
                                            method: 'frappe.client.get_list',
                                            args: {
                                                doctype: 'Site',
                                                fields: ['site_name'],
                                                filters: [
                                                    ['site_name', 'like', q],

                                                ]
                                            },
                                            callback: (e) => {
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.site_name)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.site_name}</li>`); //add value to suggestion part
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })

                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == supplier_partner) {
                                        // cars.map((x) => {
                                        //     $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x}</li>`);
                                        // })

                                        q = query + "%"
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
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.supplier_name)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.supplier_name}</li>`); //add value to suggestion part
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })

                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == coustomer_) {
                                        q = query + "%"
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
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.customer_name)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.customer_name}</li>`); //add value to suggestion part
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })

                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == coustomer__site) {
                                        q = query + "%"
                                        frappe.call({
                                            method: 'frappe.client.get_list',
                                            args: {
                                                doctype: 'Site',
                                                fields: ['site_name'],
                                                filters: [
                                                    ['site_name', 'like', q],

                                                ]
                                            },
                                            callback: (e) => {
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.site_name)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.site_name}</li>`); //add value to suggestion part
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })
                                    }
                                    if ($('#myTable').DataTable().cell(this).index().column == coustomer__rate__type) {
                                        Options.map((x) => {
                                            $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x}</li>`);
                                        })
                                        $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                    }

                                    if ($('#myTable').DataTable().cell(this).index().column == gst_p_) {
                                        gst_percentage.map((x) => {
                                            $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x}</li>`);
                                        })
                                        $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                    }

                                    if ($('#myTable').DataTable().cell(this).index().column == payment__method) {
                                        q = query + "%"
                                        frappe.call({
                                            method: 'frappe.client.get_list',
                                            args: {
                                                doctype: 'Mode of Payment',
                                                fields: ['name'],
                                                filters: [
                                                    ['name', 'like', q],
                                                ]
                                            },
                                            callback: (e) => {
                                                r = e.message
                                                $('.suggestions li').remove();
                                                r.map((x) => {
                                                    // console.log("current value are", x.name)
                                                    $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x.name}</li>`); //add value to suggestion part
                                                })
                                                $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                            }
                                        })

                                    }
                                    //api fetch for suggestion part end



                                });
                                //hide suggestion area 
                                $('body').on('click', function () {
                                    // $('.suggestions ul').remove();

                                    $(".suggestions").addClass("d-none")
                                    // e.target.classList.add('active');
                                })

                                // //CODE ADDING STACKOVERFLOW
                                // //check suggestion dropdown arrow key function working --start
                                // $("#body").find("tbody").on(' keyup keydown', '[contenteditable]', '#myTable', function (e) {
                                //     // var objCurrentLi, obj = $('.suggestions').find('.suggestions li'), objUl = $('.suggestions ul'), code = (e.keyCode ? e.keyCode : e.which);
                                //     // console.log('length if suggestion', obj)
                                //     // if (e.which == 40) {  //Up Arrow
                                //     //     console.log("suggestion arrow up working properley")
                                //     //     if ((obj.length === 0) || (objUl.find('.suggestions li:last').hasClass('bg-info') === true)) {
                                //     //         objCurrentLi = objUl.find('.suggestions li:first').addClass('bg-info');
                                //     //     }
                                //     //     else {
                                //     //         objCurrentLi = obj.next().addClass('bg-info');
                                //     //     }
                                //     //     obj.removeClass('bg-info');
                                //     // }
                                //     // else if (e.which == 38) {  //Down Arrow
                                //     //     console.log("suggestion arrow down working properley")
                                //     //     if ((obj.length === 0) || (objUl.find('.suggestions li:first').hasClass('bg-info') === true)) {
                                //     //         objCurrentLi = objUl.find('.suggestions li:last').addClass('bg-info');
                                //     //     }
                                //     //     else {
                                //     //         objCurrentLi = obj.prev().addClass('bg-info');
                                //     //     }
                                //     //     obj.removeClass('bg-info');
                                //     // }

                                //     var li = $('.suggestions > li');
                                //     var liSelected = $('.suggestions li');
                                //     $(window).on('keydown', function (e) {
                                //         var selected;
                                //         if (e.which === 40) {
                                //             console.log("key press down")
                                //             console.log('sugggestion li if condtion true', liSelected[0].add("bg-danger"))
                                //             if (liSelected) {
                                //                 console.log("li selected value",liSelected)
                                //                 liSelected.removeClass('bg-danger');
                                //                 next = liSelected.next();
                                //                 if (next.length > 0) {
                                //                     liSelected = next.addClass('bg-light');
                                //                     selected = next.text();

                                //                 } else {

                                //                     liSelected = li.eq(0).addClass('bg-warning');
                                //                     selected = li.eq(0).text();
                                //                 }
                                //             } else {
                                //                 liSelected = li.eq(0).addClass('bg-warning');
                                //                 selected = li.eq(0).text();
                                //             }
                                //         } else if (e.which === 38) {
                                //             ("key press up")
                                //             if (liSelected) {
                                //                 liSelected.removeClass('bg-light');
                                //                 next = liSelected.prev();
                                //                 if (next.length > 0) {
                                //                     liSelected = next.addClass('bg-info');
                                //                     selected = next.text();

                                //                 } else {

                                //                     liSelected = li.last().addClass('bg-secondary');
                                //                     selected = li.last().text()
                                //                 }
                                //             } else {

                                //                 liSelected = li.last().addClass('bg-secondary');
                                //                 selected = li.last().text()
                                //             }
                                //         }
                                //     })
                                //     //check suggestion dropdown arrow key function working --end
                                //     //CODE ADDING STACKOVERFLOW
                                // })



                                // add data into a cell
                                $("#body").find("tbody").on('click', '[contenteditable]', '#myTable', function (e) {
                                    console.log("on clicked on td cell")
                                    $('td.active').removeClass('active');
                                    $('td.active').add('active');



                                })
                                $('.suggestions').click('li', (e) => {
                                    let table = $('#myTable').DataTable()



                                    //check close value is selected 
                                    if (e.target.innerHTML == "Close") {
                                        // console.log("close btn clicked")
                                        $(".suggestions").addClass("d-none")
                                    }
                                    //Ensure only click on li triggers adding data to td
                                    else if ($(e.target).is('li')) {
                                        $(".suggestions").addClass("d-none")
                                        // $("td.active").html(e.target.innerText)


                                        var cell = $('#myTable').DataTable().cell("td.active")
                                        console.log('selected cell', cell)
                                        cell.data(e.target.innerText).draw()


                                        // gst claculation done while select 5% --start
                                        let r = cell.index().row
                                        let customer_amount = table.cell({ row: r, column: coustomer__amt }).data() ? parseFloat(table.cell({ row: r, column: coustomer__amt }).data()) : 0;
                                        let gst_calc = parseFloat(customer_amount * .05).toFixed(2)
                                        console.log("gst claac", gst_calc)
                                        e.target.innerText == "5%" ?
                                            (table.cell({ row: r, column: gst_amount }).data(gst_calc))
                                            :
                                            (table.cell({ row: r, column: gst_amount }).data(0))
                                        // gst claculation done while select 5% --end

                                    }



                                })

                                //         //keyup
                                $("#body").find("tbody").on('blur', 'td', function (e) {


                                    let table = $('#myTable').DataTable()
                                    let cell = table.cell(this)
                                    let row = cell.index().row
                                    let column = cell.index().column
                                    cell.data(this.innerText).draw()

                                    // muliple_calutlation(r,9,10,11)
                                    // value_a = table.cell({ row: r, column: column_a }).data() ? parseInt(table.cell({ row: r, column: column_a }).data()) : 0;
                                    // value_b = table.cell({ row: r, column: 10 }).data() ? parseInt(table.cell({ row: r, column: column_a }).data()) : 1;
                                    // console.log("value_a ", value_a)
                                    // table.cell({ row: r, column: 11 }).data(value_a + value_b);

                                    // console.log("Row:", table.row(`:eq(${r})`).remove())     

                                    // supplier total == supplier rate*supplier_qty
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
                                        cell.index().column == coustomer__rate || cell.index().column == coustomer__qty
                                        || cell.index().column == gst_p_ || cell.index().column == coustomer__amt || cell.index.column == coustomer__rate__type

                                    ) {
                                        let r = cell.index().row
                                        let customer_amount = table.cell({ row: r, column: coustomer__amt }).data() ? parseFloat(table.cell({ row: r, column: coustomer__amt }).data()) : 0;
                                        table.cell({ row: r, column: gst_p_ }).data() == "5%" ? table.cell({ row: row, column: gst_amount }).data((customer_amount * .05).toFixed(2)) : table.cell({ row: row, column: gst_amount }).data((0).toFixed(2))

                                    }
                                    //check customer type ==rate ,then,customer total == customer rate*customer_qty
                                    if (cell.index().column == coustomer__rate || cell.index().column == coustomer__qty || cell.index().column == coustomer__amt) {
                                        let r = cell.index().row
                                        table.cell({ row: r, column: coustomer__rate__type }).data() == "Rate" ? muliple_calutlation(r, coustomer__rate, coustomer__qty, coustomer__amt) : ""

                                        // customer type='rent' => coustomer amt / coustomer qty
                                        table.cell({ row: r, column: coustomer__rate__type }).data() == "Rent" ? (

                                            value_a = table.cell({ row: row, column: coustomer__amt }).data() ? parseInt(table.cell({ row: row, column: coustomer__amt }).data()) : 0, //column_A is rate  
                                            value_b = table.cell({ row: row, column: coustomer__qty }).data() ? parseInt(table.cell({ row: row, column: coustomer__qty }).data()) : 1,  //coloumn_b is qty
                                            table.cell({ row: row, column: coustomer__rate }).data(value_a / value_b) //add calculation 

                                        ) : ""
                                        let coustomer_amt = table.cell({ row: row, column: coustomer__amt }).data() ? parseInt(table.cell({ row: row, column: coustomer__amt }).data()) : 1;
                                        table.cell({ row: r, column: gst_p_ }).data() == "5%" ? table.cell({ row: row, column: gst_amount }).data((coustomer_amt * .05).toFixed(2)) : table.cell({ row: row, column: gst_amount }).data((0).toFixed(2))

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
                                        let r = cell.index().row;
                                        let bata_rate = table.cell({ row: r, column: bata__rate }).data() ? parseFloat(table.cell({ row: r, column: bata__rate }).data()) : 0;
                                        table.cell({ row: r, column: bata__percentage }).data(0);
                                        table.cell({ row: r, column: bata__amount }).data(bata_rate);
                                    }
                                    // BATA TOTAL = BATA PERCENTAGE * TOTAL VEHICLE RENT
                                    if (cell.index().column == bata__percentage) {
                                        let r = cell.index().row;
                                        table.cell({ row: r, column: bata__rate }).data(0);
                                        let bata_percentage = table.cell({ row: r, column: bata__percentage }).data() ? (parseInt(table.cell({ row: r, column: bata__percentage }).data()) / 100) * parseFloat(table.cell({ row: r, column: total_vehicle_rent }).data()) : 0;
                                        table.cell({ row: r, column: bata__amount }).data(bata_percentage);
                                    }

                                    //TOTAL = CUSTOMER_AMOUNT - PARTNER_AMOUNT-SUPPLIER_AMOUNT-NETFRC
                                    if (
                                        cell.index().column == supplier_rate || cell.index().column == supplier_qty
                                        || cell.index().column == partner__rate || cell.index().column == partner__qty
                                        || cell.index().column == coustomer__rate || cell.index().column == coustomer__qty
                                        || cell.index().column == frc_ || cell.index().column == gst_amount
                                        || cell.index().column == frc_gst || cell.index().column == coustomer__amt
                                    ) {
                                        let r = cell.index().row
                                        let partner_amount = table.cell({ row: r, column: partner__amt }).data() ? parseInt(table.cell({ row: r, column: partner__amt }).data()) : 0;
                                        let customer_amount = table.cell({ row: r, column: coustomer__amt }).data() ? parseInt(table.cell({ row: r, column: coustomer__amt }).data()) : 0;
                                        let supplier_amount = table.cell({ row: r, column: supplier_amt }).data() ? parseInt(table.cell({ row: r, column: supplier_amt }).data()) : 0;
                                        let net_frc = table.cell({ row: r, column: frc_gst }).data() ? parseFloat(table.cell({ row: r, column: frc_gst }).data()) : 0;
                                        // console.log("customer amt",customer_amount,"partner amt",partner_amount,"supplier_amount",supplier_amount,"net_frc",net_frc)
                                        let total = customer_amount - partner_amount - supplier_amount - net_frc
                                        // console.log("total value is ",total)
                                        table.cell({ row: r, column: total_vehicle_rent }).data(total)//total value
                                    }

                                    //NET TOTAL = TOTAL - BATA RATE
                                    if (
                                        cell.index().column == supplier_rate || cell.index().column == supplier_qty
                                        || cell.index().column == partner__rate || cell.index().column == partner__qty
                                        || cell.index().column == coustomer__rate || cell.index().column == coustomer__qty
                                        || cell.index().column == frc_ || cell.index().column == gst_amount
                                        || cell.index().column == frc_gst || cell.index().column == coustomer__amt
                                        || cell.index().column == total_vehicle_rent || cell.index().column == bata__rate
                                        || cell.index().column == bata__percentage || cell.index().column == bata__amount

                                    ) {
                                        let r = cell.index().row
                                        let total = table.cell({ row: r, column: total_vehicle_rent }).data() ? parseFloat(table.cell({ row: r, column: total_vehicle_rent }).data()) : 0;
                                        let bata_amt = table.cell({ row: r, column: bata__amount }).data() ? parseInt(table.cell({ row: r, column: bata__amount }).data()) : 0;
                                        // console.log("total",total,"bata_amt",bata_amt)
                                        let net_total = total - bata_amt
                                        // console.log("net_total",net_total)
                                        table.cell({ row: r, column: net_vehicle_balance }).data(net_total)//net_total
                                    }

                                })



                                $('body').on('focus', '[contenteditable]', function () {
                                    $("td").removeClass("active")
                                    $(".suggestions").addClass("d-none");// onload to remove suggestion box
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
                                        console.log("changed",)



                                    }
                                    console.log("not changed")
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
            $("div.log").text("Triggered ajaxError handler.")
        });





    // Post data from DataTable to backend
    $('#getData').on('click', function () {

        let table = $('#myTable').DataTable()
        // let selected_value = $("#vehicle option:first").attr('selected', 'selected');
        console.log($('#vehicle option').filter(':selected').val())
        selected_vehicle = $('#vehicle option').filter(':selected').val();
        current_date ? current_date : today_date()
        // $table_data = table.rows().data();
        // console.log("table row is",table.row(':eq(0)').cell(':eq(11)').data( "safwan" ).draw()) 
        console.log(table.rows().count())
        console.log("partner_amt_array", partner_amount_array)

        let total_rows = table.rows().count()

        $table_data = $('#myTable').DataTable().rows().data().toArray()
        console.log("data in table", $table_data, "current date", current_date, "selected data", selected_vehicle)
        // json_data = JSON.stringify($table_data);
        // console.log(json_data)
        // frappe.call({
        //     method: "ev_gn.post_trip_data.post_data",
        //     // args: { "row_array": $table_data, "date": current_date, "selected_vehicle": selected_vehicle }
        //     args: { 
        //         'selected_vehicle': "vehicle" 
        //     }

        //     callback: function(r)!dz

        //     {
        //         frappe.throw(r.message)
        //     }
        // })

        frappe.call({
            method: 'ev_gn.post_trip_data.post_data',
            args: { arg1: selected_vehicle, arg2: current_date, arg3: $table_data }

            // callback: function(r) {r.message}
            // callback: function(r) {
            //     if (!r.exc) {
            //         // code snippet
            //     }
            // }
        })
            .then(
                (e) => {
                    console.log("Success", e),
                        location.reload()
                }
            )
            .catch((e) => console.log("Error", e))
        // frappe.call('ev_gn.post_trip_data.post_data_test', {
        //     "a":1
        // }).then(r => {
        //     console.log(r.message)
        // })


    });
    $('#SaveAndHoldData').on('click', function () {

        let table = $('#myTable').DataTable()
        // let selected_value = $("#vehicle option:first").attr('selected', 'selected');
        console.log($('#vehicle option').filter(':selected').val())
        selected_vehicle = $('#vehicle option').filter(':selected').val();
        current_date ? current_date : today_date()
        // $table_data = table.rows().data();
        // console.log("table row is",table.row(':eq(0)').cell(':eq(11)').data( "safwan" ).draw()) 
        console.log(table.rows().count())
        console.log("partner_amt_array", partner_amount_array)

        let total_rows = table.rows().count()

        $table_data = $('#myTable').DataTable().rows().data().toArray()
        console.log("data in table", $table_data, "current date", current_date, "selected data", selected_vehicle)
        // json_data = JSON.stringify($table_data);
        // console.log(json_data)
        // frappe.call({
        //     method: "ev_gn.post_trip_data.post_data",
        //     // args: { "row_array": $table_data, "date": current_date, "selected_vehicle": selected_vehicle }
        //     args: { 
        //         'selected_vehicle': "vehicle" 
        //     }

        //     callback: function(r)!dz

        //     {
        //         frappe.throw(r.message)
        //     }
        // })

        frappe.call({
            method: 'ev_gn.post_trip_data.post_data',
            args: { arg1: selected_vehicle, arg2: current_date, arg3: $table_data }

            // callback: function(r) {r.message}
            // callback: function(r) {
            //     if (!r.exc) {
            //         // code snippet
            //     }
            // }
        })
            .then(
                (e) => {
                    console.log("Success", e),
                        location.reload()
                }
            )
            .catch((e) => console.log("Error", e))
        // frappe.call('ev_gn.post_trip_data.post_data_test', {
        //     "a":1
        // }).then(r => {
        //     console.log(r.message)
        // })


    });

    // Autoselect Data


    // Creating drop down list funtion
    var elmts = ["Etios", "Innova", "Cressida", "Corolla", "Camry"];
    var select = document.getElementById("vehicle");

    // function create_vehicle_list() {

    //     frappe.db.get_list('Vehicle', { fields: ['license_plate'] })
    //         .then(
    //             r => {
    //                 // console.log("value are ", r)
    //                 r.map((x) => {
    //                     console.log("vehicle no plate mapping", x.license_plate)
    //                     // var optn = elmts[x.license_plate];
    //                     var el = document.createElement("option");
    //                     el.textContent = x.license_plate;
    //                     el.value = x.license_plate;
    //                     select.appendChild(el);
    //                 })
    //             }
    //         )
    //         .catch(err => console.log("erorr is", err))

    //     // down.innerHTML = "Elements Added";
    //     console.log("clicked");
    // }
    // create_vehicle_list()

    $('#vehicle').on('click change', function (e) {
        console.log("vehicle changed ", e.target.value)
        // alert( this.value );
        selected_vehicle = ''
        selected_vehicle = this.value
        console.log('selected vehicle', selected_vehicle)
    });
    // });
    $('#date').on('change', function () {
        var date = new Date($('#date').val());
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        current_date = ''
        current_date = [day, month, year].join('-');
        //   alert([day, month, year].join('/'));

    });

    // Select row on clicking it
    $('#myTable').on('click', 'tr', function () {


        $(this).toggleClass('selected');
    });


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

    function muliple_calutlation(row, column_a, column_b, calc) { // multiplication calucultation
        // console.log("muliple calutlation", "=>", "row", row, "columna:", column_a, "columnb:", column_b, calc)
        // console.log(this.innerText);
        // console.log(cell.index().row)
        // let r = cell.index().row
        value_a = table.cell({ row: row, column: column_a }).data() ? parseInt(table.cell({ row: row, column: column_a }).data()) : 0; //column_A is rate  
        value_b = table.cell({ row: row, column: column_b }).data() ? parseInt(table.cell({ row: row, column: column_b }).data()) : 1;  //coloumn_b is qty
        console.log("value_a ", value_a)
        console.log("value_B ", value_b)
        table.cell({ row: row, column: calc }).data(value_a * value_b); //add calculation 

        // table.cell({ row: row, column: gst_p_ }).data() == "5%" ? table.cell({ row: row, column: gst_amount }).data((value_a * value_b * .05).toFixed(2)) : ""
        // table.cell({ row: r, column: gst_p_ }).data() == "5%" ? table.cell({ row: row, column: gst_amount }).data(value_a * value_b * .05) : ""
        // console.log("value in gst percentage",table.cell({ row: r, column: gst_amount }).data())
    }
    // function gst_clacution(row) {
    //     let customer_amount = table.cell({ row: r, column: coustomer__amt }).data() ? parseFloat(table.cell({ row: r, column: coustomer__amt }).data()) : 0;
    //     let gst_calc = parseFloat(customer_amount * .05).toFixed(2)
    //     console.log("gst claac", gst_calc)
    //     e.target.innerText == "5%" ?
    //         (table.cell({ row: 0, column: gst_amount }).data(gst_calc))
    //         :
    //         (table.cell({ row: 0, column: gst_amount }).data(0))
    // }
    function today_date() {
        let today = new Date()
        today = today.toISOString().split('T')[0]
        current_date = today.split("-").join("-");
        document.getElementById("date").value = today;
    }

}