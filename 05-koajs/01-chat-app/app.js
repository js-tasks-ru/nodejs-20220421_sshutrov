const path = require('path');
const Koa = require('koa');
const app = new Koa();

var x = 0;

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const users = new Set();

router.get('/subscribe', async (ctx, next) => {
    const message = await new Promise((resolve,reject) => {
        users.add(resolve);
        ctx.res.on('close', () => {
            users.delete(resolve);
            resolve();
        });
    });
    
    ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
    const {message} = ctx.request.body;
    if (!message) {
        return ctx.throw(400, 'Empty messages not allowed!')
    }
    users.forEach((resolve => resolve(message)));
    ctx.body = 'Message sended!'
});



app.use(router.routes());

module.exports = app;
