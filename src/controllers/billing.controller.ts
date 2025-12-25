import { db } from "../config/db";
import { getMonthRange } from "../utils/date";

export async function currentUsage(req: any, res: any) {
  try {
    const userId = Number(req.params.id);
    const { start, end } = getMonthRange();

    const [planRows]: any = await db.query(
      `
      SELECT p.*
      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.user_id = ? AND s.is_active = true
      `,
      [userId]
    );

    if (!planRows.length) {
      return res.status(404).json({ message: "No active plan" });
    }

    const plan = planRows[0];

    const [usageRows]: any = await db.query(
      `
      SELECT COALESCE(SUM(used_units), 0) AS total
      FROM usage_records
      WHERE user_id = ? AND created_at >= ? AND created_at < ?
      `,
      [userId, start, end]
    );

    const totalUsed = Number(usageRows[0].total);

    res.json({
      totalUsed,
      remainingUnits: Math.max(plan.monthly_quota - totalUsed, 0),
      activePlan: plan,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function billingSummary(req: any, res: any) {
  try {
    const userId = Number(req.params.id);
    const { start, end } = getMonthRange();

    const [planRows]: any = await db.query(
      `
      SELECT p.*
      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.user_id = ? AND s.is_active = true
      `,
      [userId]
    );

    if (!planRows.length) {
      return res.status(404).json({ message: "No active plan" });
    }

    const plan = planRows[0];

    const [usageRows]: any = await db.query(
      `
      SELECT COALESCE(SUM(used_units), 0) AS total
      FROM usage_records
      WHERE user_id = ? AND created_at >= ? AND created_at < ?
      `,
      [userId, start, end]
    );

    const totalUsage = Number(usageRows[0].total);
    const extraUnits = Math.max(totalUsage - plan.monthly_quota, 0);
    const extraCharges = Number(
      (extraUnits * plan.extra_charge_per_unit).toFixed(2)
    );

    res.json({
      totalUsage,
      planQuota: plan.monthly_quota,
      extraUnits,
      extraCharges,
      activePlan: plan,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
