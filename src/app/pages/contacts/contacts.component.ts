import { Component, OnInit, inject } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { RouterLink } from '@angular/router';

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
  imports: [MatSelectModule, MatInputModule, RouterLink],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {

  contactService = inject(ContactService);

  contacts: Contact[] = [];

  currentPage: number = 1;
  lastPage: number = 1;

  pageSize: number = 10;
  filters: any = {};

  
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



}
