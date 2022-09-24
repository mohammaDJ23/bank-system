import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserDto } from 'src/dtos/user.dto';

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

  describe('signup', () => {
    const newUser = {
      firstName: 'mohammad',
      lastName: 'nowresideh',
      email: 'mohammad.nowresideh1997@gmail.com',
      password: '123!@#Ss',
      phone: '+989174163042',
    };

    it('create a new user => /auth/signup (POST)', () => {
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
        });
    });
  });
});
