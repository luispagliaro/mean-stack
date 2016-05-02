var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs'),
  UserSchema;

// User schema
UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

// Hashes the password before the user is saved
UserSchema.pre('save', function(next) {
  var user = this;

  // Hashes the password only if the password has been changed or user is new
  if (!user.isModified('password')) {
    return next();
  }

  // Generates the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) {
      return next(err);
    }

    // Changes the password to the hashed version
    user.password = hash;
    next();
  });
});

// Method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);