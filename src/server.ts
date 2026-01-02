import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 4000
const main = async () => {
    try {
        await prisma.$connect();
        console.log("Connect to the database successfully.");


        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        })


    } catch (error) {
        console.log("Error: ", error);
        await prisma.$disconnect();
        process.exit(1)
    }
}

main()