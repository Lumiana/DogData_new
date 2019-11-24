var infoHandler = {
    //Adds the dogs information into SQLite database    
    addInfo: function (name, breed, breeder) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("insert into info(name, breed, breeder) values(?, ?, ?)",
                    [name, breed, breeder],
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

    //Asks the user which dog to delete, deletes that dog from the database and reloads the home.html component
    deleteInfo: function (name) {
        var dogName = prompt('Dog to delete');
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("DELETE FROM info WHERE name = ? ",
                    [dogName],
                    function (tx, results) {
                        alert('Dog ' + dogName + ' was removed');
                        parent.document.querySelector('#frame').src = 'home.html';
                    },
                    function (tx, error) {
                        alert("delete info error: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    },

    //Finds the dogs names from SQLite database and adds tags needed in table home.html/dogNames. This is cheating a bit as we are adding the necessary tags in the SQL Select to create the table rows, but it works. 
    loadName: function () {

        databaseHandler.db.transaction(function (tx) {
            tx.executeSql(`SELECT "<tr> <th onclick= ""infoHandler.openDogInfo('"||name||"');"" >" || name || " </tr> </th>" name FROM info WHERE rowid >= (SELECT max(rowid) FROM info) -10`,
                [],
                function (tx, results) {

                    var names = "";
                    var len = results.rows.length;
                    for (var i = 0; i < len; i++) {
                        names = names + results.rows[i]['name'];        
                    }
                    document.querySelector("#dogNames").innerHTML = names;

                },
                function (tx, error) {

                }
            );
        });
    },

    //Opens input page into the frame and hides footer buttons Add and Delete dog
    openDogInfo: function (name) {
        parent.document.querySelector('#btnAdd').style.display = "none";
        parent.document.querySelector('#btnDelete').style.display = "none";
        parent.document.querySelector('#frame').src = 'input.html';
        parent.dogName = name;
    },

    //Finds the last dog info records from SQLite database
    loadLatestInfo: function () {
        databaseHandler.db.transaction(function (tx) {
            tx.executeSql('SELECT name, breed, breeder FROM info WHERE rowid = (SELECT max(rowid) FROM info)',
                [],
                function (tx, results) {
                    let dogName = results.rows[0]['name'];
                    let breed = results.rows[0]['breed'];
                    let breeder = results.rows[0]['breeder'];
                    document.querySelector("#showAllInfo").innerHTML = dogName + " ( " + breed + " ) " + " ( " + breeder + " ) ";
                },
                function (tx, error) {

                }
            );
        });
    }
}

//Closes the input page and reloads the buttons
function closeInfo() {
    parent.document.querySelector('#btnAdd').style = "visibility:visible";
    parent.document.querySelector('#btnDelete').style = "visibility:visible";
    parent.document.querySelector('#frame').src = 'home.html';
}