const { v4: uuid } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');    

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.request.body;
  const verificationToken = uuid();
  
  const user = await User.create({ email, displayName, verificationToken });
  await user.setPassword(password);
  await user.save();
  
  await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту'
  });
  
  ctx.body = { status: 'ok' };
};

module.exports.confirm = async (ctx, next) => {
    const verificationToken = ctx.request.body.verificationToken;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }
    
    user.verificationToken = undefined;
    await user.save();

    const token = ctx.login(user);

    ctx.body = { token };
};
