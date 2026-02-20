import Routes from "../Routes/index.js";
export const startServer = async (app, port) => {
  try {
    app.use("/", Routes);
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  } catch (err) {
    console.log("Server Didnt start");
  }
};
