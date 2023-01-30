import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from 'src/app/models/product.models';
import { Suppliers } from 'src/app/models/suppliers.models';
import { SuppliersService } from 'src/app/Services/suppliers.service';

@Component({
  selector: 'app-delivery-view',
  templateUrl: './delivery-view.component.html',
  styleUrls: ['./delivery-view.component.scss'],
})
export class DeliveryViewComponent implements OnInit {
  Suppliers?: Suppliers[];
  Products?: Product[];
  ProductsLoaded: Boolean = true;
  SelectedSupplierID!: string;
  SelectedProductID!: string;
  constructor(
    private _supplierService: SuppliersService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // get params from the url
    this._activatedRouter.params.subscribe((params: Params) => {
      // get all the products from the supplier id in the url
      this._supplierService
        .getProducts(params['supplierId'])
        .subscribe((products: Product[]) => {
          // set products list to the retrieved products
          this.Products = products;

          // set variables
          if (this.Products.length == 0) {
            this.ProductsLoaded = false;
          } else {
            this.ProductsLoaded = true;
          }

          // selected supplier id is equal to the supplier id in the url
          this.SelectedSupplierID = params['supplierId'];
        });
    });

    // get all the suppliers and assign them to the supplier list variable.
    this._supplierService.getSuppliers().subscribe((suppliers: any) => {
      this.Suppliers = suppliers;
    });
  }

  onAddedToBasket(product: Product) {
    // We want to set the product to added to basket
    this._supplierService.addedToBasket(product).subscribe(() => {
      // The product has been added successfully
      product.addedToBasket = !product.addedToBasket;
    });
  }

  DeleteItem(product: Product) {
    // we want to send the product to be deleted to the webservice
    this._supplierService.deleteProduct(product).subscribe((res) => {
      console.log(res);
    });
    window.location.reload();
  }

  async DeleteSupplier() {
    this._supplierService
      .deleteSupplier(this.SelectedSupplierID)
      .subscribe((res: any) => {
        console.log(res);
      });

    this._supplierService
      .deleteAllProducts(this.SelectedSupplierID)
      .subscribe((res: any) => {
        console.log(res);
      });

    this._supplierService.getSuppliers().subscribe((suppliers) => {
      window.location.replace('/suppliers');
    });
  }

  EditProduct(product: Product) {
    this.SelectedProductID = product._id;

    this._router.navigate([
      `/suppliers/${this.SelectedSupplierID}/products/${this.SelectedProductID}/edit-product`,
    ]);
  }

  editSupplier(supplier: Suppliers) {
    this._router.navigate([
      `/suppliers/${this.SelectedSupplierID}/edit-supplier`,
    ]);
  }
}
