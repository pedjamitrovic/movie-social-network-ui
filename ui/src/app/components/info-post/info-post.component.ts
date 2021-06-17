import { Component, Input, OnInit } from '@angular/core';
import { PostVM } from '@models/response/post-vm.model';
import { EnvironmentService } from '@services/environment.service';

@Component({
  selector: 'app-info-post',
  templateUrl: './info-post.component.html',
  styleUrls: ['./info-post.component.scss']
})
export class InfoPostComponent implements OnInit {
  @Input() post: PostVM;

  constructor(
    public environment: EnvironmentService
  ) { }

  ngOnInit() { }

}
