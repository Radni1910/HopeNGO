const express = require("express");
const router = express.Router();
const db = require("../db");

// Get notifications
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM notifications ORDER BY created_at DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch notifications" });
  }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    await db.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update notification" });
  }
});

// Create notification
router.post("/", async (req, res) => {
  try {
    const { title, message } = req.body;

    await db.query(
      "INSERT INTO notifications (title, message) VALUES (?, ?)",
      [title, message]
    );

    res.status(201).json({ message: "Notification created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create notification" });
  }
});

module.exports = router;