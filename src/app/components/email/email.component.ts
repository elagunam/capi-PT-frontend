import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmailService } from '../../services/email.service';
import { AppService } from '../../services/app.service';
import { Email } from '../../interfaces/global.interface';
export interface DialogData {
  id: number;
  contact_id: number;
}

@Component({
  selector: 'app-email',
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
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent implements OnInit{
  dialog = inject(MatDialog);
  emailService = inject(EmailService);
  appService = inject(AppService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<EmailComponent>);
  data: DialogData = inject(MAT_DIALOG_DATA);
  form: FormGroup = this.fb.group({
    id: [this.data.id ? this.data.id : null],
    contact_id: [this.data.contact_id, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
  });

  formState = {
    isLoading: false
  }

  close(){
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
    this.loadEmailInfo();
  }

  loadEmailInfo(){
    if(this.data.id){
      this.form.disable();
      this.formState.isLoading = true;
      this.emailService.getOneById(this.data.id).subscribe({
        next: (response) => {
          if(response.status){
            const email: Email = response.email;
            this.form.get('id')?.setValue(email.id);
            this.form.get('contact_id')?.setValue(email.contact_id);
            this.form.get('email')?.setValue(email.email);
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
    this.emailService.save(this.form.value).subscribe({
      next: (response) => {
        if(response.status){
          this.formState.isLoading = false;
          this.appService.openToast(response.message, 'Cerrar');
          this.dialogRef.close(response.emails);
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
