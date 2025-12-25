import { db } from "../config/db";

export async function recordUsage(req: any, res: any) {
  try {
    const { userId, action, usedUnits } = req.body;

    await db.query(
      "INSERT INTO usage_records (user_id, action, used_units) VALUES (?, ?, ?)",
      [userId, action, usedUnits]
    );

    res.json({ message: "Usage recorded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
