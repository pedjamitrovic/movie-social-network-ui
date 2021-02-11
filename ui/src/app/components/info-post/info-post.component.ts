import { Component, Input, OnInit } from '@angular/core';
import { Post } from '@models/post.model';

@Component({
  selector: 'app-info-post',
  templateUrl: './info-post.component.html',
  styleUrls: ['./info-post.component.scss']
})
export class InfoPostComponent implements OnInit {
  @Input() post: Post;

  constructor() { }

  ngOnInit(): void {
  }

}
