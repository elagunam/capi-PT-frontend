import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PhoneService } from '../../services/phone.service';
import { AppService } from '../../services/app.service';
import { Phone } from '../../interfaces/global.interface';
import {MatSelectModule} from '@angular/material/select';


export interface DialogData {
  id: number;
  contact_id: number;
}

@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss'
})
export class PhoneComponent implements OnInit{
  dialog = inject(MatDialog);
  phoneService = inject(PhoneService);
  appService = inject(AppService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<PhoneComponent>);
  data: DialogData = inject(MAT_DIALOG_DATA);
  form: FormGroup = this.fb.group({
    id: [this.data.id ? this.data.id : null],
    contact_id: [this.data.contact_id, [Validators.required]],
    phone_number: [null, [Validators.required, Validators.pattern("[0-9]{10}")]],
    type: [null, [Validators.required]],
  });

  phone_types = [
    {
      code: 'home',
      name: 'Casa'
    },
    {
      code: 'mobile',
      name: 'Móvil'
    },
    {
      code: 'work',
      name: 'Trabajo'
    }
  ];

  formState = {
    isLoading: false
  }

  close(){
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
    this.loadPhoneInfo();
  }

  loadPhoneInfo(){
    if(this.data.id){
      this.form.disable();
      this.formState.isLoading = true;
      this.phoneService.getOneById(this.data.id).subscribe({
        next: (response) => {
          if(response.status){
            const phone: Phone = response.phone;
            this.form.get('id')?.setValue(phone.id);
            this.form.get('contact_id')?.setValue(phone.contact_id);
            this.form.get('phone_number')?.setValue(phone.phone_number);
            this.form.get('type')?.setValue(phone.type);
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

  save(){
    this.form.disable();
    this.formState.isLoading = true;
    this.phoneService.save(this.form.value).subscribe({
      next: (response) => {
        if(response.status){
          this.formState.isLoading = false;
          this.appService.openToast(response.message, 'Cerrar');
          this.dialogRef.close(response.phones);
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





}
