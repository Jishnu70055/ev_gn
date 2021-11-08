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
        "jquery_datatable": "https://cdn.datatables.net/v/dt/dt-1.11.0/datatables.min.js",
        "jquery_auto": "https://unpkg.com/contenteditable-autocomplete@1.0.2/dist/contenteditable-autocomplete.js",
        "css_auto": "https://unpkg.com/contenteditable-autocomplete@1.0.2/dist/contenteditable-autocomplete.css",
        "css_datatable": "https://cdn.datatables.net/v/dt/dt-1.11.0/datatables.min.css"
    };



    // Decalre required variables
    let table //used for creating datatable 
    let rows //used for storing rows empty array
    let totalrow = 2 //used for storing totalrow value assign 2 array
    let col_count = 29  //The count of empty arrays to be created
    // let drivers = ['safwan','raheeb','siraj'];
    let Options = ['Rent', 'Rate'];


    // Load Jquery UI using Jquery getScript function.
    $.getScript(js_libs.jquery_ui)
        // Done is a chained with multiple function called
        // one after the other.
        .done(function (script, textStatus) {

            console.log("ui loaded")

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

                        $("#body").find("tbody").on(' keypress paste input', '[contenteditable]', 'td', function (e) {
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
                                        $('.suggestions ul').append(`<li class="py-2 px-2  border border-bottom border-1 border-black text-danger pe-auto hover pe-auto nav-link list-group-item-action select list-group-item list-group-item-primary">Close</li>`); //close btn value selected
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
                            //SUPPLIER AMOUNT = SUPPLIER RATE * SUPPLIER QUANTITY
                            if ($('#myTable').DataTable().cell(this).index().column == 5 || $('#myTable').DataTable().cell(this).index().column == 6) {
                                // console.log("finding the value in coloums 3 or 5", $(this).html())
                                // $("td.active").html(e.target.innerText)
                                for (var ro = 1; ro < totalrow + 2; ro++) {
                                    var row = $("#myTable").find("tr");
                                    var columns = $(row[ro]).find("td");
                                    let supplier_rate = parseInt($(columns[5]).html() ? $(columns[5]).html() : 0)
                                    let supplier_qty = parseInt($(columns[6]).html() ? $(columns[6]).html() : 1)
                                    $(columns[7]).html(supplier_rate * supplier_qty)//supplier amt
                                }
                                //    $("tr[0]td[5]").html(e.target.innerText) 
                            }
                            //PARTNER AMOUNT = PARTNER RATE * PARTNER QUANTITY
                            if ($('#myTable').DataTable().cell(this).index().column == 9 || $('#myTable').DataTable().cell(this).index().column == 10) {
                                for (var ro = 1; ro < totalrow + 2; ro++) {
                                    var row = $("#myTable").find("tr");
                                    var columns = $(row[ro]).find("td");
                                    let partner_rate = parseInt($(columns[9]).html() ? $(columns[9]).html() : 0)
                                    let partner_qty = parseInt($(columns[10]).html() ? $(columns[10]).html() : 1)
                                    $(columns[11]).html(partner_rate * partner_qty)//partner amount
                                }
                                //    $("tr[0]td[5]").html(e.target.innerText) 
                            }
                            // CUSTOMER AMOUNT = CUSTOMER RATE * CUSTOMER QUANTITY
                            if ($('#myTable').DataTable().cell(this).index().column == 15 || $('#myTable').DataTable().cell(this).index().column == 16) {
                                for (var ro = 1; ro < totalrow + 2; ro++) {
                                    var row = $("#myTable").find("tr");
                                    var columns = $(row[ro]).find("td");
                                    let customer_rate = parseInt($(columns[15]).html() ? $(columns[15]).html() : 0)
                                    let customer_qty = parseInt($(columns[16]).html() ? $(columns[16]).html() : 1)
                                    $(columns[17]).html(customer_rate * customer_qty)
                                    console.log("CUSTOMER RATE TYPE", $(columns[14]).html().toLowerCase())
                                    // $(columns[14]).html() == 'Rate' ? $(columns[17]).html(customer_rate * customer_qty) : ""//check rate ,if its true customer_amount calculate
                                    // $(columns[17]).html(value_a * value_b)
                                }
                                //    $("tr[0]td[5]").html(e.target.innerText) 
                            }
                            //NET FRC = FRC+GST AMOUNT
                            if ($('#myTable').DataTable().cell(this).index().column == 24 || $('#myTable').DataTable().cell(this).index().column == 26) {
                                // console.log("finding the value in coloums 3 or 5", $(this).html())
                                for (var ro = 1; ro < totalrow + 2; ro++) {
                                    var row = $("#myTable").find("tr");
                                    var columns = $(row[ro]).find("td");
                                    let frc = parseInt($(columns[24]).html() ? $(columns[24]).html() : 0)
                                    let gst_amt = parseInt($(columns[26]).html() ? $(columns[26]).html() : 0)
                                    $(columns[27]).html(frc + gst_amt)//netFrc
                                }
                                //    $("tr[0]td[5]").html(e.target.innerText) 
                            }
                            //NET TOTAL = TOTAL - BATA RATE
                            if ($('#myTable').DataTable().cell(this).index().column == 20 || $('#myTable').DataTable().cell(this).index().column == 22) {
                                // console.log("finding the value in coloums 3 or 5", $(this).html())
                                for (var ro = 1; ro < totalrow + 2; ro++) {
                                    var row = $("#myTable").find("tr");
                                    var columns = $(row[ro]).find("td");
                                    let total = parseInt($(columns[20]).html() ? $(columns[20]).html() : 0)
                                    let bata_rate = parseInt($(columns[22]).html() ? $(columns[22]).html() : 0)
                                    $(columns[28]).html(total - bata_rate)//netfrc
                                }
                                //    $("tr[0]td[5]").html(e.target.innerText) 
                            }
                            //TOTAL = CUSTOMER_AMOUNT - PARTNER_AMOUNT-SUPPLIER_AMOUNT-NETFRC
                            if ($('#myTable').DataTable().cell(this).index().column == 5 || $('#myTable').DataTable().cell(this).index().column == 6
                                || $('#myTable').DataTable().cell(this).index().column == 9 || $('#myTable').DataTable().cell(this).index().column == 10
                                || $('#myTable').DataTable().cell(this).index().column == 15 || $('#myTable').DataTable().cell(this).index().column == 16
                                || $('#myTable').DataTable().cell(this).index().column == 24 || $('#myTable').DataTable().cell(this).index().column == 26
                                || $('#myTable').DataTable().cell(this).index().column == 27) {
                                // console.log("finding the value in coloums 3 or 5", $(this).html())
                                for (var ro = 1; ro < totalrow + 2; ro++) {
                                    var row = $("#myTable").find("tr");
                                    var columns = $(row[ro]).find("td");
                                    let partner_amount = parseInt($(columns[11]).html() ? $(columns[11]).html() : 0)
                                    let customer_amount = parseInt($(columns[17]).html() ? $(columns[17]).html() : 0)
                                    let supplier_amount = parseInt($(columns[7]).html() ? $(columns[7]).html() : 0)
                                    let net_frc = parseInt($(columns[27]).html() ? $(columns[27]).html() : 0)
                                    // partner_amount==1?$(columns[6]).html(partner_amount):""
                                    // $(columns[6]).html( partner_amount)
                                    $(columns[20]).html(customer_amount - partner_amount - supplier_amount - net_frc)//total value
                                }
                                //    $("tr[0]td[5]").html(e.target.innerText) 
                            }
                            console.log($('#myTable').DataTable().cell(this).index().column);


                        });
                        //hide suggestion area 
                        $('body').on('click', function () {
                            // $('.suggestions ul').remove();

                            $(".suggestions").addClass("d-none")
                            // e.target.classList.add('active');
                        })

                        //CODE ADDING STACKOVERFLOW
                        //check suggestion dropdown arrow key function working --start
                        $("#body").find("tbody").on(' keyup keydown', '[contenteditable]', '#myTable', function (e) {
                            // var objCurrentLi, obj = $('.suggestions').find('.suggestions li'), objUl = $('.suggestions ul'), code = (e.keyCode ? e.keyCode : e.which);
                            // console.log('length if suggestion', obj)
                            // if (e.which == 40) {  //Up Arrow
                            //     console.log("suggestion arrow up working properley")
                            //     if ((obj.length === 0) || (objUl.find('.suggestions li:last').hasClass('bg-info') === true)) {
                            //         objCurrentLi = objUl.find('.suggestions li:first').addClass('bg-info');
                            //     }
                            //     else {
                            //         objCurrentLi = obj.next().addClass('bg-info');
                            //     }
                            //     obj.removeClass('bg-info');
                            // }
                            // else if (e.which == 38) {  //Down Arrow
                            //     console.log("suggestion arrow down working properley")
                            //     if ((obj.length === 0) || (objUl.find('.suggestions li:first').hasClass('bg-info') === true)) {
                            //         objCurrentLi = objUl.find('.suggestions li:last').addClass('bg-info');
                            //     }
                            //     else {
                            //         objCurrentLi = obj.prev().addClass('bg-info');
                            //     }
                            //     obj.removeClass('bg-info');
                            // }

                            var li = $('.suggestions > li');
                            var liSelected=$('suggestion li');
                            $(window).on('keydown', function (e) {
                                var selected;
                                if (e.which === 40) {
                                    console.log("key press down")
                                    if (liSelected) {
                                        
                                        liSelected.removeClass('bg-primary');
                                        next = liSelected.next();
                                        console.log('sugggestion li if condtion true',next.length)
                                        if (next.length > 0) {
                                            liSelected = next.addClass('bg-primary');
                                            selected = next.text();

                                        } else {
                                            liSelected = li.eq(0).addClass('bg-primary');
                                            selected = li.eq(0).text();
                                        }
                                    } else {
                                        liSelected = li.eq(0).addClass('bg-primary');
                                        selected = li.eq(0).text();
                                    }
                                } else if (e.which === 38) {
                                    ("key press up")
                                    if (liSelected) {
                                        liSelected.removeClass('bg-primary');
                                        next = liSelected.prev();
                                        if (next.length > 0) {
                                            liSelected = next.addClass('bg-primary');
                                            selected = next.text();

                                        } else {

                                            liSelected = li.last().addClass('bg-primary');
                                            selected = li.last().text()
                                        }
                                    } else {

                                        liSelected = li.last().addClass('bg-primary');
                                        selected = li.last().text()
                                    }
                                }
                            })
                            //check suggestion dropdown arrow key function working --end
                            //CODE ADDING STACKOVERFLOW
                        })
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
                                $("td.active").html(e.target.innerText)
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
                            var cell = $('#myTable').DataTable().cell(this)
                            cell.data(this.innerText).draw()
                            // this.focus();
                            //console.log("ok")
                            // // console.log("blur",this.innerText);
                            // console.log($("#myTable").dataTable().api().row().data())
                            // console.log("blurred");

                        })



                        $('body').on('focus', '[contenteditable]', function () {
                            $("td").removeClass("active")
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
                });

        })
        .fail(function (jqxhr, settings, exception) {
            $("div.log").text("Triggered ajaxError handler.")
        });





    // Post data from DataTable to backend
    $('#getData').on('click', function () {
        // $table_data = table.rows().data();
        $table_data = $('#myTable').DataTable().rows().data().toArray()
        console.log($table_data)
        // json_data = JSON.stringify($table_data);
        // console.log(json_data)
        frappe.call({
            method: "ev_gn.post_trip_data.post_data",
            args: { row_array: $table_data }
            // callback: function(r)
            // {
            //     frappe.throw(r.message)
            // }
        })

    });

    // Autoselect Data

    // customer_list = frappe.db.get_list('Customer');
    // driver_list = frappe.db.get_list('Driver');
    // item_list = frappe.db.get_list('Item');
    // supplier_list = frappe.db.get_list('Site');
    // supplier_partner_list = frappe.db.get_list('Supplier');
    // customer = frappe.db.get_list('Customer');
    // customer_site = frappe.db.get_list('Site');
    // console.log(customer_list)    

    // Creating drop down list funtion
    var elmts = ["Etios", "Innova", "Cressida", "Corolla", "Camry"];
    var select = document.getElementById("vehicle");

    function create_vehicle_list() {
        for (var i = 0; i < elmts.length; i++) {
            var optn = elmts[i];
            var el = document.createElement("option");
            el.textContent = optn;
            el.value = optn;
            select.appendChild(el);
            // console.log(el)
        }
        // down.innerHTML = "Elements Added";
        console.log("clicked");
    }
    create_vehicle_list()

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
}