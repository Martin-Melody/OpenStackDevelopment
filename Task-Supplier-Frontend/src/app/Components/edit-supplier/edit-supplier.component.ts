import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { SuppliersService } from 'src/app/Services/suppliers.service';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss'],
})
export class EditSupplierComponent implements OnInit {
  constructor(
    private _activatedRouter: ActivatedRoute,
    private _supplierService: SuppliersService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  supplierId!: string;
  SupplierForm!: FormGroup;

  ngOnInit(): void {
    this._activatedRouter.params.subscribe((params: Params) => {
      this.supplierId = params['supplierId'];
    });

    this.SupplierForm = this._formBuilder.group({
      SupplierName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  UpdateSupplier(supplierName: string) {
    this._supplierService
      .UpdateSupplier(this.supplierId, supplierName)
      .subscribe((res) => {
        this._router.navigate(['/suppliers', this.supplierId]);
      });
  }

  get SupplierName() {
    return this.SupplierForm.get('SupplierName');
  }
}
