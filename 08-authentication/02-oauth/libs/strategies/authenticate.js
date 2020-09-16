const User = require('../../models/User');  // npm run test:local 08-authentication 02-oauth

module.exports = async function authenticate(strategy, email, displayName = email, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, displayName });
      await user.save();
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
};


