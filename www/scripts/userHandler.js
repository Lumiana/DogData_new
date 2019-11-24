var userHandler = {     
    //Adds the user information into the database   
    addUser: function (email, password) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("insert into users(email, password) values(?, ?)",
                    [email, password],
                    function (tx, results) { },
                    function (tx, error) {
                        console.log("add user error: " + error.message);
                           }                 
                    );            
            },            
            function (error) { },
            function () { }        
            );    
    },
} 