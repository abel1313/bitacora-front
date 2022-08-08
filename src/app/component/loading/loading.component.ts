import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  imgLoading = './assets/image/wait.gif';
  constructor() { }

  ngOnInit() {
  }

}
