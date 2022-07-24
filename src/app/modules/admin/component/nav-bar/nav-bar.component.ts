import { Component, OnInit } from '@angular/core';
import { ApiProfileService } from 'src/app/services/profile/api-profile.service';
declare var jQuery: any;
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(
    private api: ApiProfileService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getDataUser()
    }, 200)
  }

  username: string | null = '';
  userAvt: string | null = '';
  profile: any
  getDataUser(){
    this.username = localStorage.getItem('name');
    const id = localStorage.getItem('adminId');
    this.api.getProfileById(Number(id)).subscribe((res:any)=>{
      this.profile = res;
      this.userAvt = this.profile.imageUrl
    })
  }

}
