import { Todo } from './todo.model';
import { ApiService } from './api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  todos: Todo[];
  todo: Todo;
  actionLabel: string;

  constructor(private api: ApiService) { }

  async ngOnInit(): Promise<void> {
    this.clear();
    let { todos, error } = await this.api.getTodos()
    if (!error) {
      this.todos = todos ?? [];
    }
  }

  async addTodo() {
    if (this.todo.id) {
      //Update if exists ID{
      this.update();
      return;
    }
    let { todo, error } = await this.api.addTodo(this.todo)
    if (error) {
      console.log(`Error in add TODO ${error.message}`)
    }
    else {
      console.log(todo)
      this.todos = [todo, ...this.todos]
    }
    this.clear();
  }

  seleciona(todo: Todo) {
    this.todo = todo;
    this.actionLabel = 'UPDATE';
  }

  async update() {
    let { error } = await this.api.update(this.todo)
    if (!error) {
      let foundIndex = this.todos.findIndex((t) => t.id == this.todo.id);
      this.todos[foundIndex] = this.todo;
      this.clear();
    }
  }

  check(todoCheck: Todo) {
    this.todo = todoCheck;
    this.todo.done = !todoCheck.done;
    this.update();
  }

  async delete(todo: Todo) {
    await this.api.deleteTodo(todo.id)
    this.todos = this.arrayRemove(this.todos, todo.id)
  }

  arrayRemove(arr: Todo[], id: string) {
    return arr.filter((ele) => ele.id != id);
  }

  clear() {
    this.todo = new Todo();
    this.actionLabel = 'ADD';
  }
}
