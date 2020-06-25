import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.model';
import { async } from 'rxjs/internal/scheduler/async';

describe('UserController', () => {

  let userController: UserController
  let userService: UserService

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    }).compile()

    userService = moduleRef.get<UserService>(UserService)
    userController = moduleRef.get<UserController>(UserController)
  })

  // describe("create a new user", () => {

  //   it('deve retornar o usuário que foi criado', async () => {

  //     expect(await userController.create({
  //       email: 'erislandio.soares@acct.global',
  //       password: "12345",
  //       name: "erislandio",

  //     })).toBe()

  //   })

  // })

});
