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

describe('savehistorytodrive', () => {
    it('throws exception when history is not passed', ()=>{
        const driveService = new DriveService();
        const history = null;
        const user = {};
        const saveHistoryToDrive = () => driveService.saveHistoryToDrive(history, user);
        expect(saveHistoryToDrive).toThrowError('history');
        expect(saveHistoryToDrive).toThrowError(exceptions.ArgumentNullException);
    });

    it('throws exception when user.email is not set', ()=>{
        const driveService = new DriveService();
        const history = {};
        const user = {};
        const saveHistoryToDrive = () => driveService.saveHistoryToDrive(history, user);
        expect(saveHistoryToDrive).toThrowError('user.email');
        expect(saveHistoryToDrive).toThrowError(exceptions.ArgumentException);
    });

    it('throws exception when user.google is not set', ()=>{
        const driveService = new DriveService();
        const history = {};
        const user = {email:'email'};
        const saveHistoryToDrive = () => driveService.saveHistoryToDrive(history, user);
        expect(saveHistoryToDrive).toThrowError('user.google');
        expect(saveHistoryToDrive).toThrowError(exceptions.ArgumentException);
    });

    it('creates drive client passing authclient', async()=>{
        //Arrange
        const driveService = new DriveService();
        const history = {};
        const user = {email:'email',google:{token:'12345'}};
        mockFind.mockImplementation(()=>Promise.resolve([]));
        mockCreate.mockImplementation(() => Promise.resolve({}));
        const saveHistoryToDrive = () => driveService.saveHistoryToDrive(history, user);
    
        //Act 
        await saveHistoryToDrive();

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
        const history = {x:'1'};
        const user = {email:'email',google:{token:'12345'}};

        // Act
        const result = await driveService.saveHistoryToDrive(history, user);

        //Assert
        expect(mockFind).toHaveBeenCalledWith(constants.HISTORY_FILE_NAME);
        expect(mockCreate).toHaveBeenCalledWith(constants.HISTORY_FILE_NAME, JSON.stringify(history));
        expect(result).toBe(expectedResult);
    });

    it('when find returns one existing file then it updates the file', async()=>{
        // Arrange
        const expectedResult = {id:'12345'};
        mockFind.mockImplementation(()=>Promise.resolve([expectedResult]));
        mockUpdate.mockImplementation(() => Promise.resolve(expectedResult));
        const driveService = new DriveService();        
        const history = {x:'1'};
        const user = {email:'email',google:{token:'12345'}};

        // Act
        const result = await driveService.saveHistoryToDrive(history, user);

        //Assert
        expect(mockFind).toHaveBeenCalledWith(constants.HISTORY_FILE_NAME);
        expect(mockUpdate).toHaveBeenCalledWith(expectedResult.id, JSON.stringify(history));
        expect(result).toBe(expectedResult);
    });

    it('when find returns multiple existing file then rejected promise is returned', async()=>{
        // Arrange
        mockFind.mockImplementation(()=> Promise.resolve([{id:'1'},{id:'2'}]));
        const driveService = new DriveService();        
        const history = {x:'1'};
        const user = {email:'email',google:{token:'12345'}};

        //Act, Assert
        await expect(driveService.saveHistoryToDrive(history, user)).rejects.toEqual('found multiple ' + constants.HISTORY_FILE_NAME);
    });
})

describe('loadhistoryfromdrive', () => {
    it('throws exception when user is not passed', ()=>{
        // Arrange
        const driveService = new DriveService();
        const user = undefined;

        // Act
        const loadHistoryFromDrive = () => driveService.loadHistoryFromDrive(user);

        // Assert
        expect(loadHistoryFromDrive).toThrowError('user');
        expect(loadHistoryFromDrive).toThrowError(exceptions.ArgumentNullException);
    });

    it('throws exception when user.email is not set', ()=>{
        // Arrange
        const driveService = new DriveService();
        const user = {};

        // Act
        const loadHistoryFromDrive = () => driveService.loadHistoryFromDrive(user);

        // Assert
        expect(loadHistoryFromDrive).toThrowError('user.email');
        expect(loadHistoryFromDrive).toThrowError(exceptions.ArgumentException);
    });

    it('throws exception when user.google is not set', ()=>{
        // Arrange
        const driveService = new DriveService();
        const user = {email:'email'};

        // Act
        const loadHistoryFromDrive = () => driveService.loadHistoryFromDrive(user);

        // Assert
        expect(loadHistoryFromDrive).toThrowError('user.google');
        expect(loadHistoryFromDrive).toThrowError(exceptions.ArgumentException);
    });

    it('creates drive client passing authclient', async()=>{
        //Arrange
        const driveService = new DriveService();
        const user = {email:'email',google:{token:'12345'}};
        mockFind.mockImplementation(()=>Promise.resolve([]));
        const loadHistoryFromDrive = () => driveService.loadHistoryFromDrive(user);
    
        //Act 
        await loadHistoryFromDrive();

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
        const result = await driveService.loadHistoryFromDrive(user);

        //Assert
        expect(mockFind).toHaveBeenCalledWith(constants.HISTORY_FILE_NAME);
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
        const result = await driveService.loadHistoryFromDrive(user);

        //Assert
        expect(mockFind).toHaveBeenCalledWith(constants.HISTORY_FILE_NAME);
        expect(mockGet).toHaveBeenCalledWith(findResult.id);
        expect(result).toBe(getResult);
    });

    it('when find returns multiple existing files then rejected promise is returned', async()=>{
        // Arrange
        mockFind.mockImplementation(()=> Promise.resolve([{id:'1'},{id:'2'}]));
        const driveService = new DriveService();        
        const user = {email:'email',google:{token:'12345'}};

        //Act, Assert
        await expect(driveService.loadHistoryFromDrive(user)).rejects.toEqual('found multiple ' + constants.HISTORY_FILE_NAME);
    });
})