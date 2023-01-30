const mongoose = require("mongoose");
const Joi = require("joi");

const SupplierSchema = new mongoose.Schema({
  SupplierName: {
    type: String,
    require: true,
    minlength: true,
    trim: true,
  },
});

function ValidateSupplier(supplier) {
  const supplierJoiValidation = Joi.object({
    SupplierName: Joi.string().min(3).required(),
  });
  return supplierJoiValidation.validate(supplier);
}

const Supplier = mongoose.model("Suppliers", SupplierSchema);

module.exports = { Supplier, ValidateSupplier };
