frappe.pages['daily-trip'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'None',
		single_column: true
	});
	// $(frappe.render_template("daily_trip", {}).appendTo(page.main))
	$(frappe.render_template("daily_trip")).appendTo(page.main);

	$(document).ready(function()
    {
        const createdCell = function(cell) 
        {
            let original
            cell.setAttribute('contenteditable', true)
            
            cell.setAttribute('spellcheck', false)
            cell.setAttribute('class', "cell")


            cell.addEventListener('focus', function(e) 
            {
                original = e.target.textContent
            })
            
        }



        let table = $('#myTable').DataTable(
        {
            stateSave: true,
            columnDefs: [
            { 
                targets: '_all',
                createdCell: createdCell
            }],
            "order": [[ 1, "desc" ]]
        }) 


 
        $('#addRow').on( 'click', function () 
        {
            let rows = [];

            for (i=1;i<=22; i++ ){
                 rows.push("");

            }

            table.row.add(rows).draw( true );
        });
        $('#addRow').click();


        $('#getData').on( 'click', function () 
        {
            // $table_data = table.rows().data();
            $table_data = $('#myTable').DataTable().rows().data().toArray();
            
            console.log($table_data)
            
        });


        $("#myTable").dataTable().find("tbody").on('click', 'td', function () 
        {
            // console.log(this.rowIndex);
            //console.log(this.innerText)
        });


        // var before;
        // $('#myTable .cell').on('focus', function() 
        $("#myTable").dataTable().find("tbody").on('focus', 'td', function () 
        {

            //console.log("focused");
            // console.log("data", this);
            console.log("focused",this.innerText);
            // console.log(before);
        });

        //keyup
        $("#myTable").dataTable().find("tbody").on('blur', 'td', function () 
        {
            

            var cell = table.cell(this);
            cell.data(this.innerText).draw();
            // this.focus();
            //console.log("ok")
            // // console.log("blur",this.innerText);
            console.log($("#myTable").dataTable().api().row().data());
            // console.log("blurred");

        })

    $('#editor').on('change', function() {alert('changed')});


    var tags = [
        'Alaska',
        'Asia / Far East',
        'Baltic Capitals / Northern Europe',
        'Canary Islands',
        'Caribbean',
        'Cruise from Ireland',
        'Dubai &amp; The Emirates',
        'Grand Voyages / Repositioning Cruises',
        'Mediterranean',
        'Northern Lights',
        'Norwegian Fjords',
        'South America',
        'Transatlantic',
        'UK &amp; Ireland',
    ];

    var startTyping = "Start typing...";

        function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    
    //User starts typing
    // $("td").bind("keydown", function(event) {

    $("#myTable").on("keydown", "td", function (event) {
        console.log("edutho?")

    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {


    event.preventDefault();
    }

    this.addClass('autocomplete');
    console.log("this?",this)


    }).autocomplete({        
    minLength: 0,
    source: function(request, response) {
                console.log("started")

    //The API CALL FOR ACTUAL DATA GOES HERE.
    //THIS SHOULD RETURN A ARRAY.
    //If empty should return empty array

    results = ["item1","item2"]; 
    response(results);
    },




    focus: function() {
    return false;
    },
    select: function(event, ui) {
    if (ui.item.value !== startTyping) {
      var value = $(this).html();
      // var terms = [value];
      // terms.pop();
      // terms.push(ui.item.value);
      // $(this).html(terms);
      // placeCaretAtEnd(this);
      console.log([value]);
    }
    return false;
    }
    }).data("ui-autocomplete")._renderItem = function(ul, item) {
    if (item.label != startTyping) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a><div>" + item.label + "</div></div></a>")
      .appendTo(ul);
    } else {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + item.label + "</a>")
      .appendTo(ul);
    }
    };

    });


}

// ev_gn/ev_gn/ev_gn/page/daily_trip/daily_trip.html

// frappe-bench/apps/ev_gn/ev_gn/ev_gn/page/daily_trip/daily_trip.html