import { Component, OnInit, inject } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

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
  imports: [MatSelectModule, MatInputModule],
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

  // onPageSizeChange(newSize: number) {
  //   this.pageSize = newSize;
  //   this.loadContacts();
  // }



}
