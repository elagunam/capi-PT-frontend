import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddressService } from '../../services/address.service';
import { AppService } from '../../services/app.service';
import { Address } from '../../interfaces/global.interface';


export interface DialogData {
  id: number;
  contact_id: number;
}

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent {

  dialog = inject(MatDialog);
  addressService = inject(AddressService);
  appService = inject(AppService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddressComponent>);
  data: DialogData = inject(MAT_DIALOG_DATA);
  form: FormGroup = this.fb.group({
    id: [this.data.id ? this.data.id : null],
    contact_id: [this.data.contact_id, [Validators.required]],
    address: [null, [Validators.required]],
    city: [null, [Validators.required]],
    country: [null, [Validators.required]],
    zip: [null, [Validators.required]],
  });

  formState = {
    isLoading: false
  }

  ngOnInit(): void {
    this.loadAddressInfo();
  }

  close(){
    this.dialogRef.close(false);
  }

  save(){
    this.form.disable();
    this.formState.isLoading = true;
    this.addressService.save(this.form.value).subscribe({
      next: (response) => {
        if(response.status){
          this.formState.isLoading = false;
          this.appService.openToast(response.message, 'Cerrar');
          this.dialogRef.close(response.addresses);
        }else{
          this.formState.isLoading = false;
          this.form.enable();
          this.appService.openAlert('Atención', 'text-danger', response.message, 'Cerrar', 'text-danger', 'btn-danger text-light');
        }
      },
      error: (error) => {
        console.log(error);
        this.appService.openAlert('Error', 'text-danger', 'No se pudo procesar su petición en este momento, intente más tarde', 'Cerrar', 'text-danger', 'btn-danger text-light');
        this.form.enable();
        this.formState.isLoading = false;
      }
    });
  }

  loadAddressInfo(){
    if(this.data.id){
      this.form.disable();
      this.formState.isLoading = true;
      this.addressService.getOneById(this.data.id).subscribe({
        next: (response) => {
          if(response.status){
            const address: Address = response.address;
            this.form.get('id')?.setValue(address.id);
            this.form.get('contact_id')?.setValue(address.contact_id);
            this.form.get('address')?.setValue(address.address);
            this.form.get('city')?.setValue(address.city);
            this.form.get('zip')?.setValue(address.zip);
            this.form.get('country')?.setValue(address.country);
            this.form.enable();
            this.formState.isLoading = false;
          }else{
            this.appService.openAlert('Error', 'text-danger', response.message, 'Cerrar', 'text-danger', 'btn-danger text-light');
            this.form.enable();
            this.formState.isLoading = false;
            this.dialogRef.close(false);
          }
        },
        error: (error) => {
          console.log(error);
          this.appService.openAlert('Error', 'text-danger', 'No se pudo procesar su petición en este momento, intente más tarde', 'Cerrar', 'text-danger', 'btn-danger text-light');
          this.form.enable();
          this.formState.isLoading = false;
          this.dialogRef.close(false);
        }
      });

    }
  }


}
