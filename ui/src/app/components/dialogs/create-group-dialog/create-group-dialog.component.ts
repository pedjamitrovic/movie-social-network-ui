import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NewGroupCommand } from '@models/new-group-command.model';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent implements OnInit {
  form: FormGroup;
  showEmojiPicker = false;

  constructor(
    public dialog: MatDialogRef<CreateGroupDialogComponent, NewGroupCommand>,
  ) { }

  ngOnInit() {
    this.form = new FormGroup(
      {
        title: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        subtitle: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      }
    );
  }

  cancel() {
    this.dialog.close(null);
  }

  create() {
    const command: NewGroupCommand = {}
    command.title = this.form.controls.title.value;
    command.subtitle = this.form.controls.subtitle.value;
    this.dialog.close(command);
  }
}
