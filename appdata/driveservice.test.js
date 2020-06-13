const DriveService = require('./driveservice');
const constants = require('../constants');
const exceptions = require('../exceptions');
const DriveClient = require('drive-appdata-client');
const googleauth = require('../googleauth');

const mockAuthClient = { test: 1};
googleauth.createAuthClient = jest.fn().mockImplementation(() => mockAuthClient);

const mockFind = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

const mockDriveClientContructor = jest.fn().mockImplementation(() => {
    return {
      find: mockFind,
      create: mockCreate,
      update: mockUpdate
    };
  });

jest.mock('drive-appdata-client');
DriveClient.mockImplementation(mockDriveClientContructor);

describe('savedatatodrive', () => {
    it('creates drive client passing authclient', ()=>{
        //Arrange, Act
         new DriveService();
    
        // Assert
        expect(mockDriveClientContructor).toHaveBeenCalledWith(mockAuthClient);
    });

    it('throws exception when data is not passed', ()=>{
        const driveService = new DriveService();
        const data = null;
        const user = {};
        const saveDataToDrive = () => driveService.saveDataToDrive(data, user);
        expect(saveDataToDrive).toThrowError('data');
        expect(saveDataToDrive).toThrowError(exceptions.ArgumentNullException);
    });

    it('throws exception when data.email is not set', ()=>{
        const driveService = new DriveService();
        const data = {};
        const user = {};
        const saveDataToDrive = () => driveService.saveDataToDrive(data, user);
        expect(saveDataToDrive).toThrowError('user.email');
        expect(saveDataToDrive).toThrowError(exceptions.ArgumentException);
    });

    it('when find returns no existing files then it creates new file', async()=>{
        // Arrange
        const expectedResult = {id:'12345'};
        mockFind.mockImplementation(()=>Promise.resolve([]));
        mockCreate.mockImplementation(() => Promise.resolve(expectedResult));
        const driveService = new DriveService();        
        const data = {x:'1'};
        const user = {email:'email'};

        // Act
        const result = await driveService.saveDataToDrive(data, user);

        //Assert
        expect(mockFind).toHaveBeenCalledWith(constants.DATA_FILE_NAME);
        expect(mockCreate).toHaveBeenCalledWith(constants.DATA_FILE_NAME, JSON.stringify(data));
        expect(result).toBe(expectedResult);
    });

    it('when find returns one existing file then it updates the file', async()=>{
        // Arrange
        const expectedResult = {id:'12345'};
        mockFind.mockImplementation(()=>Promise.resolve([expectedResult]));
        mockUpdate.mockImplementation(() => Promise.resolve(expectedResult));
        const driveService = new DriveService();        
        const data = {x:'1'};
        const user = {email:'email'};

        // Act
        const result = await driveService.saveDataToDrive(data, user);

        //Assert
        expect(mockFind).toHaveBeenCalledWith(constants.DATA_FILE_NAME);
        expect(mockUpdate).toHaveBeenCalledWith(expectedResult.id, JSON.stringify(data));
        expect(result).toBe(expectedResult);
    });

    it('when find returns multiple existing file then rejected promise is returned', async()=>{
        // Arrange
        mockFind.mockImplementation(()=> Promise.resolve([{id:'1'},{id:'2'}]));
        const driveService = new DriveService();        
        const data = {x:'1'};
        const user = {email:'email'};

        //Act, Assert
        await expect(driveService.saveDataToDrive(data, user)).rejects.toEqual('found multiple ' + constants.DATA_FILE_NAME);
    });
})