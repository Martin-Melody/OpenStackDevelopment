import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Params, Router } from '@angular/router';
import { SuppliersService } from 'src/app/Services/suppliers.service';
import { WebRequestService } from 'src/app/Services/web-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit {
  constructor(
    private _webService: WebRequestService,
    private _supplierService: SuppliersService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  pForm!: FormGroup;

  supplierId!: string;

  ngOnInit(): void {
    this._activatedRouter.params.subscribe((params: Params) => {
      this.supplierId = params['supplierId'];
    });

    this.pForm = this._formBuilder.group({
      ProductName: ['', [Validators.required, Validators.minLength(3)]],
      Description: ['', [Validators.required, Validators.minLength(3)]],
      Price: ['', [Validators.required]],
    });
  }

  crateProduct(title: string, description: string, price: string) {
    this._supplierService
      .createProduct(title, this.supplierId, description, price)
      .subscribe((newProduct: any) => {
        this._router.navigate(['../'], { relativeTo: this._activatedRouter });
      });
  }

  get ProductName() {
    return this.pForm.get('ProductName');
  }

  get Description() {
    return this.pForm.get('Description');
  }

  get Price() {
    return this.pForm.get('Price');
  }
}
