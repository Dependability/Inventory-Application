const Microwave = require('../models/microwave')
const Brand = require('../models/brand')


exports.index = function(req, res, next) {
    Microwave.countDocuments({}).exec(function(err, microwaveCount) {
        if (err) {
            return next(err);
        }
        Brand.countDocuments({}).exec(function(err, brandCount) {
            if (err) {
                return next(err);
            }
            res.render('index', {microwaveCount, brandCount});
        });
        
        
    });
    
}

exports.microwave_list = function(req, res, next) {
    Microwave.find({}, "name").exec(function(err, result) {
        if (err) {
            return next(err);
        }

        res.render('microwave_list', {title: 'Microwave List', microwave_list: result})
    } )
    
}

exports.microwave_view = function(req, res, next) {
   Microwave.findById(req.params.id).populate("brand").exec(function(err, microwave){
    if (err) {
        return next(err);
    }

    res.render("microwave_view", {title: "Microwave View", microwave})
})
}

exports.microwave_delete = function(req, res, next) {
    if (req.body._id) {
        Microwave.findByIdAndDelete(req.body._id, {}, (err)=> {
            if (err) {
                return next(err)
            }

        })
    }  
    res.redirect('/catalog/microwaves');
}