import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataHandlerService} from '../../services/data-handler.service';
import { Task } from 'src/app/model/Task';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Priority';
import {OperType} from '../../dialog/OperType';

// @ts-ignore
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  dataSource: MatTableDataSource<Task>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  tasks: Task[];
  priorities: Priority[];

  @Input('tasks') set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
    console.log(tasks);
  }

  @Input('priorities') set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
  }

  @Input() selectedCategory: Category = null;

  @Output() updateTask = new EventEmitter<Task>();
  @Output() addTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() selectCategory = new EventEmitter<Category>();
  @Output() filterByTitle = new EventEmitter<string>();
  @Output() filterByStatus = new EventEmitter<boolean>();
  @Output() filterByPriority = new EventEmitter<Priority>();

  searchTaskText: string;
  selectedStatusFilter: boolean = null;
  selectedPriorityFilter: Priority;

  constructor(
    private dataHandler: DataHandlerService,
    private dialog: MatDialog
  ){}

  ngAfterViewInit(): void {
        this.addTableObjects();
    }

  ngOnInit(): void {
    console.log('oninit');
    // this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);

    this.dataSource = new MatTableDataSource();
    // this.fillTable();
    this.onSelectCategory(this.selectedCategory);
    setTimeout(() => {
      // this.onSelectCategory(null);
      // this.tasks = [];
      this.fillTable();
    }, 0);
  }

  toggleTaskCompleted(task: Task) {
    task.completed = !task.completed;
  }

  getPriorityColor(task: Task): string {
    if (task.completed) {
      return '#F8F9FA';
    }

    if (task.priority && task.priority.color) {
      return task.priority.color;
    }
    return '#fff';
  }

  private fillTable() {
    if (!this.dataSource){
      return;
    }

    this.dataSource.data = this.tasks;
    this.addTableObjects();
    this.dataSource.sortingDataAccessor = (task, colName) => {
      switch (colName) {
        case 'priority': {
          return task.priority ? task.priority.id : null;
        }

        case 'category': {
          return task.category ? task.category.title : null;
        }

        case 'date': {
          return task.date ? task.date.getTime() : null;
        }

        case 'title': {
          return task.title;
        }
      }
    };
  }

  addTableObjects(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openEditTaskDialog(task: Task): void {
    // this.updateTask.emit(task);

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Edit task', OperType.EDIT], autoFocus: false});

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'complete') {
        task.completed = true;
        this.updateTask.emit(task);
        return;
      }

      if (result === 'activate') {
        task.completed = false;
        this.updateTask.emit(task);
        return;
      }

      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      }

      if (result as Task) {
        this.updateTask.emit(task);
        return;
      }
    });



  }

  openAddTaskDialog() {
    const task = new Task(null, '', false, null, this.selectedCategory);

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Add task', OperType.ADD]});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTask.emit(task);
      }
    });
  }

  openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Confirm action',
        message: `Are You sure You want to remove task: ${task.title}?`
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask.emit(task);
      }
    });
  }

  onToggleStatus(task: Task) {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }

  onSelectCategory(category: Category) {
    this.selectCategory.emit(category);
  }

  onFilterByTitle(): void {
    this.filterByTitle.emit(this.searchTaskText);
  }

  onFilterByStatus(value: boolean): void {
    if (value !== this.selectedStatusFilter) {
      this.selectedStatusFilter = value;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }
  }

  onFilterByPriority(value: Priority) {
    if (value !== this.selectedPriorityFilter) {
      this.selectedPriorityFilter = value;
      this.filterByPriority.emit(this.selectedPriorityFilter);
    }
  }

}
