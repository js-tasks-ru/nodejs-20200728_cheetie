module.exports = function mapMessage(message) {
    return {
        date: message.date,
        id: message.id,
        text: message.text,
        user: message.user,
    };
  };