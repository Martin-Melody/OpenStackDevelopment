import { Injectable } from '@angular/core';
import { Product } from '../models/product.models';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  constructor(private _webReqService: WebRequestService) {}

  supplierId!: string;
  id!: string;

  createSupplier(SupplierName: string) {
    // we want to send a web request to crate a list
    return this._webReqService.post('suppliers', { SupplierName });
  }

  UpdateSupplier(id: string, SupplierName: string) {
    // we want to send a web request to update a list
    return this._webReqService.patch(`suppliers/${id}`, { SupplierName });
  }

  UpdateProduct(
    id: string,
    title: string,
    supplierId: string,
    Description: string,
    Price: string
  ) {
    // We want to send a web request to update a product
    return this._webReqService.patch(`suppliers/${supplierId}/products/${id}`, {
      title,
      supplierId,
      Description,
      Price,
    });
  }
  getSuppliers() {
    // We want to send a web request to get suppliers
    return this._webReqService.get('suppliers');
  }

  getProducts(supplierId: string) {
    // we want to send a web request to get products from a specific supplier
    return this._webReqService.get(`suppliers/${supplierId}/products`) as any;
  }

  createProduct(
    title: string,
    supplierId: string,
    Description: string,
    Price: string
  ) {
    // we want to send a web request to crate a product
    return this._webReqService.post(`suppliers/${supplierId}/products`, {
      title,
      supplierId,
      Description,
      Price,
    });
  }

  addedToBasket(product: Product) {
    return this._webReqService.patch(
      `suppliers/${product._supplierId}/products/${product._id}`,
      {
        addedToBasket: !product.addedToBasket,
      }
    );
  }

  deleteProduct(product: Product) {
    console.log(product._id, product._supplierId);

    return this._webReqService.delete(
      `suppliers/${product._supplierId}/products/${product._id}`
    );
  }

  deleteSupplier(id: string) {
    return this._webReqService.delete(`suppliers/${id}`);
  }

  deleteAllProducts(id: string) {
    return this._webReqService.delete(`suppliers/${id}/products`);
  }
}
