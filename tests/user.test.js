const request = require("supertest");
const Users=require("../models/users.js");
const mongoose=require("mongoose");
//const uuidv4=require("uuid/v4");

const app=require("../appTest.js");


const defaultUserId=new mongoose.Types.ObjectId()
//const apiKey=uuidv4();
const defaultUser={
    _id:defaultUserId,
    name:"testDefault",
    email:"testDefault@test1.com",
    apiKey:"13bfa048-4098-41be-8753-accab3633b90"
}

beforeEach(async()=>{
    await Users.deleteMany();
    await new Users(defaultUser).save()
});

test("Register user", async()=>{
    await request(app).post("/register").send({
        name:"test1",
        email:"test1@test1.com"
    }).expect(201);
});

test("Must fail if email already exists", async()=>{
    await request(app).post("/register").send({
        name:"test2",
        email:"testDefault@test1.com"
    }).expect(400);
});
/*
test("Must fail if name is less than 3 characters", async()=>{
    await request(app).post("/register").send({
        name:"te",
        email:"test3@test3.com"
    }).expect(400);
});
*/