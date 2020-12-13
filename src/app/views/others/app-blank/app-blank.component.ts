import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blank',
  templateUrl: './app-blank.component.html',
  styleUrls: ['./app-blank.component.css']
})
export class AppBlankComponent implements OnInit {

  public userInfo: any;

  constructor() { }

  ngOnInit() {
	  
	this.userInfo = this.getUserInfo();
	   
  }

  getUserInfo(): any {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  
}
