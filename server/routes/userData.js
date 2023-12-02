import { Router } from "express";
const router = Router();
import { getAllUsers, getUserByName, getUserByUserID, updateProfilePic } from "../data/userData.js";

// getting all user data route
router.route("/").get(async (req, res) => {
  try {
    let userId = req.user.id;

    const user = await getUserByUserID(userId);
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.route("/allUsers").get(async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.route("/search").post(async (req, res) => {
  try {
    let searchQuery = req.body.searchQuery
    const results = await getUserByName(searchQuery);
    res.json(results);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.route("/profilePicEdit").post(async (req, res) => {
  try {
    let userId = req.user.id;
    let url = req.body.url;
    let user = await updateProfilePic(userId,url);
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
