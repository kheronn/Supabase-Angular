import { Todo } from './todo.model';
import { ApiService } from './api.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
    let ouvir = this.api.ouvirTodos();
    console.log(ouvir)
    this.api.getTodos()
      .then(todos => this.todos = todos)
    this.todo = new Todo();
  }

  addTodo() {
    if (this.todo.id) { //Atualiza{
      this.update(this.todo);
      return;
    }
    this.api.addTodo(this.todo).then((payload) => {
      console.log(payload.data)
      this.todos.push(payload.data[0]);
      console.log(payload.error)
    }).catch(erro => console.log(`Erro ao adicionar TODO ${erro}`))
    this.todo = new Todo();
    this.actionLabel = "ADD";
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

  update(todo: Todo) {
    this.api.update(todo)
      .then(dados => {
        console.log(dados)
        var foundIndex = this.todos.findIndex(t => t.id == todo.id);
        this.todos[foundIndex] = todo;
        this.todo = new Todo();
        this.actionLabel = "ADD";
      })
  }


  arrayRemove(arr, value) {
    return arr.filter((ele) => {
      return ele.id != value;
    });
  }


}
