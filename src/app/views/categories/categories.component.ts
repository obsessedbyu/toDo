import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandlerService} from '../../services/data-handler.service';
import {Category} from '../../model/Category';
import {MatDialog} from '@angular/material/dialog';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {OperType} from '../../dialog/OperType';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @Input() categories: Category[];
  @Input() selectedCategory: Category;

  @Output() selectCategory = new EventEmitter<Category>();
  @Output() updateCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<Category>();
  @Output() addCategory = new EventEmitter<string>();
  @Output() searchCategory = new EventEmitter<string>();
  indexMouseMove: number;
  searchCategoryTitle = '';


  constructor(
    private dataHandlerService: DataHandlerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // this.dataHandlerService.getAllCategories().subscribe(categories => this.categories = categories);
  }

  showTasksByCategory(category: Category) {
    // this.selectedCategory = category;
    // this.dataHandlerService.fillTasksByCategory(category);
    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category;

    this.selectCategory.emit(this.selectedCategory);
  }

  showEditIcon(index: number) {
    this.indexMouseMove = index;
  }

  openEditDialog(category: Category) {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [category.title, 'Edit category', OperType.EDIT],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteCategory.emit(category);

        return;
      }

      if ( typeof result === 'string') {
        category.title = result as string;

        this.updateCategory.emit(category);
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {data: ['', 'Add category', OperType.ADD], width: '400px'});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCategory.emit(result as string);
      }
    });
  }

  search() {
    this.searchCategory.emit(this.searchCategoryTitle);
  }
}
