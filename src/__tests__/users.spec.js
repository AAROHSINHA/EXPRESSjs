import {describe, jest} from '@jest/globals';
import { getUserByIdHandler } from '../handlers/users.mjs';

const mockRequest = {
    findUserIndex: 1
};
const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn()
};

describe('get users', () => {
    it('should get user by id', () => {
        getUserByIdHandler(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalled({
            id:2,
            username: "jack",
            displayName: "Jack",
            password:"hello124"
        });
        expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[1]);
    });

    it('should call sendStatus with 404 when user not found', () => {
        const copyMockRequest = {...mockRequest, findUserIndex: 100}
        getUserByIdHandler(mockRequest, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalled(404);
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    })

})