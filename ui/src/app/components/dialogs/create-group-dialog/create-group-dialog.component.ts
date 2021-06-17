import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateGroupCommand } from '@models/request/create-group-command.model';
import { BusinessErrorCode } from '@models/response/business-error-code.model';
import { GroupVM } from '@models/response/group-vm.model';
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
    private dialog: MatDialogRef<CreateGroupDialogComponent, CreateGroupCommand>,
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
