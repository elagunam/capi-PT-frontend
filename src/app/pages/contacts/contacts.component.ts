import { Component, OnInit, inject } from '@angular/core';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {

  contactService = inject(ContactService);

  currentPage: number = 1;
  pageSize: number = 10;
  filters: any = {};


  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(){
    this.contactService.getContacts(this.currentPage, this.pageSize, this.filters).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
        
      }
    });
  }



}
