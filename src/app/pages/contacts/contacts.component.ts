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

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(){
    this.contactService.getContacts().subscribe({
      next: (response) => {
        console.log(response);
        
      },
      error: (error) => {
        console.log(error);
        
      }
    });
  }



}
