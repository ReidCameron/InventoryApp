const {app, dbPromise} = require("./express/server");

dbPromise.then( result =>{
    app.listen(3000, () => {
        console.log("Listening on port 3000")
    });
});
