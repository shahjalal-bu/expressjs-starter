/* eslint-disable no-console */
import mongoose from "mongoose";
import { app } from "./app";
import config from "./app/config";

(async function () {
  try {
    await mongoose.connect(config.database_url as string);
    app.listen(config.port, () => {
      console.log(`Server is running ${config.port} `);
    });
  } catch (error) {
    console.log(error);
  }
})();
