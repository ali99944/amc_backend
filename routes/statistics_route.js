import express from "express";
import { getOverviewController, getRecentUsersController, getTopSongsController } from "../controllers/statistics_controller.js";

const router = express.Router();

router.get('/statistics/overview', getOverviewController)

router.get('/statistics/top-songs', getTopSongsController)

router.get('/statistics/recent-users', getRecentUsersController)

export default router