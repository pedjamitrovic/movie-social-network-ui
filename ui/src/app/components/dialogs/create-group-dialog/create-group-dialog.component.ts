import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BusinessErrorCode } from '@models/business-error-code.model';
import { CreateGroupCommand } from '@models/create-group-command.model';
import { GroupVM } from '@models/group-vm.model';
import { GroupService } from '@services/group.service';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent implements OnInit {
  form: FormGroup;
  showEmojiPicker = false;

  constructor(
    public dialog: MatDialogRef<CreateGroupDialogComponent, CreateGroupCommand>,
    private groupService: GroupService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup(
      {
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]),
        subtitle: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      }
    );
  }

  cancel() {
    this.dialog.close();
  }

  create() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return; }

    const command: CreateGroupCommand = {
      title: this.form.controls.title.value,
      subtitle: this.form.controls.subtitle.value,
    };

    this.groupService.create(command).subscribe(
      (group: GroupVM) => {
        this.router.navigate(['/groups', group.id]);
        this.dialog.close(command);
      },
      (err) => {
        if (err.code) {
          if (err.code === BusinessErrorCode.TitleAlreadyExists) {
            this.form.controls.title.setErrors({ alreadyExists: true });
          }
        }
      }
    );
  }
}
