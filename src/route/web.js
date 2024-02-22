import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/NVQuyet", (req, res) => {
    return res.send("Hello world with QUYET");
  });
  //restapi

  return app.use("/", router);
};

module.exports = initWebRoutes;
