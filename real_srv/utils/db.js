import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(
      "mongodb+srv://aftab7t7:fate100blood@cluster0.bygo2ky.mongodb.net/Real_estate?retryWrites=true&w=majority"
    )
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((err) => {
      console.log(err);
    });
};
