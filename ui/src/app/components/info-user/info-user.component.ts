import { Component, Input, OnInit } from '@angular/core';
import { UserVM } from '@models/response/user-vm.model';
import { EnvironmentService } from '@services/environment.service';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss']
})
export class InfoUserComponent implements OnInit {
  @Input() user: UserVM;

  constructor(
    public environment: EnvironmentService
  ) { }

  ngOnInit() { }

}
