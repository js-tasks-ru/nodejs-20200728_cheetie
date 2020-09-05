const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        console.error(e);
    }
});

const clients = new Set();

router.get('/subscribe', async (ctx, next) => {
    ctx.request.body = await new Promise(resolve => {
        clients.add(resolve);

        ctx.req.on('close', function() { 
            clients.delete(resolve);
        });
    });
    
    await next();

}, async (ctx) => {
    ctx.response.status = 200;
    ctx.body = ctx.request.body;
});

router.post('/publish', async (ctx, next) => {
    const { message } = ctx.request.body;

    if (!message) ctx.throw(400, 'message is required');
   
    for (const resolve of clients) {
        resolve(message);
    }

    ctx.response.status = 201;
    ctx.body = "success";
});

app.use(router.routes());

module.exports = app;