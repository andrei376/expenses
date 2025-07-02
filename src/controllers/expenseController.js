const db = require('../config/db');

class ExpenseController {
  static async getAllExpenses(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT e.*, c.name as category_name
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getExpense(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT e.*, c.name as category_name
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.id = ?
      `, [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Expense not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createExpense(req, res) {
    try {
      const { category_id, date, cost } = req.body;
      const [result] = await db.query(
        'INSERT INTO expenses (category_id, date, cost) VALUES (?, ?, ?)',
        [category_id, date, cost]
      );
      res.status(201).json({ id: result.insertId, category_id, date, cost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateExpense(req, res) {
    try {
      const { category_id, date, cost } = req.body;
      await db.query(
        'UPDATE expenses SET category_id = ?, date = ?, cost = ? WHERE id = ?',
        [category_id, date, cost, req.params.id]
      );
      res.json({ id: req.params.id, category_id, date, cost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteExpense(req, res) {
    try {
      await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

   static async getExpensesGrouped(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT
          YEAR(e.date) as year,
          MONTH(e.date) as month,
          c.name as category_name,
          COUNT(*) as transaction_count,
          SUM(e.cost) as total_cost
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        GROUP BY YEAR(e.date), MONTH(e.date), c.name
        ORDER BY year DESC, month DESC, c.name ASC
      `);

      // Transform the data into a hierarchical structure
      const groupedData = rows.reduce((acc, row) => {
        const year = row.year;
        const month = row.month;

        if (!acc[year]) {
          acc[year] = {};
        }
        if (!acc[year][month]) {
          acc[year][month] = [];
        }

        acc[year][month].push({
          category: row.category_name,
          transactionCount: row.transaction_count,
          totalCost: row.total_cost
        });

        return acc;
      }, {});

      res.json(groupedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ExpenseController;
