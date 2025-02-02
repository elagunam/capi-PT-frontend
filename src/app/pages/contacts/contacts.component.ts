import { Component, OnInit, inject } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ContactComponent } from '../../components/contact/contact.component';
import {MatIconModule} from '@angular/material/icon';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { AppService } from '../../services/app.service';




interface Contact {
  id:         number;
  fullname:   string;
  created_at: Date;
  updated_at: Date;
  deleted:    number;
  deleted_at: null;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule,
    MatSelectModule, 
    MatInputModule, 
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {

  contactService = inject(ContactService);
  appService = inject(AppService);
  public dialog = inject(MatDialog);

  contacts: Contact[] = [];

  currentPage: number = 1;
  lastPage: number = 1;

  pageSize: number = 10;
  filters: any = {};

  private fb = inject(FormBuilder);

  filtersForm: FormGroup = this.fb.group({
    fullname: [null],
    email: [null, [Validators.email]],
    phone_number: [null, [Validators.pattern('[- +()0-9]+')]],
    city: [null],
  });

  
  tableState = {
    isLoading: true,
    error: false,
    errorMessage: 'Loading...'
  };


  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(){
    this.tableState.isLoading = true;
    this.contactService.getContacts(this.currentPage, this.pageSize, this.filters).subscribe({
      next: (response) => {
        this.lastPage = response.last_page;
        this.contacts = response.data;
        this.tableState.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.tableState.isLoading = false;
        this.tableState.error = true;
        this.tableState.errorMessage = 'No se pudo procesar su petición';
      }
    });
  }

  onPageSizeChange(newSize: number) {
    this.loadContacts();
  }

  prevPage(){
    //SI LA PAGINA ES LA PRIMERA, NO PODEMOS IR ATRAS
    if(this.currentPage <= 1){
      return;
    }

    this.currentPage --;
    this.loadContacts();
  }

  nextPage(){
    //SI LA PAGINA ES LA ULTIMA PAGINA, NO PODEMOS IR A LA SIGUIENTE
    if(this.currentPage >= this.lastPage){
      return;
    }

    this.currentPage ++;
    this.loadContacts();
  }


  filter(){
    console.log(this.filtersForm.value);
    this.filters = this.filtersForm.value;
    this.currentPage = 1;
    this.loadContacts();
  }

  //FACADES PARA CREAR O EDITAR UN CONTACTO
  edit(id: number){
    this.open(id);
  }

  create(){
    this.open();
  }

  view(id: number){
    this.open(id, true);
  }

  //ABRIR EMERGENTE DE CONTACTO
  open(id: number = 0, readonly:boolean=false): void {
    const contactDialogRef = this.dialog.open(ContactComponent, {
      panelClass: ['col-md-12'],
      data: {
        id: id,
        readonly
      }
    });

    contactDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadContacts();
      }
    });
  }



  deleteContactConfirm(contact: Contact){

    const contactDialogRef = this.dialog.open(ConfirmComponent, {
      panelClass: ['col-md-12'],
      data: {
        title: 'Borrar contacto',
        text: `¿Desea borrar a ${contact.fullname}?`,
        confirm: 'Eliminar',
        cancel: 'Cancelar',
      }
    });

    contactDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteContact(contact.id);
      }
    });
  }


  deleteContact(id: number){
    this.contactService.delete(id).subscribe({
      next: (response) => {
        if(response.status){
          this.appService.openToast(response.message, 'Cerrar');
          this.loadContacts();
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
