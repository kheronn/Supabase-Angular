import { Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
  }

  async addTodo(_todo: Todo) {
    const { data: todo, error } = await this.supabase
      .from<Todo>('todos')
      .insert(_todo)
      .single()
    return { todo, error };
  }

  async getTodos() {
    const { data: todos, error } = await this.supabase
      .from<Todo>('todos')
      .select('*')
      .limit(10)
    return { todos, error };
  }

  async deleteTodo(id: string) {
    return this.supabase
      .from('todos')
      .delete()
      .eq('id', id)

  }

  async update(todo: Todo) {
    const { data: todos, error } = await this.supabase
      .from('todos')
      .update(todo)
      .match({ id: todo.id })
    return { todos, error };
  }

  async updatCheck(todo: Todo) {
    const { data, error } = await this.supabase
      .from('todos')
      .update({ done: todo.done })
      .match({ id: todo.id })

    return { data, error };
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
