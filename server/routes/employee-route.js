/**
 * Title: employee-route.js
 * Author: Professor Richard Krasso and Brock Hemsouvanh
 * Date: 6/3/24
 * Updated: 6/17/24 by Brock Hemsouvanh
 * Description: Route for handling employee API requests
 */

"use strict";

const express = require("express");
const { mongo } = require("../utils/mongo");
const createError = require("http-errors");
const Ajv = require('ajv');
const { ObjectId } = require('mongodb');
const ajv = new Ajv(); // create a new instance of the Ajv object from the npm package

const router = express.Router();

/**
 * @swagger
 * /api/employees/{empId}:
 *   get:
 *     summary: Get an employee by ID
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
// Route to get an employee by ID
router.get("/:empId", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // EARLY RETURN - DESIGN PATTERN
    if (isNaN(empId)) {
      return next(createError(400, "Input must be a number"));
    }

    // Database query is handled
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      if (!employee) {
        console.log('empId', empId);
        return next(createError(404, "Employee not found"));
      }

      res.send(employee);
    }, next);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/employees/{empId}/tasks:
 *   get:
 *     summary: Get all tasks for an employee
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: A list of tasks
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
/**
 * findAllTasks API
 * @returns JSON array of all tasks
 * @throws { 500 error } - if server error
 * @throws { 400 error } - if employee id is not a number
 * @throws { 404 error } - if no tasks are found
 */
router.get('/:empId/tasks', (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // determines if the returned value from parseInt is NaN
    if (isNaN(empId)) {
      return next(createError(400, 'Employee ID must be a number'));
    }

    mongo(async db => {
      const tasks = await db.collection('employees').findOne(
        { empId: empId },
        { projection: { empId: 1, todo: 1, done: 1 } }
      );

      // If there aren't tasks found for the employee ID, return a 404 error object to middleware handler
      if (!tasks) {
        return next(createError(404, `Tasks not found for employee ID ${empId}`));
      }

      res.send(tasks);
    }, next);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/employees/{empId}/tasks:
 *   post:
 *     summary: Create a new task for an employee
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *             required:
 *               - text
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
/**
 * Create Task API
 */
const taskSchema = {
  type: 'object',
  properties: {
    text: { type: 'string' }
  },
  required: ['text'],
  additionalProperties: false
};

router.post('/:empId/tasks', (req, res, next) => {
  try {
    // check if the empId from the req params is a number
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // Check to see if parseInt function returns a number or not. If NaN, returns this 400 message.
    if (isNaN(empId)) {
      return next(createError(400, 'Employee ID must be a number'));
    }

    mongo(async db => {
      const employee = await db.collection('employees').findOne({ empId: empId });

      // to see if the query to mongodb is returning the employee object.
      console.log('employee not found validation code');

      // if the employee is not found, return a 404 error
      if (!employee) {
        return next(createError(404, `Employee not found with empID ${empId}`));
      }

      const validator = ajv.compile(taskSchema);
      const valid = validator(req.body);

      // if the payload is not valid, return a 400 error and append the errors to the err.errors property.
      if (!valid) {
        return next(createError(400, 'Invalid task payload', validator.errors));
      }

      // create the object literal to add to the employee collection
      const newTask = {
        _id: new ObjectId(),
        text: req.body.text
      };

      // call the mongo module and update the employee collection with the new task in the todo column
      const result = await db.collection('employees').updateOne(
        { empId: empId },
        { $push: { todo: newTask } }
      );

      // check to see if the modified count is updated; if so, then the task was added to the employee field.
      if (!result.modifiedCount) {
        return next(createError(400, 'Unable to create task'));
      }

      res.status(201).send({ id: newTask._id });
    }, next);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/employees/{empId}/tasks:
 *   put:
 *     summary: Update tasks for an employee
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     text:
 *                       type: string
 *                   required:
 *                     - _id
 *                     - text
 *               done:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     text:
 *                       type: string
 *                   required:
 *                     - _id
 *                     - text
 *     responses:
 *       204:
 *         description: Tasks updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
/**
 * Update Task API
 */
const tasksSchema = {
  type: 'object',
  required: ['todo', 'done'],
  additionalProperties: false,
  properties: {
    todo: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          text: { type: 'string' }
        },
        required: ['_id', 'text'],
        additionalProperties: false
      }
    },
    done: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          text: { type: 'string' }
        },
        required: ['_id', 'text'],
        additionalProperties: false
      }
    }
  }
};

router.put('/:empId/tasks', (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    if (isNaN(empId)) {
      return next(createError(400, 'Employee ID must be a number'));
    }

    mongo(async db => {
      const employee = await db.collection('employees').findOne({ empId: empId });

      if (!employee) {
        console.log('empId', empId);
        return next(createError(404, `Employee not found with empId ${empId}`));
      }

      const tasks = req.body;
      const validator = ajv.compile(tasksSchema);
      const valid = validator(req.body);

      if (!valid) {
        return next(createError(400, 'Invalid task payload', validator.errors));
      }

      const result = await db.collection('employees').updateOne(
        { empId: empId },
        { $set: { todo: tasks.todo, done: tasks.done } }
      );

      if (!result.modifiedCount) {
        return next(createError(400, 'Unable to update tasks'));
      }

      res.status(204).send();
    }, next);
  } catch (err) {
    console.error('err', err);
    next(err);
  }
});

/**
 * @swagger
 * /api/employees/{empId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task for an employee
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
/**
 * Delete Task API
 */
router.delete('/:empId/tasks/:taskId', (req, res, next) => {
  // to catch mongoDB request errors
  try {

    let { empId, taskId } = req.params;

    empId = parseInt(empId, 10);

    if (isNaN(empId)) {
      return next(createError(400, 'Employee ID must be a number'));
    }

    mongo(async db => {
      const emp = await db.collection('employees').findOne({ empId: empId });

      if (!emp) {
        return next(createError(404, `Employee not found with empId ${empId}`));
      }

      if (!emp.todo) emp.todo = [];
      if (!emp.done) emp.done = [];

      const todo = emp.todo.filter(t => t._id.toString() !== taskId.toString());
      const done = emp.done.filter(t => t._id.toString() !== taskId.toString());

      const result = await db.collection('employees').updateOne(
        { empId: empId },
        { $set: { todo: todo, done: done }}
      );

      if (!result.modifiedCount) {
        return next(createError(400, 'Unable to delete task'));
      }

      res.status(204).send();
    }, next);

  } catch (err) {
    console.error('err', err);
    next(err);
  }
});

module.exports = router;  // end module.exports = router
