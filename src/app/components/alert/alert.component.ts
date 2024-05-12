import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


interface DialogData {
  text: string;
  title: string;
  confirm: string;
  title_color: string;
  text_color: string;
  btn_classes: string;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [MatDialogModule, NgClass, MatButtonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ){}

}
