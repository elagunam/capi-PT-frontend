import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


interface DialogData {
  text: string;
  title: string;
  confirm: string;
  cancel: string;
  title_color: string;
  text_color: string;
  btn_classes: string;
}

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [MatDialogModule, NgClass, MatButtonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ){}

}
