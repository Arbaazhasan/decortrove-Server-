import mongoose from "mongoose";


const dbConnection = (dbUrl) => {
    mongoose.connect(dbUrl, { dbName: "decortrove" }).then(() => {
        console.log("Database Connected.");
    }).catch((e) => {
        console.log(e);
    });
};

export default dbConnection;