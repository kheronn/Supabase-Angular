import { Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  supabaseUrl = "your-url";
  supabaseKey = "your-key-access";
  supabase: SupabaseClient;
  

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async addTodo(todo: Todo) {
    const { data, error } = await this.supabase
      .from<Todo>('todos')
      .insert(todo)
    return { data, error };
  }

  async getTodos() {
    let { data: todos, error } = await this.supabase
      .from<Todo>('todos')
      .select('*')
      .limit(10)
    return { todos, error };
  }

  async deleteTodo(id: string) {
    const data = await this.supabase
      .from('todos')
      .delete()
      .match({ id: id })
    return data
  }

  async update(todo: Todo) {
    const { data, error } = await this.supabase
      .from('todos')
      .update(todo)
      .match({ id: todo.id })
  }

  async updatCheck(todo: Todo) {
    const { data, error } = await this.supabase
      .from('todos')
      .update({ done: todo.done })
      .match({ id: todo.id })
  }

  listenAll() {
    const mySubscription = this.supabase
      .from('todos')
      .on('*', payload => {
        console.log('Change received!', payload)
      })
      .subscribe()
    return mySubscription;
  }

}
