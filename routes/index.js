var express = require('express');
var router = express.Router();
const Brand = require('../models/brand');
const Microwave = require('../models/microwave');
const {body, validationResult} = require('express-validator')
/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/catalog');

});

router.get('/create/microwave', function(req, res, next) {
  Brand.find({},{name: true}, {}, (err, findList)=> {
    if (err) {
      return next(err);
    }

    res.render('microwave_create', {
      brandList: findList,
      microwave: {},
      errors: []})

  })
  // 
})

router.post(
  '/create/microwave', 
  body('name', 'Name is empty').isLength({min: 1}).trim().escape(),
  body('desc').optional({checkFalsy: true}).escape(),
  body('stock', "Stock is not a number").isNumeric().default(0),
  body('price', "Invalid Price").isNumeric(),
  //custom for brand
  body('brand', "Invalid Brand").custom(value => {
    return Brand.findById(value).then((brand) => {
      if (!brand) {
        Promise.reject('No brand found.')
      }
    })
  }), 
  function(req, res, next) {
    const errors = validationResult(req);
    Brand.find({},{name: true}, {}).then(brands => {
      console.log('first')
      if (!errors.isEmpty()) {
        console.log('please')
        console.log('second')
        res.render("microwave_create", {
          microwave: req.body,
          errors: errors.array(),
          brandList: brands
        })
        return
      }
      const newMw = new Microwave({
        name: req.body.name,
        price: req.body.price,
        brand: req.body.brand
      });
    
      if (req.body.desc) {
        newMw.description = req.body.desc;
      }
      if (req.body.stock) {
        newMw.stock = req.body.stock;
      }
    
      Microwave.findOne({name: req.body.name}, {}, {}, (err, found) => {
        if (err) {
          return next(err);
        }
        if (found) {
          res.redirect(found.url); 
        } else {
          newMw.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(newMw.url);
          })
        }
      })
  
  
  
    })
    
  
})

router.get('/create/brand', function(req, res) {
  res.render('brand_create')
})

router.post('/create/brand', function(req, res, next) {
  /* Validate data */
  const newBrand = new Brand({name: req.body.name, description: req.body.desc})
  
  //Check if brand exists
  Brand.findOne({name: req.body.name},{},{},(err, foundBrand)=>{
    if (err) {
      return next(err);
    } 

    if (foundBrand) {
      res.redirect(foundBrand.url);
    } else {
      newBrand.save((err)=> {
        if (err) {
          return next(err);
        } 
        res.redirect(newBrand.url)
      })
    }
  })
})

module.exports = router;
