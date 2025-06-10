import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator"
import { mockUsers } from "../utils/constants.js";
import { createUserValidationSchema } from "../utils/validationSchemas.js";
import { resolveIndexByUserId } from '../utils/middlewares.js';

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

    /*
    The query function above just perform the task no matter what
    They dont throw any error. That error handling we need to do ourselves
    */
    const result = validationResult(request);

    // this result will be an object. it will have an error property
    // that errors witll be an array of differenet errors
    const { 
      query: {filter , value}
     } = request;
    if(!filter && !value) return response.status(201).send(mockUsers);
    if(filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )
});

router.post('/api/users', 
  checkSchema(createUserValidationSchema)
  ,(request, response) => {
    const result = validationResult(request);

    // error handler
    if(!result.isEmpty()){
      return response.status(400).send({errors: result.array()}); // gives all validation errors in array
    }

    const data = matchedData(request);
    console.log(data);
    const {body} = request;
    const newUser = {id:mockUsers[mockUsers.length - 1].id + 1, ...body};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
})

router.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser){
        return response.sendStatus(404);
    }else{
        return response.send(findUser);
    }
});

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