//0702280 Annemari Mustonen

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();

//Listing the months
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//Buttons to change the months
function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

//Showing the calendar
function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();

    //Body of the calendar
    tbl = document.getElementById("calendar-body"); 

     //Clearing all previous cells for the previous/next buttons to work
    tbl.innerHTML = "";

    //Filling data about month and year
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    //Creating the cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        //Creates the table rows
        let row = document.createElement("tr");

        //Creating individual cells and filling them with data
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            else {
                cell = document.createElement("td");
                //Calling other functions to indentify selected cell in calendar and the onclick action tied to them
                let pvm = selectYear.value + '-' + (selectMonth.value + 1) + '-' + date; 
                eventHandler.identifyCell(cell, pvm);
                cell.onclick = calendarClick;
                cellText = document.createTextNode(date);
                //Coloring today's date
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }


        }
       
        tbl.appendChild(row); // appending each row into calendar body.
    }

}

//The calendar click function, which looks for the date and opens the inputCalendar.html in a frame
function calendarClick(e) {
    let pvm = selectYear.value + '-' + (selectMonth.value +1) + '-' + e.target.innerHTML;
    parent.document.querySelector('#frame').src = 'inputCalendar.html';
    parent.document.pvm = pvm;

}

//Checking the number of days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

//Calls the eventHandler below to add the event data into the database, gives confirmation dialog and opens calendar.html
function addEventInfo() {
    var eventdate = parent.document.pvm;
    var eventname = $("#txtEventname").val();
    var eventdogname = $("#txtEventdogname").val();
    var eventinfo = $("#txtEventinfo").val();
    if (!eventname) {
        alert("Event name is required");
    }
    else {
        var r = confirm("Event date: " + eventdate + ", Event name: " + eventname + ", Dog in event:" + eventdogname + ", Event information:" + eventinfo);
        if (r == true) {
            $("#Eventname").val("");
            $("#txtEventdogname").val("");
            $("#txtEventinfo").val("");
            eventHandler.addEventInfo(eventdate, eventname, eventdogname, eventinfo);
            parent.document.querySelector('#frame').src = 'calendar.html';

        }
    }
}

eventHandler = {
    //Adds the event information into SQLite database    
    addEventInfo: function (eventdate, eventname, eventdogname, eventinfo) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("insert into event(eventdate, eventname, eventdogname, eventinfo) values(?, ?, ?, ?)",
                    [eventdate, eventname, eventdogname, eventinfo],
                    function (tx, results) { },
                    function (tx, error) {
                        console.log("add info error: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    },
    loadEventInfo: function (eventdate) {
        databaseHandler.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM event WHERE eventdate = ?",
            [eventdate],
            function (tx, results) {
                $("#txtEventname").val(results.rows[0].eventname);
                $("#txtEventdogname").val(results.rows[0].eventdogname);
                $("#txtEventinfo").val(results.rows[0].eventinfo);
                parent.document.cellEventName = results.rows[0].eventname;
              
            },
            function (tx, error) {
                alert(error.message);
            }
        );
        });
    },

    //This function helps identify id the calendar cell has an event
    identifyCell: function (cell, eventdate) {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM event WHERE eventdate = ?",
                [eventdate],
                function (tx, results) {
                    if (results.rows[0].eventname) { cell.classList.add("eventExists") }
                },
                function (tx, error) {
                    alert(error.message);
                }
            );
        });
    }
}

//Opens inputCalendar page into the frame
function openCalendar () {
    parent.document.querySelector('#frame').src = 'inputCalendar.html';
    parent.eventName = eventname;

}
//Closes the inputCalendar page
function closeCalendar() {
    parent.document.querySelector('#frame').src = 'calendar.html';
}