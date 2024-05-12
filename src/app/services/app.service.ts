import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertComponent } from '../components/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  openAlert(title: string, title_color: string, text: string, action: string, text_color = '', btn_classes = 'btn-primary text-light'): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        title: title,
        title_color,
        text: text,
        confirm: action,
        text_color,
        btn_classes,
      }
    });
  }

  openToast(message: string, action_text: string){
    let config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(message, action_text, config);
  }
}
