import { mockUsers } from "../utils/constants";
export const getUserByIdHandler = (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser){
        return response.sendStatus(404);
    }else{
        return response.send(findUser);
    }
}