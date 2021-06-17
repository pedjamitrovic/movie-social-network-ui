import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {

  constructor(
    private snackbar: MatSnackBar,
  ) {
  }

  open(message: string, action: string = 'OK', config: MatSnackBarConfig<any> = { duration: 2000 }) {
    return this.snackbar.open(message, action, config);
  }
}
