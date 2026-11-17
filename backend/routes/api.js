const router = require("express").Router();
const db = require("../db");
// =========================================================
// NOTIFICATION HELPER
// =========================================================

async function createNotification(title, message) {
  try {
    await db.query("INSERT INTO notifications (title, message) VALUES (?, ?)", [
      title,
      message,
    ]);
  } catch (error) {
    console.error("Notification creation error:", error);
  }
}

// =========================================================
// NOTIFICATIONS - GET ALL
// =========================================================

router.get("/notifications", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM notifications ORDER BY created_at DESC",
    );

    res.json(rows);
  } catch (error) {
    console.error("Notifications GET Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =========================================================
// NOTIFICATIONS - MARK AS READ
// =========================================================

router.put("/notifications/:id/read", async (req, res) => {
  try {
    await db.query("UPDATE notifications SET is_read = TRUE WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Notification UPDATE Error:", error);
    res.status(500).json({ message: error.message });
  }
});
// =========================================================
// AUTH - LOGIN
// =========================================================

router.post("/auth/login", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
            SELECT id, username
            FROM admin
            WHERE username = ?
            AND password = ?
            `,
      [req.body.username, req.body.password],
    );

    if (!rows.length) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    res.json({
      user: rows[0],
    });
  } catch (e) {
    console.error("Login Error:", e);

    res.status(500).json({
      message: e.message,
    });
  }
});

// =========================================================
// AUTH - REGISTER
// =========================================================

router.post("/auth/register", async (req, res) => {
  try {
    await db.query(
      `
            INSERT INTO admin
            (
                fullname,
                email,
                username,
                password
            )
            VALUES (?, ?, ?, ?)
            `,
      [req.body.fullname, req.body.email, req.body.username, req.body.password],
    );

    res.json({
      message: "Registered successfully",
    });
  } catch (e) {
    console.error("Register Error:", e);

    res.status(400).json({
      message:
        e.code === "ER_DUP_ENTRY" ? "Username already exists" : e.message,
    });
  }
});

// =========================================================
// TABLE DEFINITIONS
// =========================================================

const defs = {
  donors: {
    table: "donors",
    id: "donor_id",
    fields: ["name", "email", "phone", "address"],
  },

  volunteers: {
    table: "volunteers",
    id: "volunteer_id",
    fields: ["name", "email", "phone", "assigned_work"],
  },

  events: {
    table: "events",
    id: "event_id",
    fields: ["event_name", "event_date", "location", "description"],
  },

  beneficiaries: {
    table: "beneficiaries",
    id: "beneficiary_id",
    fields: ["name", "age", "help_type", "contact"],
  },
};

// =========================================================
// DONORS / VOLUNTEERS / EVENTS / BENEFICIARIES
// =========================================================

for (const [key, c] of Object.entries(defs)) {
  // GET ALL
  router.get("/" + key, async (req, res) => {
    try {
      const [rows] = await db.query(
        `
                SELECT *
                FROM ${c.table}
                ORDER BY ${c.id} DESC
                `,
      );

      res.json(
        rows.map((row) => ({
          ...row,
          id: row[c.id],
        })),
      );
    } catch (e) {
      console.error(`${key} GET Error:`, e);

      res.status(500).json({
        message: e.message,
      });
    }
  });

  // CREATE
  router.post("/" + key, async (req, res) => {
    try {
      const values = c.fields.map((field) => req.body[field]);

      const [result] = await db.query(
        `
                INSERT INTO ${c.table}
                (${c.fields.join(", ")})
                VALUES (${c.fields.map(() => "?").join(", ")})
                `,
        values,
      );

      // Create notification
      const notificationTitles = {
        donors: "New Donor",
        volunteers: "New Volunteer",
        events: "New Event",
        beneficiaries: "New Beneficiary",
      };

      const recordName = req.body.name || req.body.event_name || "A new record";

      await createNotification(
        notificationTitles[key],
        `${recordName} has been successfully added.`,
      );

      res.json({
        id: result.insertId,
      });
    } catch (e) {
      console.error(`${key} POST Error:`, e);

      res.status(400).json({
        message: e.message,
      });
    }
  });

  // UPDATE
  router.put("/" + key + "/:id", async (req, res) => {
    try {
      const values = c.fields.map((field) => req.body[field]);

      await db.query(
        `
                UPDATE ${c.table}
                SET ${c.fields.map((field) => `${field} = ?`).join(", ")}
                WHERE ${c.id} = ?
                `,
        [...values, req.params.id],
      );

      res.json({
        message: "Updated",
      });
    } catch (e) {
      console.error(`${key} PUT Error:`, e);

      res.status(400).json({
        message: e.message,
      });
    }
  });

  // DELETE
  router.delete("/" + key + "/:id", async (req, res) => {
    try {
      await db.query(
        `
                DELETE FROM ${c.table}
                WHERE ${c.id} = ?
                `,
        [req.params.id],
      );

      res.json({
        message: "Deleted",
      });
    } catch (e) {
      console.error(`${key} DELETE Error:`, e);

      res.status(400).json({
        message: e.message,
      });
    }
  });
}

// =========================================================
// DONATIONS - GET ALL
// =========================================================

router.get("/donations", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
            SELECT
                d.*,
                dr.name AS donor_name
            FROM donations d
            JOIN donors dr
                ON dr.donor_id = d.donor_id
            ORDER BY d.donation_id DESC
            `,
    );

    res.json(
      rows.map((row) => ({
        ...row,
        id: row.donation_id,
      })),
    );
  } catch (e) {
    console.error("Donations GET Error:", e);

    res.status(500).json({
      message: e.message,
    });
  }
});

