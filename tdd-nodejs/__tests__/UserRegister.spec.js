const request = require('supertest');
const app = require('../src/app');
const User = require("../src/user/User");
const en = require('../locales/en/translation.json');
const tr = require('../locales/tr/translation.json');
const sequelize = require('../src/config/database');
const { response } = require('express');

beforeAll(() => {
    return sequelize.sync();
});

beforeEach(() => {
    return User.destroy({ truncate: true });
});

const validUser = {
    username: 'user1',
    email: 'user1@mail.com',
    password: 'P4ssword'
};

const postUser = (user = validUser) => {
    return request(app)
        .post('/api/1.0/users')
        .send(user);
}

describe("User Registration", () => {

    it('returns 200 OK when signup request is valid', async () => {
        const response = await postUser();
        expect(response.status).toBe(200);
    });
    
    it('returns success message when signup request is valid', async () => {
        const response = await postUser();
        expect(response.body.message).toBe("User created")
    });

    it('saves the user to database', async () => {
        await postUser();

        const userList = await User.findAll();
        expect(userList.length).toBe(1);
    });

    it('saves the username and email to database', async () => {
        await postUser();
        const userList = await User.findAll();

        const savedUser = userList[0];
        expect(savedUser.username).toBe("user1");
        expect(savedUser.email).toBe("user1@mail.com");
    });

    it('hashes the password in database', async () => {
        await postUser();
        const userList = await User.findAll();

        const savedUser = userList[0];
        expect(savedUser.password).not.toBe("P4ssword");
    });

    it('returns 400 when username is null', async () => {
        const response = await postUser({
                username: null,
                email: 'user1@mail.com',
                password: 'P4ssword'
            });

        expect(response.status).toBe(400);
    });

    it('returns validationErrors field in response body when validation error occurs', async () => {
        const response = await postUser({
            username: null,
            email: 'user1@mail.com',
            password: 'P4ssword'
        });

        const body = response.body;

        expect(body.validationErrors).not.toBeUndefined();
    }); 

    it('returns errors for both when usename and email is null', async () => { 
        const response = await postUser({
            username: null,
            email: null,
            password: 'P4ssword'
        });

        const body = response.body;

        expect(Object.keys(body.validationErrors)).toEqual(['username', 'email']);
    });  

    it.each([
        ['username', "Username cannot be null"],
        ['email', "E-mail cannot be null"],
        ['password', "Password cannot be null"]
    ])('when %s is null %s is received', async(field, expectedMesssage) => {
        const user = {
            username: "user1",
            email: "user1@mail.com",
            password: "P4ssword"
        }
        user[field] = null;
        const response = await postUser(user);
        const body = response.body;
        expect(body.validationErrors[field]).toBe(expectedMesssage);
    });

    it('returns size validation error whe username is less than 4 characters', async () => {
        const user = {
            username: "usr",
            email: "user1@mail.com",
            password: "P4ssword"
        }
        const response = await postUser(user);
        const body = response.body;
        expect(body.validationErrors.username).toBe("Must have min 4 and max 32 characters");
    })

    // it("returns E-mail is use when same email is already in use", async() => {
    //     await User.create(validUser);
    //     const response = await postUser(validUser);

    //     expect(response.body.validationErrors.email).toBe('E-mail in use');
    // })
    
});

describe('Internationalization', () => {
    it.each`
        field         | value              | expectedMessage
        ${'username'} | ${null}            | ${tr.username_null}
        ${'username'} | ${'usr'}           | ${tr.username_size}
        ${'username'} | ${'a'.repeat(33)}  | ${tr.username_size}
        ${'email'}    | ${null}            | ${tr.email_null}
        ${'email'}    | ${'mail.com'}      | ${tr.email_invalid}
        ${'email'}    | ${'user.mail.com'} | ${tr.email_invalid}
        ${'email'}    | ${'user@mail'}     | ${tr.email_invalid}
        ${'password'} | ${null}            | ${tr.password_null}
        ${'password'} | ${'P4ssw'}         | ${tr.password_size}
        ${'password'} | ${'alllowercase'}  | ${tr.password_pattern}
        ${'password'} | ${'ALLUPPERCASE'}  | ${tr.password_pattern}
        ${'password'} | ${'1234567890'}    | ${tr.password_pattern}
        ${'password'} | ${'lowerandUPPER'} | ${tr.password_pattern}
        ${'password'} | ${'lower4nd5667'}  | ${tr.password_pattern}
        ${'password'} | ${'UPPER44444'}    | ${tr.password_pattern}
    `(
      'returns $expectedMessage when $field is $value when language is set as turkish',
      async ({ field, expectedMessage, value }) => {
            const user = {
                username: 'user1',
                email: 'user1@mail.com',
                password: 'P4ssword',
            };
            user[field] = value;
            const response = await postUser(user, { language: 'tr' });
            const body = response.body;
            expect(body.validationErrors[field]).toBe(expectedMessage);
        }
    );
  
    it(`returns ${tr.email_inuse} when same email is already in use when language is set as turkish`, async () => {
        await User.create({ ...validUser });
        const response = await postUser({ ...validUser }, { language: 'tr' });
        expect(response.body.validationErrors.email).toBe(tr.email_inuse);
    });
  
    it(`returns success message of ${tr.user_create_success} when signup request is valid and language is set as turkish`, async () => {
        const response = await postUser({ ...validUser }, { language: 'tr' });
        expect(response.body.message).toBe(tr.user_create_success);
    });
  
    it(`returns ${tr.email_failure} message when sending email fails and language is set as turkish`, async () => {
        simulateSmtpFailure = true;
        const response = await postUser({ ...validUser }, { language: 'tr' });
        expect(response.body.message).toBe(tr.email_failure);
    });
    it(`returns ${tr.validation_failure} message in error response body when validation fails`, async () => {
        const response = await postUser(
            {
                username: null,
                email: validUser.email,
                password: 'P4ssword',
            },
            { language: 'tr' }
        );
        expect(response.body.message).toBe(tr.validation_failure);
    });
  });