const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Forgot Password')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Hash = use('Hash')

const Mail = use('Mail')


trait('Test/ApiClient')
trait('DatabaseTransactions')

beforeEach(() => {
    Mail.fake()
})
afterEach(() => {
    Mail.restore()
})

async function generateForgotPasswordToken(client, email) {
    const user = await Factory.
        model('App/Models/User').
        create({ email });

    await client.
        post('/forgot').
        send({ email }).
        end();

    const token = await user.tokens().first();

    return token;
}

test('it should send an email', async ({ assert, client }) => {
    const email = 'dantasmaarotti@gmail.com';

    const token = await generateForgotPasswordToken(client, email)

    const recentEmail = Mail.pullRecent()

    assert.equal(recentEmail.message.to[0].address, email)
    assert.include(token.toJSON(), {
        type: 'forgotpassword'
    })

});

// entra numa rota nova de reset /reset
// usuário digita a nova senha 
// confirma a senha
// muda a senha definitivamente
// caso seja feita a requisição passado 2h da criação do token, dar erro

test('it should reset password definitively', async ({ assert, client }) => {
    const email = 'dantasmaarotti@gmail.com';

    const { token } = await generateForgotPasswordToken(client, email)

    const response = await client.post('/reset')
        .send({
            token,
            password: '123456',
            password_confirmation: '123456'
        })
        .end()

    response.assertStatus(204)

    const user = await User.findBy('email', email);
    const checkPassword = await Hash.verify('123456', user.password);

    assert.isTrue(checkPassword);

})