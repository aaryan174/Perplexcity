import "dotenv/config"
import app from "./src/app.js"
import ConnectToDb from "./src/config/database.js";



ConnectToDb();

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});
