import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getClock()
  }
  name: string| null = localStorage.getItem("name");
  clock: any;
  logOut(){
    this.auth.logout();
  }
  getClock(){
    var x = setInterval(() =>{
        let data = {'hours': 0, 'minutes': 0, 'seconds': 0};
          var now = new Date();
          data.hours = now.getHours();
          data.minutes = now.getMinutes();
          data.seconds = now.getSeconds();
          let m = checkTime(data.minutes);
          let s = checkTime(data.seconds);
        // console.log("data",data)
        this.clock = {'hours': data.hours, 'minutes': m, 'seconds': s}

    }, 1000)
    const checkTime= (i: number) => {
      let a = i + ''
      if (i < 10) { a = "0" + i};  // add zero in front of numbers < 10
       return a;
    }

  }

}
