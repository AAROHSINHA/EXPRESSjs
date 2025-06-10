import {Router} from "express";

const router = Router();

router.get('/api/products', (request, response) => {
  console.log(request.header.cookies); // unparsed
  if(request.cookies.hello && request.cookies.hello === 'world')
   return response.send([{id:123, name:"Chicken Breast", price:9.99}]);

  return response.send({msg:"Sorry u need a correct cookie"});
})

export default router;
