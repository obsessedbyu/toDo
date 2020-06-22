import {TaskDAO} from '../interface/TaskDAO';
import {Observable, of} from 'rxjs';
import { Task } from 'src/app/model/Task';
import {Category} from '../../../model/Category';
import {Priority} from '../../../model/Priority';
import {TestData} from '../../TestData';

export class TaskDAOArray implements TaskDAO{
  add(task): Observable<Task> {
    if (task.id === null || task.id === 0) {
      task.id = this.getLastIdTask();
    }
    TestData.tasks.push(task);
    return of(task);
  }

  delete(id: number): Observable<Task> {
    const taskTemp = TestData.tasks.find(t => t.id === id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTemp), 1);

    return of(taskTemp);
  }

  get(id: number): Observable<Task> {
    return undefined;
  }

  getAll(): Observable<Task[]> {
    return of(TestData.tasks);
  }

  getCompletedCountInCategory(category: Category): Observable<number> {
    return undefined;
  }

  getTotalCount(): Observable<number> {
    return undefined;
  }

  getTotalCountInCategory(category: Category): Observable<number> {
    return undefined;
  }

  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return of(this.searchTodos(category, searchText, status, priority));
  }

  update(task: Task): Observable<Task> {
    const taskTemp = TestData.tasks.find(t => t.id === task.id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTemp), 1, task);

    return of(task);
  }

  private searchTodos(category: Category, searchText: string, status: boolean, priority: Priority): Task[] {

    let allTasks = TestData.tasks;

    if (status != null) {
      allTasks = allTasks.filter(todo => todo.completed === status);
    }

    if (category) {
      allTasks = allTasks.filter(todo => todo.category === category);
    }

    if (priority) {
      allTasks = allTasks.filter(todo => todo.priority === priority);
    }

    if (searchText) {
      allTasks = allTasks.filter(todo => todo.title.toLowerCase().includes(searchText.toLowerCase()));
    }
    return allTasks;
  }

  getLastIdTask(): number {
    return Math.max.apply(Math, TestData.tasks.map(task => task.id)) + 1;
  }
}
