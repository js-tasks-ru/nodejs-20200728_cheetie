const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const { token } = socket.handshake.query;
    
    if (!token) {
      return next(new Error("anonymous sessions are not allowed"));
    }
    
    const session = await Session.findOne({ token }).populate('user');
    
    if (!session) {
      return next(new Error("wrong or expired session token"));
    }
    
    socket.user = session.user;

    return next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async message => {
      const { user } = socket;
      
      await Message.create({
        user: user.displayName,
        chat: user.id,
        text: message,
        date: new Date(),
      });
    });
  });

  return io;
}

module.exports = socket;
