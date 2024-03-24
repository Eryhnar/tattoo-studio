import request from "supertest";
import { AppDataSource } from "../database/db";
import {app} from '../app'
// import { Server } from 'http'

let server: any;
let token = "";

beforeAll(async () => {
  await AppDataSource.initialize()

  server = app.listen(4001);
})

describe("api healthy", () => {
    test("server is healthy", async () => {
        
        const {status, body} = await request(server).get("/api/healthy")
        expect(status).toBe(200)
        expect(body.success).toBe(true)
    })
    
})

describe("api auth", () => {
  test("register user", async () => {
    const {status, body} = await request(server)
    .post("/api/register")
    .send(
      {
        name: "pepelu",
        email: "pepelu@user.com",
        password: "Aa123456"
      }
    )
    expect(status).toBe(201)
  })
  test("login user", async () => {
    const {status, body} = await request(server)
    .post("/api/login")
    .send(
      {
        email: "pepelu@user.com",
        password: "Aa123456"
      }
    )

    token = body.token
    expect(status).toBe(200)

  })
})

describe("api user", () => {
  test("get profile", async () => {
    const {status, body} = await request(server)
    .get("/api/users/profile")
    .set('Authorization', `Bearer ${token}`)
    expect(status).toBe(200)
  })
  test("update profile", async () => {
    const {status, body} = await request(server)
    .put("/api/users/profile")
    .set('Authorization', `Bearer ${token}`)
    .send(
      {
        name: "pepelulu"
      }
    )
    expect(status).toBe(200)
  })
})

afterAll(async () => {
  try {
    if (server) {
      await server.close();
      console.log('Server closed');
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error closing server and destroying database connection:', error);
    throw error;
  }
})
