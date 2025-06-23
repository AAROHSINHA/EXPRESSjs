import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator"
import { mockUsers } from "../utils/constants.js";
import { createUserValidationSchema } from "../utils/validationSchemas.js";
import { resolveIndexByUserId } from '../utils/middlewares.js';
import User from "../mongoose/schemas/user.mjs";
import { getUserByIdHandler } from "../handlers/users.mjs";
// import { hashPassword } from "../utils/helpers.mjs";

const router = Router(); // Router object
// a good thing about routers is that it has all important functions such as get post as the normal app
router.get('/api/users'
  ,query('filter')
  .isString()
  .notEmpty().withMessage('Must Not be empty')
  .isLength({min: 3, max: 10}).withMessage('Must be atlease 3 to 10 characters'),
   (request, response) => {
    // the sessions will be same for all routes and request
    // you will see that the / has same as /api/users
    console.log(request.session);
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if(err){
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    })
    const result = validationResult(request);
    const { 
      query: {filter , value}
     } = request;
    if(!filter && !value) return response.status(201).send(mockUsers);
    if(filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )
});

router.post('/api/users' , checkSchema(createUserValidationSchema), async (request, response) => {
  const result = validationResult(request);
  if(!result.isEmpty()) return response.status(400).send(result.array()); 
    const data = matchedData(request);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try{
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    }catch(err){
      console.log(err);
      return response.sendStatus(400);
    }
})

router.get('/api/users/:id', resolveIndexByUserId, getUserByIdHandler);

// PUT
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request; // findUserIndex is defined
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

// PATCH
router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

// DELETE
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex);
  return response.sendStatus(200);
});


export default router;