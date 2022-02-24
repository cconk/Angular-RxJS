import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { Product } from './product';
import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessageSubject = new Subject<string>();
  errorMessage = this.errorMessageSubject.asObservable();

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction = this.categorySelectedSubject.asObservable();

  products = combineLatest([
    this.productService.productsWithAdd,
    this.categorySelectedAction
    ])
    .pipe(
      map(([products, selectedCategoryId]) => 
      products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId: true 
        )),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
  
  
  categories = this.productCategoryService.productCategories
      .pipe(
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
        })
      )

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  // ngOnInit(): void {
  //   this.products = this.productService.getProducts()
      
  //   // this.sub = this.productService.getProducts()
  //   //   .subscribe(
  //   //     products => this.products = products,
  //   //     error => this.errorMessage = error
  //   //   );
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    this.productService.addProduct();
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}