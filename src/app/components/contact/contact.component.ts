import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


export interface DialogData {
  id: number;
}
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit{
  dialog = inject(MatDialog);
  contactService = inject(ContactService);
  appService = inject(AppService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ContactComponent>);
  data: DialogData = inject(MAT_DIALOG_DATA);
  form: FormGroup = this.fb.group({
    id: [this.data.id ? this.data.id : null],
    fullname: [null, [Validators.required]]
  });

  formState = {
    isLoading: false
  }

  ngOnInit(): void {
    this.loadContactInfo();
  }

  save(){
    this.form.disable();
    this.formState.isLoading = true;
    this.contactService.save(this.form.value).subscribe({
      next: (response) => {
        if(response.status){
          this.formState.isLoading = false;
          this.appService.openToast(response.message, 'Cerrar');
          this.data.id = response.contact.id;
          this.loadContactInfo();
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

  close(){
    this.dialogRef.close(false);
  }


  loadContactInfo(){
    if(this.data.id){
      this.form.disable();
      this.formState.isLoading = true;
      this.contactService.getOneById(this.data.id).subscribe({
        next: (response) => {
          if(response.status){
            const contact = response.contact;
            this.form.get('id')?.setValue(contact.id);
            this.form.get('fullname')?.setValue(contact.fullname);
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
