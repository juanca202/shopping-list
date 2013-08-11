var WebSqlAdapter = function() {

    this.initialize = function() {
        var deferred = $.Deferred();
        this.db = window.openDatabase("shl", "1.0", "Shopping List", 200000);
        this.db.transaction(
                function(tx) {
                    createTable(tx);
                },
                function(error) {
                    console.log('Transaction error: ' + error);
                    deferred.reject('Transaction error: ' + error);
                },
                function() {
                    console.log('Transaction success');
                    deferred.resolve();
                }
        );
        return deferred.promise();
    }

    this.findByName = function(searchKey) {
        var deferred = $.Deferred();
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " +
                    "FROM employee e LEFT JOIN employee r ON r.managerId = e.id " +
                    "WHERE e.firstName || ' ' || e.lastName LIKE ? " +
                    "GROUP BY e.id ORDER BY e.lastName, e.firstName";

                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        employees = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        employees[i] = results.rows.item(i);
                    }
                    deferred.resolve(employees);
                });
            },
            function(error) {
                deferred.reject("Transaction Error: " + error.message);
            }
        );
        return deferred.promise();
    }

    var createTable = function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS employee');
        var sql = "CREATE TABLE IF NOT EXISTS employee ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "firstName VARCHAR(50), " +
            "lastName VARCHAR(50), " +
            "title VARCHAR(50), " +
            "managerId INTEGER, " +
            "city VARCHAR(50), " +
            "officePhone VARCHAR(50), " +
            "cellPhone VARCHAR(50), " +
            "email VARCHAR(50))";
        tx.executeSql(sql, null,
                function() {
                    console.log('Create table success');
                },
                function(tx, error) {
                    alert('Create table error: ' + error.message);
                });
    }
}