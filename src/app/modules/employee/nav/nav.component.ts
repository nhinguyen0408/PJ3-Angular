import { Component, OnInit } from '@angular/core';
import { ApiProfileService } from 'src/app/services/profile/api-profile.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private api: ApiProfileService
  ) { }

  ngOnInit(): void {
    this.getDataUser()
    // (function ($) {

    // })(jQuery);
  }

  username: string | null = '';
  userAvt: string | null = '';
  profile: any
  getDataUser(){
    this.username = localStorage.getItem('name');
    const id = localStorage.getItem('employeeId');
    this.api.getProfileById(Number(id)).subscribe((res:any)=>{
      this.profile = res;
      this.userAvt = this.profile.imageUrl
      console.log("userAvt====",this.userAvt)
    })
  }
}
