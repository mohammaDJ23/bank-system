import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserDto } from 'src/dtos/user.dto';
import { TokenDto } from 'src/dtos/token.dto';

require('dotenv').config();

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let newUser = {
      firstName: 'mohammad',
      lastName: 'nowresideh',
      email: 'mohammad.nowresideh1997@gmail.com',
      password: '123!@#Ss',
      phone: '+989174163042',
    },
    createdUserId = null;

  beforeEach(() => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(newUser)
      .expect(201)
      .then((res) => {
        const body: UserDto = res.body;
        expect(body.firstName).toEqual(newUser.firstName);
        expect(body.lastName).toEqual(newUser.lastName);
        expect(body.email).toEqual(newUser.email);
        expect(body.phone).toEqual(newUser.phone);
        expect(body.password).toBeUndefined();
        createdUserId = body.id;
      });
  });

  afterEach(() => {
    return request(app.getHttpServer())
      .delete('/auth/delete-account')
      .send({ id: createdUserId })
      .expect(200)
      .then((res) => {
        const body: UserDto = res.body;
        expect(body.firstName).toEqual(newUser.firstName);
        expect(body.lastName).toEqual(newUser.lastName);
        expect(body.email).toEqual(newUser.email);
        expect(body.phone).toEqual(newUser.phone);
        expect(body.password).toBeUndefined();
        createdUserId = null;
      });
  });

  it('login the user => /auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: newUser.email, password: newUser.password })
      .expect(201)
      .then((res) => {
        const body: TokenDto = res.body;
        expect(body.accessToken).toBeDefined();
      });
  });
});
