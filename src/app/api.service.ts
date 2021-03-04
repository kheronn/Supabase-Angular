import { Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  supabaseUrl = "https://eryktzqdtxyesygmuxeg.supabase.co";
  supabaseKey =   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNDU1Mjg4MywiZXhwIjoxOTMwMTI4ODgzfQ.tr25Nyviyvj3vcmZMPbBqRCnt6XcOc4Ui6the_WWh9s";
 
  supabase: any;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async getTodos() {
    let { data: projetos, error } = await this.supabase
      .from('projetos')
      .select('*')

    return projetos;

  }

  async addTodo(todo: Todo) {
    const { data, error } = await this.supabase
      .from('projetos')
      .insert(todo)

    return { data, error };
  }

  async deleteTodo(id: string) {
    const { data, error } = await this.supabase
      .from('projetos')
      .delete()
      .match({ id: id })
  }

  async update(todo: Todo) {
    const { data, error } = await this.supabase
      .from('projetos')
      .update(todo)
      .match({ id: todo.id })
  }

  async updatCheck(todo: Todo) {
    const { data, error } = await this.supabase
      .from('projetos')
      .update({ done: todo.done })
      .match({ id: todo.id })
  }


  listenAll() {
    const mySubscription = this.supabase
      .from('projetos')
      .on('*', payload => {
        console.log('Change received!', payload)
      })
      .subscribe()
    return mySubscription;
  }

}
