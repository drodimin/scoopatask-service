const Bucket = require('./bucket');
const exceptions = require('../exceptions');

const taskId = 'XYZ1';
const name1 = 'ABC';
const name2 = 'DEF';
const task1 = {_id:taskId, name:name2, isComplete:true};

function getBucket(){
  return  new Bucket({_tasks: [ {_id:taskId, name:name1}]});
}

describe('deleteTask', () => {
    it('throws exception when task not found', () => {
      const bucket1 =  getBucket();
      expect(() => bucket1.completeTask('someid')).toThrow(exceptions.InvalidIdExceptions);
    });

    it('deletes task given id', () => {      
      const bucket1 =  getBucket();
      bucket1.deleteTask(taskId);
      expect(bucket1._tasks).toHaveLength(0);
    });
  });

  describe('completeTask', () => {
    it('updates task properties', () => {
      const bucket1 =  getBucket();
      bucket1.updateTask(taskId, task1);
  
      expect(bucket1._tasks[0].name).toEqual(name2);
      expect(bucket1._tasks[0].isComplete).toEqual(true);
    });
  });

  describe('completeTask', () => {
    it('throws exception when task not found', () => {
      const bucket1 =  getBucket();
      expect(() => bucket1.completeTask('someid')).toThrow(exceptions.InvalidIdExceptions);
    });

    it('removes task with give taskId from bucket and returns it', () => {
      const bucket1 =  getBucket();
      const task = bucket1._tasks.find(t => t._id === taskId);
      const result = bucket1.completeTask(task._id);
  
      expect(bucket1._tasks).not.toContain(task);
      expect(result).toEqual(task);
    });
  })