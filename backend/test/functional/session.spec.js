const { test, trait } = use('Test/Suite')('Session')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('authentication testing - should return JWT token', async ({ assert, client }) => {

    const sessionPayload = {
        email: "dantasmaarotti@gmail.com",
        password: "123456"
    }

    await Factory.model('App/Models/User').create(sessionPayload);

    const response = await client.post('/sessions').send({
        email: 'dantasmaarotti@gmail.com',
        password: '123456',
    }).end()

    response.assertStatus(200);
    assert.exists(response.body.token);
});