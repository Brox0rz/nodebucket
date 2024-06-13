/**
 * Title: app.js
 * Author: Professor Krasso
 * Date: 8/5/2023
 * Updated: 6/12/2024 by Brock Hemsouvanh
 */
'use strict'

// Require statements
const express = require('express')
const createServer = require('http-errors')
const path = require('path')
const employeeRoute = require("./routes/employee-route")
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Create the Express app
const app = express()

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nodebucket API',
      version: '1.0.0',
      description: 'API documentation for Nodebucket application',
    },
  },
  apis: ['./server/routes/*.js'], // Points to the API routes for documentation
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configure the app
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../dist/nodebucket')))
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')))
app.use("/api/employees", employeeRoute); // Has to be before the middleware handlers

// Error handler for 404 errors
app.use(function(req, res, next) {
  next(createServer(404)) // Forward to error handler
})

// Error handler for all other errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500) // Set response status code

  // Send response to client in JSON format with a message and stack trace
  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  })
})

module.exports = app // Export the Express application
