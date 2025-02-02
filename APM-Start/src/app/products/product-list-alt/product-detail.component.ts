import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  // pageTitle = 'Product Detail';
  errorMessageSubject = new Subject<string>();
  errorMessage = this.errorMessageSubject.asObservable();
  
  product = this.productService.selectedProduct
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );
  
  pageTitle = this.product
  .pipe(
    map((p: Product) =>
      p ? `Product Detail for: ${p.productName}` : null)
  );

  // Suppliers for this product
  productSuppliers = this.productService.selectedProductSuppliers2
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );
    vm = combineLatest([
      this.product,
      this.productSuppliers,
      this.pageTitle
    ])
      .pipe(
        filter(([product]) => Boolean(product)),
        map(([product, productSuppliers, pageTitle]) =>
          ({ product, productSuppliers, pageTitle }))
      );

  constructor(private productService: ProductService) { }

}
