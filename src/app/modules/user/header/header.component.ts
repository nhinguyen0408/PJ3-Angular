import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService) { }
  name: string | null = '';
  ngOnInit(): void {
    this.name = localStorage.getItem('username')
  }

  logoutUser = () => {
    this.auth.logoutUser()
  }
}
