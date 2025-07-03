const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');

router.get('/grouped', ExpenseController.getExpensesGrouped);
router.get('/', ExpenseController.getAllExpenses);
router.get('/:id', ExpenseController.getExpense);
router.post('/', ExpenseController.createExpense);
router.put('/:id', ExpenseController.updateExpense);
router.delete('/:id', ExpenseController.deleteExpense);




module.exports = router;
