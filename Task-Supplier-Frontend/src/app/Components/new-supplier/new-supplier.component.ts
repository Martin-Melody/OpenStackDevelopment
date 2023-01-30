import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SuppliersService } from 'src/app/Services/suppliers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss'],
})
export class NewSupplierComponent implements OnInit {
  SupplierForm!: FormGroup;

  constructor(
    private _supplierService: SuppliersService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.SupplierForm = this._formBuilder.group({
      SupplierName: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.SupplierForm.valueChanges.subscribe(console.log);
  }

  get SupplierName() {
    return this.SupplierForm.get('SupplierName');
  }

  createSupplier(SupplierName: string) {
    this._supplierService
      .createSupplier(SupplierName)
      .subscribe((supplier: any) => {
        // Now we navigate to /suppliers/response._id
        this._router.navigate(['/suppliers', supplier._id]);
      });
  }
}
