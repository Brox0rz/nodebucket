/**
 * Title: tasks.component.ts
 * Author: Professor Richard Krasso and Brock Hemsouvanh
 * Date: 6/12/24
 * Updated: 6/22/2024 by Brock Hemsouvanh
 * Description: Tasks component for managing to-do and done tasks for employees in Nodebucket application
 */


import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

// Interface for a task item
export interface Item {
  _id: string;
  text: string;
}

// Interface for an employee with task lists
export interface Employee {
  empId: number;
  todo: Item[];
  done: Item[];
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // Local variables
  empId: number;
  employee: Employee;
  todo: Item[];
  done: Item[];

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];
  }

  ngOnInit() {
    // Fetch the tasks for the logged-in employee
    this.http.get(`/api/employees/${this.empId}/tasks`).subscribe({
      next: (emp: any) => {
        this.employee = emp;
        this.todo = this.employee.todo || [];
        this.done = this.employee.done || [];
      },
      error: () => {
        console.error('Unable to get employee data for employee ID: ', this.empId);
      }
    });
  }

  // Function to create a new task
  createTask(form: NgForm) {
    if (form.valid) {
      const todoTask = form.value.task;

      this.http.post(`/api/employees/${this.empId}/tasks`, {
        text: todoTask
      }).subscribe({
        next: (result: any) => {
          const newTodoItem = {
            _id: result.id,
            text: todoTask
          };
          this.todo.push(newTodoItem);
        },
        error: (err) => {
          console.error('Unable to create task for employee: ' + this.empId, err);
        }
      });
    }
  }

  // Function to delete a task
  deleteTask(taskId: string) {
    console.log('Task item:', taskId);

    // Confirm dialog before deleting
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.http.delete(`/api/employees/${this.empId}/tasks/${taskId}`).subscribe({
      next: () => {
        console.log('Task deleted with id', taskId);

        // Set todo and done arrays to empty if they are null
        if (!this.todo) this.todo = [];
        if (!this.done) this.done = [];

        // Filter the task arrays and remove the deleted task
        this.todo = this.todo.filter(t => t._id.toString() !== taskId);
        this.done = this.done.filter(t => t._id.toString() !== taskId);

        // Set the success message
        this.successMessage = 'Task deleted successfully!';
        this.hideAlert();
      },
      error: (err) => {
        console.log('error', err);
        this.errorMessage = err.message;
        this.hideAlert();
      }
    });
  }

  // Function to handle drag and drop events
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log('Moved item in array', event.container.data);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log('Moved item in array', event.container.data);
    }
    this.updateTaskLists(this.empId, this.todo, this.done);
  }

  // Function to update the task lists in the database
  updateTaskLists(empId: number, todo: Item[], done: Item[]) {
    const payload = { todo, done };
    console.log('Updating tasks with payload:', payload); // Log the payload

    this.http.put(`/api/employees/${empId}/tasks`, payload).subscribe({
      next: (res: any) => {
        console.log('Tasks updated successfully');
        this.hideAlert();
      },
      error: (err) => {
        console.log('error', err); // Log the error to the console
        this.errorMessage = err.message; // Set the error message
        this.hideAlert();
      }
    });
  }

  // Function to hide alert messages after a certain period
  hideAlert() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  // Local variables to store success and error messages
  successMessage: string = '';
  errorMessage: string = '';
}
