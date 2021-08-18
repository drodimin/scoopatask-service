
const exceptions = require('../exceptions');
const utils = require('../utils');

module.exports = class Bucket {
    constructor(obj) {
      this._id = utils.generateId();
      this.created = Date.now;
      this.updated = Date.now;
      this._tasks = [];
      obj && Object.assign(this, obj);
    }
  
    add(task) {
      task._id = utils.generateId();
      task.created = Date.now;
      task.updated = Date.now;
      this._tasks.push(task);
    }
  
    deleteTask(taskId) {
      const task = this._tasks.find(task => task._id === taskId);
      if(!task) {
        throw new exceptions.InvalidIdException(`Task with id ${taskId} doesn't exist`);
      }
      this._tasks = this._tasks.filter(task => task._id !== taskId);
      return task;
    }
  
    updateTask(taskId, updatedTask) {
      const task = this._tasks.find(task => task._id === taskId);
      if(!task) {
        throw new exceptions.InvalidIdException(`Task with id ${taskId} doesn't exist`);
      }
      const updateProperties = ['name', 'isComplete'];
  
      updateProperties.forEach(prop => {
        task[prop] = updatedTask[prop];
        });
      return task;
    }

    completeTask(taskId, updatedTask) {
        const task = this._tasks.find(task => task._id === taskId);
        if(!task) {
          throw new exceptions.InvalidIdException(`Task with id ${taskId} doesn't exist`);
        }
        this._tasks = this._tasks.filter(t => t._id !== taskId);
        return task;
      }
  }