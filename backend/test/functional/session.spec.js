const { test, trait } = use('Test/Suite')('Session')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient')

test('authentication testing - should return JWT token', async ({ assert, client }) => {

    const sessionPayload = {
        email: "dantasmaarotti@gmail.com",
        password: "123456"
    }

    const user = await Factory.model('App/Models/User').create(sessionPayload);

    const response = await client.post('/sessions').send({
        email: 'dantasmaarotti@gmail.com',
        password: '123456',
    }).end()

    response.assertStatus(200);
    assert.exists(response.body.token);
});