// =========================================================
// DONATIONS - CREATE
// =========================================================

router.post("/donations", async (req, res) => {
  try {
    const [result] = await db.query(
      `
            INSERT INTO donations
            (
                donor_id,
                amount,
                donation_date,
                purpose
            )
            VALUES (?, ?, ?, ?)
            `,
      [
        req.body.donor_id,
        req.body.amount,
        req.body.donation_date,
        req.body.purpose,
      ],
    );

    await createNotification(
      "New Donation",
      `A donation of ₹${req.body.amount} has been recorded.`,
    );

    res.json({
      id: result.insertId,
    });
  } catch (e) {
    console.error("Donations POST Error:", e);

    res.status(400).json({
      message: e.message,
    });
  }
});

// =========================================================
// DONATIONS - UPDATE
// =========================================================

router.put("/donations/:id", async (req, res) => {
  try {
    await db.query(
      `
            UPDATE donations
            SET
                donor_id = ?,
                amount = ?,
                donation_date = ?,
                purpose = ?
            WHERE donation_id = ?
            `,
      [
        req.body.donor_id,
        req.body.amount,
        req.body.donation_date,
        req.body.purpose,
        req.params.id,
      ],
    );

    res.json({
      message: "Updated",
    });
  } catch (e) {
    console.error("Donations PUT Error:", e);

    res.status(400).json({
      message: e.message,
    });
  }
});

// =========================================================
// DONATIONS - DELETE
// =========================================================

router.delete("/donations/:id", async (req, res) => {
  try {
    await db.query(
      `
            DELETE FROM donations
            WHERE donation_id = ?
            `,
      [req.params.id],
    );

    res.json({
      message: "Deleted",
    });
  } catch (e) {
    console.error("Donations DELETE Error:", e);

    res.status(400).json({
      message: e.message,
    });
  }
});

// =========================================================
// DASHBOARD
// =========================================================

