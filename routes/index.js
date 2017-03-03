var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var db = mongojs('mongodb://youssef:youssef@ds161039.mlab.com:61039/miniproject_youssef', ['portfolio']);
//var common   = require('./routes/common');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

module.exports = router;
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/portfolioview', function(req, res, next){
    db.portfolio.find(function(err, portfolio){
        if(err){
            res.send(err);
        }
        //console.log(JSON.stringify(portfolio));
        console.log(portfolio);
        //res.send(portfolio);
        //res.json(portfolio);
        res.render('portfolioview',{portfolio: portfolio});
    });
});

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    //res.render('register', {params: {param1: 'xxx', param2: 'yyy'}});
    res.render('register',{})
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });

});

router.get('/login', function(req, res) {
  //db.portfolio.save({name: "Mohsen", Work: "Shesht"}, function(err, saved) {
//});

  //var portfolio = req.body;
//  db.portfolio.save(portfolio, function(err, portfolio){
  //    if(err){
    //      res.send(err);
    //  }
    //  res.json(portfolio);
  //});
    res.render('login', { user : req.user });

});
router.post('/')

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});
//router.post('/portfolio', common.uploadImage);
// router.post('/', multer({ dest: './public/'}).single('upl'), function(req,res){
// 	console.log(req.body); //form fields
// 	/* example output:
// 	{ title: 'abc' }
// 	 */
// 	console.log(req.file); //form files
// 	/* example output:
//             { fieldname: 'upl',
//               originalname: 'grumpy.png',
//               encoding: '7bit',
//               mimetype: 'image/png',
//               destination: './uploads/',
//               filename: '436ec561793aa4dc475a88e84776b1b9',
//               path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
//               size: 277056 }
// 	 */
// 	res.status(204).end();
// });
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/portfolio', function(req, res) {
    res.render('portfolio');
});
router.get('/portfolioscreen', function(req, res) {
    res.render('portfolioscreen');
});
router.post('/portfolioscreen',multer({ dest: './public/'}).single('image2'),function(req,res){

   	res.status(204).end();
    if(req.body.name ){
        var update={
          $set:{work1:req.file.filename}
        };
        var query={
          name:req.body.name
        };
        db.portfolio.findOne({name:req.body.name}, function(err, result){
            if(err){
                res.redirect('/error');
            }
            //res.json(task);
        });
        //console.log (update);

    db.portfolio.update(query,update, function(err, result){
      if(err){
        res.send(err);
      }
    });
    //res.end("<p>Product updated</p>");
    res.redirect('/success');
}else{
  res.redirect('/error');
}

});
router.get('/error', function(req, res) {
    res.render('error2');
});

router.post('/portfolio',multer({ dest: './public/'}).single('image1'),function(req,res){
  console.log(req.body.name+" "+req.body.work);
  if(req.body.name && (req.body.work ||req.body.image2)){
    if(req.body.image1){
      var portfolio =  {name: req.body.name ,profile:req.file.filename,work:req.body.work,work1:""};
    }else{
      var portfolio =  {name: req.body.name ,profile:"",work:req.body.work,work1:""};
    }

  //console.log(req.body.image1);
  //console.log(req.body.image2);
   	console.log(req.body); //form fields
  // 	/* example output:
  // 	{ title: 'abc' }
  // 	 */
   	console.log(req.file); //form files
  // 	/* example output:
  //             { fieldname: 'upl',
  //               originalname: 'grumpy.png',
  //               encoding: '7bit',
  //               mimetype: 'image/png',
  //               destination: './uploads/',
  //               filename: '436ec561793aa4dc475a88e84776b1b9',
  //         path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
  //               size: 277056 }
  // 	 */
   	res.status(204).end();
  db.portfolio.save(portfolio, function(err, portfolio){
      if(err){
          res.send(err);
      }
    //  res.json(task);
  });
  res.redirect('/success');
  }else{
  res.redirect('/error');
  }
});
router.get('/success', function(req, res) {
    res.render('success');
});

module.exports = router;
