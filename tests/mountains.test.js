const request = require("supertest");
const Mountains=require("../models/mountains.js");

const app=require("../appTest.js");


test("must fail with no apikey", async()=>{
    const res=await request(app).get("/api/mountains?m=everest").expect(401);
    const msg="{\"msg\":\"No apiKey. If you dont have an apiKey please Regiser\"}"
    expect(res.text).toMatch(msg)

})

test("must return everything in the database",async ()=>{
    await request(app).get("/api/mountains?apiKey=13bfa048-4098-41be-8753-accab3633b90").expect(200)
    
});

test("must return the 14 mountains higher than 8000meters",async ()=>{
    await request(app).get("/api/mountains?apiKey=13bfa048-4098-41be-8753-accab3633b90&mtm=8000").expect(200)
    const mountains=await Mountains.find({Metres:{$gt:8000}})
       expect(mountains.length).toBe(14);
});