router.get("/dashboard", async (req, res) => {
  try {
    // -------------------------------------------------
    // TOTAL DONATIONS
    // -------------------------------------------------

    const [[donationTotal]] = await db.query(`
            SELECT
                COALESCE(SUM(amount), 0) AS totalDonations
            FROM donations
        `);

    // -------------------------------------------------
    // TOTAL DONORS
    // -------------------------------------------------

    const [[donorTotal]] = await db.query(`
            SELECT
                COUNT(*) AS donors
            FROM donors
        `);

    // -------------------------------------------------
    // TOTAL VOLUNTEERS
    // -------------------------------------------------

    const [[volunteerTotal]] = await db.query(`
            SELECT
                COUNT(*) AS volunteers
            FROM volunteers
        `);

    // -------------------------------------------------
    // TOTAL EVENTS
    // -------------------------------------------------

    const [[eventTotal]] = await db.query(`
            SELECT
                COUNT(*) AS events
            FROM events
        `);

    // -------------------------------------------------
    // RECENT DONATIONS
    // -------------------------------------------------

    const [recentDonations] = await db.query(`
            SELECT
                d.amount,
                d.donation_date,
                d.purpose,
                dr.name AS donor_name
            FROM donations d
            JOIN donors dr
                ON dr.donor_id = d.donor_id
            ORDER BY d.donation_id DESC
            LIMIT 5
        `);

    // -------------------------------------------------
    // MONTHLY DONATION TREND
    // -------------------------------------------------

    const [monthlyTrend] = await db.query(`
    SELECT
        DATE_FORMAT(donation_date, '%Y-%m') AS month,
        SUM(amount) AS total
    FROM donations
    GROUP BY DATE_FORMAT(donation_date, '%Y-%m')
    ORDER BY DATE_FORMAT(donation_date, '%Y-%m')
`);

    // -------------------------------------------------
    // DONATIONS BY PURPOSE
    // -------------------------------------------------

    const [byPurpose] = await db.query(`
            SELECT
                COALESCE(purpose, 'Other') AS purpose,
                SUM(amount) AS total
            FROM donations
            GROUP BY purpose
            ORDER BY total DESC
        `);

    // -------------------------------------------------
    // UPCOMING EVENTS
    // -------------------------------------------------

    const [events] = await db.query(`
  SELECT
    event_id,
    event_name,
    event_date,
    location,
    description
  FROM events
  WHERE event_date >= CURDATE()
  ORDER BY event_date ASC
  LIMIT 5
`);
    // -------------------------------------------------
    // FINAL DASHBOARD RESPONSE
    // -------------------------------------------------

    res.json({
      stats: {
        totalDonations: donationTotal.totalDonations,

        donors: donorTotal.donors,

        volunteers: volunteerTotal.volunteers,

        events: eventTotal.events,

        monthlyTrend: monthlyTrend,

        byPurpose: byPurpose,
      },

      recentDonations: recentDonations,

      events: events,
    });
  } catch (e) {
    console.error("");
    console.error("================================");
    console.error("DASHBOARD ERROR");
    console.error("================================");
    console.error(e);
    console.error("================================");

    res.status(500).json({
      message: e.message,
    });
  }
});

// =========================================================
// REPORTS
// =========================================================

router.get("/reports", async (req, res) => {
  try {
    const [[donationStats]] = await db.query(`
            SELECT
                COALESCE(SUM(amount), 0)
                    AS totalDonations,
                COUNT(*)
                    AS donationCount
            FROM donations
        `);

    const [[eventStats]] = await db.query(`
            SELECT
                COUNT(*) AS eventCount
            FROM events
        `);

    const [byPurpose] = await db.query(`
            SELECT
                COALESCE(purpose, 'Other') AS purpose,
                SUM(amount) AS total
            FROM donations
            GROUP BY purpose
            ORDER BY total DESC
        `);

    res.json({
      ...donationStats,

      ...eventStats,

      byPurpose,
    });
  } catch (e) {
    console.error("Reports Error:", e);

    res.status(500).json({
      message: e.message,
    });
  }
});

// =========================================================
// EXPORT
// =========================================================

module.exports = router;
