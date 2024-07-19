const mongoose = require('mongoose');

const InheritanceResultSchema = new mongoose.Schema({
  email: { type: String, required: true },
  result: {
    shares: {
      type: Map,
      of: Number,
      required: true,
    },
    references: {
      type: Map,
      of: String,
      required: true,
    },
    totalAmount: { type: Number, required: true },
    gender: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('InheritanceResult', InheritanceResultSchema);
