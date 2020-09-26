module.exports = function(app, passport, db, dateFormat,ObjectID) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('order').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            order: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

  app.get('/order',isLoggedIn, function(req,res) {
    db.collection('order').find().toArray((err, result) => {
      console.log(result)
      if (err) return console.log(err)
      res.render('order.ejs', {
        user : req.user,
        order:result
      })
    })
  });


    app.post('/order', (req, res) => {
      console.log(req.body)
      //Date internal function that returns current date
      //npm install dateformat
      var date = dateFormat(new Date(), "ddd mm/dd/yy h:MM ");
      console.log(date)
      db.collection('order').save({name: req.body.name, order: req.body.order,orderTime: date, orderDone: false, barista: req.body.barista}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/order')
      })
    })

    app.put('/order', isLoggedIn, function(req, res) {
         db.collection('order')
         .findOneAndUpdate({_id: ObjectID(req.body.id)}, {
           $set: {
             orderDone:true,
             barista: req.body.barista
           }
         }, {
           sort: {_id: 1},
           upsert: true
         }, (err, result) => {
           if (err) return res.send(err)
           res.send(result)
         })
       })

       app.delete('/order', (req, res) => {
         console.log(req.body.id)
         db.collection('order').remove({_id: ObjectID(req.body.id)}, (err, result) => {
           if (err) return res.send(500, err)
           res.send('Order deleted!')
         })
       })



// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
