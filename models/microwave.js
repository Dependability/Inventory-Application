const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MicrowaveSchema = new Schema({
   name : {type: String, required: true, minLength: 1},
   description : String,
   price : {type: Number, required: true},
   stock : {type: Number, min: 0},
   brand : {type: Schema.Types.ObjectId, ref:"Brand", required: true}

});

MicrowaveSchema.virtual("url").get(function() {
    return "/catalog/microwave/" + this._id;
})

module.exports = mongoose.model("Microwave", MicrowaveSchema)