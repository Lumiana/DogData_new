//The main database and tables are added here
// 0702280 Annemari Mustonen

//Create database users.db
var databaseHandler = {
    db: null,
    createDatabase: function () {
        this.db = window.openDatabase(
            "users.db",
            "1.0",
            "users database",
            1000000);
        this.db.transaction(function (tx) {

            //Create table users to add login information of the users into database
            tx.executeSql(
                "create table if not exists users(_id int primary key, email text, password text)",
                [],
                function (tx, results) { },
                function (tx, error) {
                    console.log("Error while creating the table: " + error.message);
                }
            );
            //Create table info to add the dog information into database   
            tx.executeSql(
                "create table if not exists info(_id int primary key, name text, breed text, breeder text, medical text)",
                [],
                function (tx, results) { },
                function (tx, error) {
                    console.log("Error while creating the table: " + error.message);
                }
            );
            //Create table event to add the event information into database   
            tx.executeSql(
                "create table if not exists event(eventdate text primary key, eventname text, eventdogname text, eventinfo text)",
                [],
                function (tx, results) { },
                function (tx, error) {
                    console.log("Error while creating the table: " + error.message);
                }
            );
        },

            //Console log information
            function (error) {
                console.log("Transaction error:" + error.message);
            }, function () {
                console.log("Create DB transaction completed successfully:");
            },
        );
    }
} 