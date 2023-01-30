import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SuppliersService } from 'src/app/Services/suppliers.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  constructor(
    private _activatedRouter: ActivatedRoute,
    private _supplierService: SuppliersService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  supplierId!: string;
  id!: string;
  pForm!: FormGroup;

  ngOnInit(): void {
    this._activatedRouter.params.subscribe((params: Params) => {
      console.log(params);
      this.supplierId = params['supplierId'];
      this.id = params['productId'];
    });

    this.pForm = this._formBuilder.group({
      ProductName: ['', [Validators.required, Validators.minLength(3)]],
      Description: ['', [Validators.required, Validators.minLength(3)]],
      Price: ['', [Validators.required]],
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

  updateProduct(Name: string, Description: string, Price: string) {
    this._supplierService
      .UpdateProduct(this.id, Name, this.supplierId, Description, Price)
      .subscribe((res) => {
        this._router.navigate(['suppliers', this.supplierId]);
      });
  }
}
