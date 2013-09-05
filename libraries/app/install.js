function runSql(url, description){ 
    try {
        dbProcessesCalled++;
        $.get(url)
            .success(function(result){
                var scripts = result.split(";");
                var successCount = 0;
                db.transaction(function (tx) {
                    $.each(scripts, function(i){ 
                        var query = $.trim(this);
                        if (query!='') {
                            tx.executeSql(query, [], function(tx, results){
                                successCount++;
                            }, function(tx, error){
                                console.log(error);
                                console.log(String(query));
                            });
                        }else{
                            scripts.splice(i, 1);
                        }
                    });
                }, function (error) {
                    console.log(error);
                }, function (){
                    if (successCount==scripts.length) {
                        dbProcessesExecuted.push(description);
                        if (debug) console.log(description);
                        dbProcessesSuccess++;
                    }
                    if (dbProcessesCalled==dbProcessesSuccess) {
                        localStorage.setItem('databaseInstalled', true);
                    }
                });
                
            })
            .error(function(event, jqXHR, ajaxSettings, thrownError) {
                console.log(jqXHR);
            });
    }catch(err){
        console.log(err.message);
        console.log(err.stack);
    }
}