import { Component, Input, OnInit } from '@angular/core';
import { GroupVM } from '@models/group-vm.model';
import { EnvironmentService } from '@services/environment.service';

@Component({
  selector: 'app-info-group',
  templateUrl: './info-group.component.html',
  styleUrls: ['./info-group.component.scss']
})
export class InfoGroupComponent implements OnInit {
  @Input() group: GroupVM;
  @Input() showAdminText: boolean;

  constructor(public environment: EnvironmentService) { }

  ngOnInit(): void {
  }

}
