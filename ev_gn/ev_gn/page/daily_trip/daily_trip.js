frappe.pages['daily-trip'].on_page_load = function(wrapper) {
        
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
        "jquery_auto" : "https://unpkg.com/contenteditable-autocomplete@1.0.2/dist/contenteditable-autocomplete.js",
        "css_auto" : "https://unpkg.com/contenteditable-autocomplete@1.0.2/dist/contenteditable-autocomplete.css",
        "css_datatable": "https://cdn.datatables.net/v/dt/dt-1.11.0/datatables.min.css"
    };



    // Decalre required variables
    let table //used for creating datatable 
    let rows //used for storing rows empty array
    let col_count = 29  //The count of empty arrays to be created

    // Load Jquery UI using Jquery getScript function.
    $.getScript(js_libs.jquery_ui)
        // Done is a chained with multiple function called
        // one after the other.
        .done(function(script, textStatus) {

            console.log("ui loaded")
            
                //On success load the datatable jquery plugin using getScript function
                //This is only executed if previous call was a success
            $.getScript(js_libs.jquery_datatable)
                .done(
                    //First function in done
                    function(script, textStatus) {
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
                    $('#addRow').on('click', function add_row() {
                        rows = [];
                        
                        //Array for adding row
                        for (i = 1; i <= col_count; i++) {
                            rows.push("");
            
                        }
            
                        table.row.add(rows).draw(true);
                    });

                    //creating new row on entering press inside the table
                    $("#myTable").keypress(function(event) {
                        if (event.keyCode === 13) 
                        {
                            row_add()

                        }
                    });

                    //Cell for table creation     
                    const createdCell = function(cell) {
                        let original
                        cell.setAttribute('contenteditable', true)

                        cell.setAttribute('spellcheck', false)
                        cell.setAttribute('class', "cell")


                        cell.addEventListener('focus', function(e) {
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
                            createdCell: createdCell
                        }],
                        "ordering": false   //sorting removed
                    })

                },
                // Second function in done
                function(e) {
                    rows = []
                    
                    //Array for adding row
                    for (i = 1; i <= col_count; i++) {
                        rows.push("");
        
                    }
                                            
                    $('#myTable').DataTable().row.add(rows).draw(true)

                    $("#body").find("tbody").on('click', 'td', function (e) 
                    {
                        // console.log(this.rowIndex);
                        //console.log(this.innerText);
                        
                        //Get value of TD                                 
                        // console.log(e.target.innerHTML);
                        console.log(this.innerHTML)

                        console.log("clicked TD")
                    });

                    //         //keyup
                    $("#body").find("tbody").on('blur', 'td', function (e) 
                    {   
                        var cell = $('#myTable').DataTable().cell(this)
                        cell.data(this.innerText).draw()
                        // this.focus();
                        //console.log("ok")
                        // // console.log("blur",this.innerText);
                        console.log($("#myTable").dataTable().api().row().data())
                        // console.log("blurred");

                    })
                    
                },
                // Third function in done (not used)
                function(e) {
                    console.log("3");
                    
                    //Add Css for DataTable
                    $.ajax({
                        dataType: "text",
                        url: js_libs.css_datatable,
                    }).done( function(text){
                        $("<style>").html(text).appendTo("head");
                    } );

                    //Add Css for Auto Suggest
                    $.ajax({
                        dataType: "text",
                        url: js_libs.css_auto,
                    }).done( function(text){
                        $("<style>").html(text).appendTo("head");
                    } );
                    
                })
                .fail(function(jqxhr, settings, exception) {
                    $("div.log").text("Triggered ajaxError handler.")
                });

        })
        .fail(function(jqxhr, settings, exception) {
            $("div.log").text("Triggered ajaxError handler.")
        });

        

        // Get data from DataTable
        $('#getData').on( 'click', function () 
        {
            // $table_data = table.rows().data();
            $table_data = $('#myTable').DataTable().rows().data().toArray()             
            console.log($table_data)
            // json_data = JSON.stringify($table_data);
            // console.log(json_data)
            frappe.call({
                method: "ev_gn.post_trip_data.post_data",
                args: {row_array: $table_data}
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
        
        var elmts = ["Etios", "Innova", "Cressida", "Corolla", "Camry"];
        var select = document.getElementById("vehicle");

        function create_vehicle_list() {
            for (var i = 0; i < elmts.length; i++) {
                var optn = elmts[i];
                var el = document.createElement("option");
                el.textContent = optn;
                el.value = optn;
                select.appendChild(el);
                console.log(el)
            }
            // down.innerHTML = "Elements Added";
            console.log("clicked");
        }
        create_vehicle_list()
}