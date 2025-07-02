const db = require('../config/db');

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const [rows] = await db.query('SELECT * FROM categories');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategory(req, res) {
    try {
      const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Category not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCategory(req, res) {
    try {
      const { name } = req.body;
      const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
      res.status(201).json({ id: result.insertId, name });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      const { name } = req.body;
      await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id]);
      res.json({ id: req.params.id, name });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CategoryController;
