const Brand = require('../models/brand');
const Microwave = require('../models/microwave')
const async = require('async');
const { microwave_list } = require('./microwave_controller');
exports.brand_list = function(req, res, next) {
    Brand.find((err, brands)=>{
        if (err) {
            return next(err);
        }

        res.render('brand_list', {title: "Brand List", brand_list: brands})
    })

}

exports.brand_view = function(req, res, next) {
    async.parallel({
        brand(cb) {
            Brand.findById(req.params.id).exec(cb)
        },
        brand_microwaves(cb) {
            Microwave.find({brand: req.params.id}).exec(cb)
        }
    }, function (err, result) {
        if (err) {
            return next(err)
        }
        if (result.brand == null) {
            const err = new Error("No Brand");
            err.status = 404;
            return next(err);
        }

        res.render("brand_view", {title: result.brand.name, brand: result.brand, microwave_list: result.brand_microwaves})

    }   
    )
}
