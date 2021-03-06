var db = require("../models");

module.exports = function (app) {
    app.get("/api/expenses", function (req, res) {
        // Here we add an "include" property to our options in our findAll query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Post
        //console.log(req);

        db.Expense.findAll({
            include: [db.User]
        }).then(function (dbExpense) {
            //console.log(dbExpense);
            res.json(dbExpense);
        });
    });

    app.get("/api/expenses/:id", function (req, res) {
        // Here we add an "include" property to our options in our findOne query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Post
        db.Expense.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (dbExpense) {
            //console.log(dbExpense);
            res.json(dbExpense);
            
        });
    });

    app.get("/api/expenses/by-user/:id", (req, res) => {
        db.Expense.findAll({
            where: {
                UserId: req.params.id
            }
        }).then(function (dbExpense) {
            res.json(dbExpense);
        });
    });

    app.get("/api/expenses/by-category/:id", (req, res) => {
        db.Expense.findAll({
            attributes: ['category', [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'amount']],
            where: {
                UserId: req.params.id
            },
            group: ['category']            
        }).then(function (dbExpense) {
            res.json(dbExpense);
        });
    });

    app.post("/api/expenses", function (req, res) {
        var newExpense = {
            isRecurring: true,
            date: req.body.expensedate,
            amount: req.body.expenseamt,
            category: req.body.expensecat,
            vendor: req.body.vendor,
            description: req.body.expensedesc,
            UserId: req.user.id
        }
        db.Expense.create(newExpense).then(function (dbExpense) {
            console.log("New expense added.")
            res.redirect("/index");
        });
    });

    app.post("/api/expenses/:id", function(req, res) {
        console.log("ID *******",req.params.id);
        db.Expense.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(function(dbExpense) {
            res.redirect("/index");
          });
      });
};
