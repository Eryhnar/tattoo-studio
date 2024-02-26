import "dotenv/config";
import { app } from "./app";

const PORT = process.env.PORT || 4001;

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

startServer(); 
 

