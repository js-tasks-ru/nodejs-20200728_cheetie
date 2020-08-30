const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const messages = [];
const clients = [];

const getMessages = () => {
    return new Promise(resolve => {
        if (messages.length) resolve(messages);
        else setTimeout(() => resolve(getMessages()), 500);
    });
}

router.get('/subscribe', async (ctx, next) => {
    const message = await getMessages()
        .then(messages => messages.join('\n'));

    ctx.request.body = message;
    messages.length = 0;

    await next();
}, async (ctx, next) => {
    ctx.response.status = 200;
    ctx.body = ctx.request.body;
});

router.post('/publish', async (ctx, next) => {
    const { message } = ctx.request.body;
    if (!message) return ctx.throw(400, 'message is required');
    messages.push(message);
    ctx.response.status = 201;
    ctx.body = "success";
});

app.use(router.routes());

module.exports = app;
