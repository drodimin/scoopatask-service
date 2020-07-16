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
const mockGet = jest.fn();

const mockDriveClientContructor = jest.fn().mockImplementation(() => {
    return {
      find: mockFind,
      create: mockCreate,
      update: mockUpdate,
      get: mockGet
    };
  });

jest.mock('drive-appdata-client');
DriveClient.mockImplementation(mockDriveClientContructor);

describe('savedatatodrive', () => {
    it('throws exception when data is not passed', ()=>{
        const driveService = new DriveService();
        const data = null;
        const user = {};
        const saveDataToDrive = () => driveService.saveDataToDrive(data, user);
        expect(saveDataToDrive).toThrowError('data');
        expect(saveDataToDrive).toThrowError(exceptions.ArgumentNullException);
    });

    it('throws exception when user.email is not set', ()=>{
        const driveService = new DriveService();
        const data = {};
        const user = {};
        const saveDataToDrive = () => driveService.saveDataToDrive(data, user);
        expect(saveDataToDrive).toThrowError('user.email');
        expect(saveDataToDrive).toThrowError(exceptions.ArgumentException);
    });

    it('throws exception when user.google is not set', ()=>{
        const driveService = new DriveService();
        const data = {};
        const user = {email:'email'};
        const saveDataToDrive = () => driveService.saveDataToDrive(data, user);
        expect(saveDataToDrive).toThrowError('user.google');
        expect(saveDataToDrive).toThrowError(exceptions.ArgumentException);
    });

    it('creates drive client passing authclient', async()=>{
        //Arrange
        const driveService = new DriveService();
        const data = {};
        const user = {email:'email',google:{token:'12345'}};
        mockFind.mockImplementation(()=>Promise.resolve([]));
        mockCreate.mockImplementation(() => Promise.resolve({}));
        const saveDataToDrive = () => driveService.saveDataToDrive(data, user);
    
        //Act 
        await saveDataToDrive();

        // Assert
        expect(mockDriveClientContructor).toHaveBeenCalledWith(mockAuthClient);
        expect(googleauth.createAuthClient).toHaveBeenCalledWith(user.google);
    });

    it('when find returns no existing files then it creates new file', async()=>{
        // Arrange
        const expectedResult = {id:'12345'};
        mockFind.mockImplementation(()=>Promise.resolve([]));
        mockCreate.mockImplementation(() => Promise.resolve(expectedResult));
        const driveService = new DriveService();        
        const data = {x:'1'};
        const user = {email:'email',google:{token:'12345'}};

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
        const user = {email:'email',google:{token:'12345'}};

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
        const user = {email:'email',google:{token:'12345'}};

        //Act, Assert
        await expect(driveService.saveDataToDrive(data, user)).rejects.toEqual('found multiple ' + constants.DATA_FILE_NAME);
    });
})

describe('loaddatafromdrive', () => {
    it('throws exception when user is not passed', ()=>{
        // Arrange
        const driveService = new DriveService();
        const user = undefined;

        // Act
        const loadDataFromDrive = () => driveService.loadDataFromDrive(user);

        // Assert
        expect(loadDataFromDrive).toThrowError('user');
        expect(loadDataFromDrive).toThrowError(exceptions.ArgumentNullException);
    });

    it('throws exception when user.email is not set', ()=>{
        // Arrange
        const driveService = new DriveService();
        const user = {};

        // Act
        const loadDataFromDrive = () => driveService.loadDataFromDrive(user);

        // Assert
        expect(loadDataFromDrive).toThrowError('user.email');
        expect(loadDataFromDrive).toThrowError(exceptions.ArgumentException);
    });

    it('throws exception when user.google is not set', ()=>{
        // Arrange
        const driveService = new DriveService();
        const user = {email:'email'};

        // Act
        const loadDataFromDrive = () => driveService.loadDataFromDrive(user);

        // Assert
        expect(loadDataFromDrive).toThrowError('user.google');
        expect(loadDataFromDrive).toThrowError(exceptions.ArgumentException);
    });

    it('creates drive client passing authclient', async()=>{
        //Arrange
        const driveService = new DriveService();
        const user = {email:'email',google:{token:'12345'}};
        mockFind.mockImplementation(()=>Promise.resolve([]));
        const saveDataToDrive = () => driveService.loadDataFromDrive(user);
    
        //Act 
        await saveDataToDrive();

        // Assert
        expect(mockDriveClientContructor).toHaveBeenCalledWith(mockAuthClient);
        expect(googleauth.createAuthClient).toHaveBeenCalledWith(user.google);
    });

    it('when find returns no existing files then returns empty object', async()=>{
        // Arrange
        mockFind.mockImplementation(()=>Promise.resolve([]));
        const driveService = new DriveService();        
        const user = {email:'email',google:{token:'12345'}};

        // Act
        const result = await driveService.loadDataFromDrive(user);

        //Assert
        expect(mockFind).toHaveBeenCalledWith(constants.DATA_FILE_NAME);
        expect(result).toEqual({});
    });

    it('when find returns one existing file then it returns result of calling get on the file', async()=>{
        // Arrange
        const findResult = {id:'12345'};
        const getResult = {test:'Test'};
        mockFind.mockImplementation(()=>Promise.resolve([findResult]));
        mockGet.mockImplementation(() => Promise.resolve(getResult));
        const driveService = new DriveService();
        const user = {email:'email',google:{token:'12345'}};

        // Act
        const result = await driveService.loadDataFromDrive(user);

        //Assert
        expect(mockFind).toHaveBeenCalledWith(constants.DATA_FILE_NAME);
        expect(mockGet).toHaveBeenCalledWith(findResult.id);
        expect(result).toBe(getResult);
    });

    it('when find returns multiple existing file then rejected promise is returned', async()=>{
        // Arrange
        mockFind.mockImplementation(()=> Promise.resolve([{id:'1'},{id:'2'}]));
        const driveService = new DriveService();        
        const user = {email:'email',google:{token:'12345'}};

        //Act, Assert
        await expect(driveService.loadDataFromDrive(user)).rejects.toEqual('found multiple ' + constants.DATA_FILE_NAME);
    });
})