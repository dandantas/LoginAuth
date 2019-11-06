const { test, trait } = use('Test/Suite')('Forgot Password')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const Mail = use('Mail')

trait('Test/ApiClient')
//  wraps all of your databases queries inside a transaction and roll it back after each test.
trait('DatabaseTransactions')


test('it should send an email', async ({ assert, client }) => {

    Mail.fake()

    const forgotPayload = {
        email: 'dantasmaarotti@gmail.com',
    }

    const user = await Factory.
        model('App/Models/User').
        create(forgotPayload);

    const response = await client.
        post('/forgot').
        send(forgotPayload).
        end()


    response.assertStatus(204)

    const recentEmail = Mail.pullRecent()

    assert.equal(recentEmail.message.to[0].address, forgotPayload.email)

    const token = await user.tokens().first();

    assert.include(token.toJSON(), {
        user_id: user.id,
        type: 'forgotpassword'
    })

    Mail.restore()
});