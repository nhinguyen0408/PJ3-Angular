import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiProfileService } from 'src/app/services/profile/api-profile.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private api: ApiProfileService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getDataUser()
    this.checkBlock();
    // (function ($) {

    // })(jQuery);
  }
  checkBlock(){
    var x = setInterval(() =>{
      this.api.getProfileById(Number(localStorage.getItem('employeeId'))).subscribe(res => {
        if(res.block === true){
          alert("Tài khoản của bạn đã bị khóa !!!");
          this.auth.logout();
        }
      })

    }, 10000)

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
        // console.log("userAvt====",this.userAvt)
        // if(this.profile.block === true){
        //   alert("Tài khoản của bạn đã bị khóa !!!")
        // }
      })

  }
}
