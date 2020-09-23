const { v4: uuid } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');    

module.exports.register = async (ctx, next) => {
  const errors = {};
  const { email, displayName, password } = ctx.request.body;
  const userExists = await User.findOne({ email });
  
  // if (userExists) {
  //   errors.email = 'Такой email уже существует';
  //   ctx.throw(400, { errors });
  // }
  // try {
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
    
  // } catch(err) {
  //   if (err.name !== 'ValidationError') throw err;
  //   throw new ValidationError('Некорректный email.');
  // }
};

module.exports.confirm = async (ctx, next) => {
    const verificationToken = ctx.request.body.verificationToken;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }
    
    user.verificationToken = undefined;
    await user.save();

    const token = uuid();
    const session = new Session({ token, user: user.id, lastVisit: new Date() });
    await session.save();

    ctx.body = { token };
};
