const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
    const { product, phone, address } = ctx.request.body;
    const { user } = ctx;

    const order = await Order.create({ user, product, phone, address });
    
    await sendMail({
        template: 'order-confirmation',
        locals: { id: order.id, product },
        to: user.email,
        subject: 'Подтверждение заказа'
    });

    ctx.body = { order: order.id };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orders = await Order.find({ user: ctx.user })
        .then(orders => orders.map(order => mapOrder(order.populate('product'))));
        
    ctx.body = { orders };
};
