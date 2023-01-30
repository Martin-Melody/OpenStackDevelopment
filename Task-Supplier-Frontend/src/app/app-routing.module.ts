import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { DeliveryViewComponent } from './Components/delivery-view/delivery-view.component';
import { EditProductComponent } from './Components/edit-product/edit-product.component';
import { EditSupplierComponent } from './Components/edit-supplier/edit-supplier.component';
import { NewProductComponent } from './Components/new-product/new-product.component';
import { NewSupplierComponent } from './Components/new-supplier/new-supplier.component';
import { ProfileComponent } from './Components/profile/profile.component';

const routes: Routes = [
  {path: '', redirectTo: 'suppliers/', pathMatch: 'full'},
  {path: 'new-supplier', component: NewSupplierComponent},
  {path: 'suppliers/:supplierId', component: DeliveryViewComponent},
  {path: 'suppliers/:supplierId/new-product', component: NewProductComponent},
  {path: 'suppliers/:supplierId/edit-supplier', component: EditSupplierComponent},
  {path: 'suppliers/:supplierId/products/:productId/edit-product', component:EditProductComponent},
  {path: 'profile', component:ProfileComponent,canActivate:[AuthGuard]},
  {path: '**', redirectTo:'suppliers/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
