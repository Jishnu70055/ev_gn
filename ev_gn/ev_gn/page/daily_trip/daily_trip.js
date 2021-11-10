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
    let rows //used for storing rows empty array
    let col_count = 29  //The count of empty arrays to be created
    let partner_amount_array
    let Options = ['Rent', 'Rate'];


    // Load Jquery UI using Jquery getScript function.
    $.getScript(js_libs.jquery_ui)
        // Done is a chained with multiple function called
        // one after the other.
        .done(function (script, textStatus) {

            console.log("ui loaded")
            $.getScript(js_libs.jquery_chosen)
                .done(
                    function (e) {
                        $("#vehicle").chosen({ no_results_text: "Oops, nothing found!" }),
                        console.log("js libs call jquery chosen")
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
                                    cell.setAttribute('contenteditable', true)

                                    cell.setAttribute('spellcheck', false)
                                    cell.setAttribute('class', "cell")


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
                                    if ($('#myTable').DataTable().cell(this).index().column == 0) { //fetch data customer api 
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
                                    if ($('#myTable').DataTable().cell(this).index().column == 1) {
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
                                    if ($('#myTable').DataTable().cell(this).index().column == 2) {
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
                                    if ($('#myTable').DataTable().cell(this).index().column == 3) {
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
                                    if ($('#myTable').DataTable().cell(this).index().column == 4) {
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
                                    if ($('#myTable').DataTable().cell(this).index().column == 8) {
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
                                    if ($('#myTable').DataTable().cell(this).index().column == 12) {
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
                                    if ($('#myTable').DataTable().cell(this).index().column == 13) {
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
                                    if ($('#myTable').DataTable().cell(this).index().column == 14) {
                                        Options.map((x) => {
                                            $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-primary hover  list-group-item list-group-item-action">${x}</li>`);
                                        })
                                        $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover ">Close</li>`); //close btn value selected
                                    }

                                    if ($('#myTable').DataTable().cell(this).index().column == 19) {
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
                                $("#body").find("tbody").on('click', '[contenteditable]', '#myTable', function (e) {
                                    console.log("on clicked on td cell")
                                    $('td.active').removeClass('active');
                                    $('td.active').add('active');

                                })
                                $('.suggestions').click('li', (e) => {


                                    // console.log(e.target.innerText)
                                    // console.log("suggestion value are ", e.target.innerHTML)
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


                                        console.log("this is cell", cell)
                                        // cell.data(this.innerText).draw()
                                        // $('td.active').removeClass('active');
                                        // var row = table.row($('td.active').parents('tr'));
                                        // console.log("suggestion add btn row value is", row)
                                        // var rowNode = row.node();
                                        // console.log("suggestion add btn rowbide value is", rowNode)
                                        // row.remove();

                                        // table
                                        //     .draw();
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
                                    if (cell.index().column == 5 || cell.index().column == 6) {
                                        let r = cell.index().row
                                        muliple_calutlation(r, 5, 6, 7)
                                    }
                                    // partner total == partner rate*partner_qty
                                    if (cell.index().column == 9 || cell.index().column == 10) {
                                        let r = cell.index().row
                                        muliple_calutlation(r, 9, 10, 11)
                                    }
                                    //check customer type ==rate ,then,customer total == customer rate*customer_qty
                                    if (cell.index().column == 15 || cell.index().column == 16) {
                                        let r = cell.index().row
                                        table.cell({ row: r, column: 14 }).data() == "Rate" ? muliple_calutlation(r, 15, 16, 17) : ""

                                    }

                                    //NET FRC = FRC+GST AMOUNT
                                    if (cell.index().column == 24 || cell.index().column == 26) {
                                        let r = cell.index().row
                                        let frc = table.cell({ row: r, column: 24 }).data() ? parseInt(table.cell({ row: r, column: 24 }).data()) : 0;
                                        let gst_amt = table.cell({ row: r, column: 26 }).data() ? parseInt(table.cell({ row: r, column: 26 }).data()) : 0;
                                        table.cell({ row: r, column: 27 }).data(frc + gst_amt);
                                    }

                                    //TOTAL = CUSTOMER_AMOUNT - PARTNER_AMOUNT-SUPPLIER_AMOUNT-NETFRC
                                    if (
                                        cell.index().column == 5 || cell.index().column == 6
                                        || cell.index().column == 9 || cell.index().column == 10
                                        || cell.index().column == 15 || cell.index().column == 16
                                        || cell.index().column == 24 || cell.index().column == 26
                                        || cell.index().column == 27 || cell.index().column == 17
                                    ) {
                                        let r = cell.index().row
                                        let partner_amount = table.cell({ row: r, column: 11 }).data() ? parseInt(table.cell({ row: r, column: 11 }).data()) : 0;
                                        let customer_amount = table.cell({ row: r, column: 17 }).data() ? parseInt(table.cell({ row: r, column: 17 }).data()) : 0;
                                        let supplier_amount = table.cell({ row: r, column: 7 }).data() ? parseInt(table.cell({ row: r, column: 7 }).data()) : 0;
                                        let net_frc = table.cell({ row: r, column: 27 }).data() ? parseInt(table.cell({ row: r, column: 27 }).data()) : 0;
                                        // console.log("customer amt",customer_amount,"partner amt",partner_amount,"supplier_amount",supplier_amount,"net_frc",net_frc)
                                        let total = customer_amount - partner_amount - supplier_amount - net_frc
                                        // console.log("total value is ",total)
                                        table.cell({ row: r, column: 20 }).data(total)//total value
                                    }

                                    //NET TOTAL = TOTAL - BATA RATE
                                    if (
                                        cell.index().column == 5 || cell.index().column == 6
                                        || cell.index().column == 9 || cell.index().column == 10
                                        || cell.index().column == 15 || cell.index().column == 16
                                        || cell.index().column == 24 || cell.index().column == 26
                                        || cell.index().column == 27 || cell.index().column == 17
                                        || cell.index().column == 20 || cell.index().column == 22

                                    ) {
                                        let r = cell.index().row
                                        let total = table.cell({ row: r, column: 20 }).data() ? parseInt(table.cell({ row: r, column: 20 }).data()) : 0;
                                        let bata_rate = table.cell({ row: r, column: 22 }).data() ? parseInt(table.cell({ row: r, column: 22 }).data()) : 0;
                                        // console.log("total",total,"bata_rate",bata_rate)
                                        let net_total = total - bata_rate
                                        // console.log("net_total",net_total)
                                        table.cell({ row: r, column: 28 }).data(net_total)//net_total
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
        frappe.call({
            method: "ev_gn.post_trip_data.post_data",
            args: { row_array: $table_data, date: current_date, selected_vehicle: selected_vehicle }
            // callback: function(r)
            // {
            //     frappe.throw(r.message)
            // }
        })

    });

    // Autoselect Data


    // Creating drop down list funtion
    var elmts = ["Etios", "Innova", "Cressida", "Corolla", "Camry"];
    var select = document.getElementById("vehicle");

    function create_vehicle_list() {

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
                }
            )
            .catch(err => console.log("erorr is", err))

        // down.innerHTML = "Elements Added";
        console.log("clicked");
    }
    create_vehicle_list()

    $('#vehicle').on('click change', function (e) {
        console.log("vehicle changed ",e.target.value)
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
    }

    function today_date() {
        let today = new Date()
        today = today.toISOString().split('T')[0]
        current_date = today.split("-").join("-");
        document.getElementById("date").value = today;
    }

}