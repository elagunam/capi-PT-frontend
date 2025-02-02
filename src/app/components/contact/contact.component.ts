import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { Address, Contact, Email, Phone } from '../../interfaces/global.interface';
import { AddressComponent } from '../address/address.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmComponent } from '../confirm/confirm.component';
import { AddressService } from '../../services/address.service';
import { PhoneComponent } from '../phone/phone.component';
import { PhoneService } from '../../services/phone.service';
import { EmailComponent } from '../email/email.component';
import { EmailService } from '../../services/email.service';



export interface DialogData {
  id: number;
  readonly: boolean;
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
    MatButtonModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit{
  dialog = inject(MatDialog);
  contactService = inject(ContactService);
  appService = inject(AppService);
  addressService = inject(AddressService);
  phoneService = inject(PhoneService);
  emailService = inject(EmailService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ContactComponent>);
  data: DialogData = inject(MAT_DIALOG_DATA);
  form: FormGroup = this.fb.group({
    id: [this.data.id ? this.data.id : null],
    fullname: [null, [Validators.required]]
  });

  contact: Contact | null = null; 

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
            this.contact = contact;
            this.form.get('id')?.setValue(contact.id);
            this.form.get('fullname')?.setValue(contact.fullname);
            this.form.enable();
            this.formState.isLoading = false;
            if(this.data.readonly){
              this.form.disable();
            }
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


  //FACADES PARA CREAR O EDITAR UN DIRECCION
  editAddress(id: number){
    this.openAddress(id);
  }

  createAddress(){
    this.openAddress();
  }

  //ABRIR EMERGENTE DE DIRECCION
  openAddress(id: number = 0): void {
    const contactDialogRef = this.dialog.open(AddressComponent, {
      panelClass: ['col-md-12'],
      data: {
        id: id,
        contact_id: this.data.id
      }
    });

    contactDialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        if(this.contact){
          this.contact.addresses = result
        }else{
          console.log('Undeifnde contact');
          
        }
      }
    });
  }


  deleteAddressConfirm(address: Address){

    const contactDialogRef = this.dialog.open(ConfirmComponent, {
      panelClass: ['col-md-12'],
      data: {
        title: 'Borrar dirección de contacto',
        text: `¿Desea borrar la dirección ${address.address}, de la ciudad ${address.city}?`,
        confirm: 'Eliminar',
        cancel: 'Cancelar',
      }
    });

    contactDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteAddress(address.id);
      }
    });
  }


  deleteAddress(id: number){
    this.addressService.delete(id).subscribe({
      next: (response) => {
        if(response.status){
          this.appService.openToast(response.message, 'Cerrar');
          if(this.contact){
            this.contact.addresses = response.addresses;
          }
        }else{
          this.appService.openAlert('Atención', 'text-danger', response.message, 'Cerrar', 'text-danger', 'btn-danger text-light');
        }
      },
      error: (error) => {
        console.log(error);
        this.appService.openAlert('Error', 'text-danger', 'No se pudo procesar su petición en este momento, intente más tarde', 'Cerrar', 'text-danger', 'btn-danger text-light');
      }
    });
  }

  //FACADES PARA CREAR O EDITAR UN TELEFONO
  editPhone(id: number){
    this.openPhone(id);
  }

  createPhone(){
    this.openPhone();
  }

  //ABRIR EMERGENTE DE TELEFONO
  openPhone(id: number = 0): void {
    const contactDialogRef = this.dialog.open(PhoneComponent, {
      panelClass: ['col-md-12'],
      data: {
        id: id,
        contact_id: this.data.id
      }
    });

    contactDialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        if(this.contact){
          this.contact.phones = result
        }
      }
    });
  }

  deletePhoneConfirm(phone: Phone){

    const contactDialogRef = this.dialog.open(ConfirmComponent, {
      panelClass: ['col-md-12'],
      data: {
        title: 'Borrar Teléfono de contacto',
        text: `¿Desea borrar el Teléfono ${phone.phone_number}?`,
        confirm: 'Eliminar',
        cancel: 'Cancelar',
      }
    });

    contactDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deletePhone(phone.id);
      }
    });
  }

  deletePhone(id: number){
    this.phoneService.delete(id).subscribe({
      next: (response) => {
        if(response.status){
          this.appService.openToast(response.message, 'Cerrar');
          if(this.contact){
            this.contact.phones = response.phones;
          }
        }else{
          this.appService.openAlert('Atención', 'text-danger', response.message, 'Cerrar', 'text-danger', 'btn-danger text-light');
        }
      },
      error: (error) => {
        console.log(error);
        this.appService.openAlert('Error', 'text-danger', 'No se pudo procesar su petición en este momento, intente más tarde', 'Cerrar', 'text-danger', 'btn-danger text-light');
      }
    });
  }

  //FACADES PARA CREAR O EDITAR UN email
  editEmail(id: number){
    this.openEmail(id);
  }

  createEmail(){
    this.openEmail();
  }

  //ABRIR EMERGENTE DE email
  openEmail(id: number = 0): void {
    const contactDialogRef = this.dialog.open(EmailComponent, {
      panelClass: ['col-md-12'],
      data: {
        id: id,
        contact_id: this.data.id
      }
    });

    contactDialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        if(this.contact){
          this.contact.emails = result
        }
      }
    });
  }

  deleteEmailConfirm(email: Email){

    const contactDialogRef = this.dialog.open(ConfirmComponent, {
      panelClass: ['col-md-12'],
      data: {
        title: 'Borrar email de contacto',
        text: `¿Desea borrar el email ${email.email}?`,
        confirm: 'Eliminar',
        cancel: 'Cancelar',
      }
    });

    contactDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteEmail(email.id);
      }
    });
  }

  deleteEmail(id: number){
    this.emailService.delete(id).subscribe({
      next: (response) => {
        if(response.status){
          this.appService.openToast(response.message, 'Cerrar');
          if(this.contact){
            this.contact.emails = response.emails;
          }
        }else{
          this.appService.openAlert('Atención', 'text-danger', response.message, 'Cerrar', 'text-danger', 'btn-danger text-light');
        }
      },
      error: (error) => {
        console.log(error);
        this.appService.openAlert('Error', 'text-danger', 'No se pudo procesar su petición en este momento, intente más tarde', 'Cerrar', 'text-danger', 'btn-danger text-light');
      }
    });
  }
}
