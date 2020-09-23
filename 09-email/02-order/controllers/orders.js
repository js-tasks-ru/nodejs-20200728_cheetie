const Order = require('../models/Order');
const mapOrder = require('../mappers/order');
const mapProduct = require('../mappers/product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
    const user = ctx.user;
    const { product, phone, address } = ctx.request.body;

    if (!user) {
        ctx.throw(401, 'Пользователь не авторизован');
    }
    
    const order = await new Order({
        user: user.id, product, phone, address
    });
    await order.save();
    
    await sendMail({
        template: 'order-confirmation',
        locals: { 
            id: order.id, 
            product: mapProduct(order.product) 
        },
        to: user.email,
        subject: 'Подтверждение заказа'
    });

    ctx.body = { status: 'ok', order: order.id };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    if (!ctx.user) {
        ctx.throw(401, 'Пользователь не авторизован');
    }

    const orders = await Order
        .find({ user: ctx.user.id })
        // .map(order => mapOrder(order.populate('product')));
    ctx.body = { orders };
};
