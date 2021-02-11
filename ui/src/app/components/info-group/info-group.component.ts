import { Component, Input, OnInit } from '@angular/core';
import { Group } from '@models/group.model';

@Component({
  selector: 'app-info-group',
  templateUrl: './info-group.component.html',
  styleUrls: ['./info-group.component.scss']
})
export class InfoGroupComponent implements OnInit {
  @Input() group: Group;

  constructor() { }

  ngOnInit(): void {
  }

}
