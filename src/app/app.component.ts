import {Component, OnInit} from '@angular/core';
import { Task } from './model/Task';
import {DataHandlerService} from './services/data-handler.service';
import {Category} from './model/Category';
import {Priority} from './model/Priority';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  selectedCategory: Category = null;
  tasks: Task[];
  categories: Category[];
  priorities: Priority[];

  searchTaskText: string;
  searchCategoryText = '';
  statusFilter: boolean;
  priorityFilter: Priority;

  constructor(private dataHandlerService: DataHandlerService) {
  }

  ngOnInit(): void {
    this.dataHandlerService.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandlerService.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandlerService.getAllPriorities().subscribe(priorities => this.priorities = priorities);
  }

  onSelectCategory(category: Category) {
    this.selectedCategory = category;

    this.updateTasks();
  }

  onUpdateTask(task: Task) {
    this.dataHandlerService.updateTask(task).subscribe(() => {
      this.dataHandlerService.searchTasks(
        this.selectedCategory,
        null,
        null,
        null
      ).subscribe((tasks: Task[]) => {
        this.tasks = tasks;
      });
    });
  }

  onDeleteTask(task: Task) {
    this.dataHandlerService.deleteTask(task.id).subscribe(() => {
      this.dataHandlerService.searchTasks(
        this.selectedCategory,
        null,
        null,
        null
      ).subscribe((tasks: Task[]) => {
        this.tasks = tasks;
      });
    });
  }

  onUpdateCategory(category: Category) {
    this.dataHandlerService.updateCategory(category).subscribe(cat => {
      this.selectedCategory = null;
      this.onSelectCategory(this.selectedCategory);
    });
  }

  onDeleteCategory(category: Category) {
    this.dataHandlerService.deleteCategory(category.id).subscribe(() => {
      this.onSearchCategory(this.searchCategoryText);
    });

  }

  onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasks();
  }

  onSearchTasks(searchString: string) {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    this.updateTasks();
  }

  private  updateTasks() {
    this.dataHandlerService.searchTasks(
      this.selectedCategory,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
    ).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  onAddTask(task: Task) {
    this.dataHandlerService.addTask(task).subscribe(result => {
      this.updateTasks();
    });
  }

  onAddCategory(title: string) {
    this.dataHandlerService.addCategory(title).subscribe(() => this.updateCategories());
  }

  private updateCategories() {
      this.dataHandlerService.getAllCategories().subscribe(categories => this.categories = categories);
  }

  onSearchCategory(title: string) {
    this.searchCategoryText = title;

    this.dataHandlerService.searchCategories(title).subscribe(categories => {
      this.categories = categories;
    });

  }
}
