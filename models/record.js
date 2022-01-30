const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  location: {
    type: String,
    required:true,
  },
  datetime: Date,
  sensorType: String,
  value: Number
});

recordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Record', recordSchema);