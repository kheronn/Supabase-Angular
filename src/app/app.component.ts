import { Todo } from './todo.model';
import { ApiService } from './api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  todos: Todo[];
  todo: Todo;
  actionLabel: string = "ADD"
  constructor(private api: ApiService) {

  }
  async ngOnInit(): Promise<void> {
    let listen = this.api.listenAll();
    this.api.getTodos()
      .then(todos => this.todos = todos)
    this.todo = new Todo();
  }

  addTodo() {
    if (this.todo.id) { //Update if exists ID{
      this.update(this.todo);
      return;
    }
    this.api.addTodo(this.todo).then((payload) => {
      this.todos.push(payload.data[0]);
    }).catch(erro => console.log(`Error in add TODO ${erro}`))
    this.clear();
  }

  delete(todo: Todo) {
    this.api.deleteTodo(todo.id)
      .then(dados => {
        console.log(dados)
        this.todos = this.arrayRemove(this.todos, todo.id);
      })
  }

  seleciona(todo: Todo) {
    this.todo = todo;
    this.actionLabel = "UPDATE";
  }

  check(todoCheck: Todo) {
    let todo = todoCheck;
    todo.done = !todoCheck.done;
    this.update(todo);
  }


  update(todo: Todo) {
    this.api.update(todo)
      .then(dados => {
        let foundIndex = this.todos.findIndex(t => t.id == todo.id);
        this.todos[foundIndex] = todo;
        this.todo = new Todo();
        this.clear();
      })
  }

  arrayRemove(arr, value) {
    return arr.filter((ele) => {
      return ele.id != value;
    });
  }

  clear() {
    this.todo = new Todo();
    this.actionLabel = "ADD";
  }

}
