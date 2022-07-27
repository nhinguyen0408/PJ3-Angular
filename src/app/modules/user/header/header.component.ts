import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/admin/auth/auth.service';
import { CategoryService } from 'src/app/services/user/category/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService, private cate: CategoryService) { }
  name: string | null = '';
  ngOnInit(): void {
    this.name = localStorage.getItem('username')
    this.getAllCate()
  }

  category: any = []

  logoutUser = () => {
    this.auth.logoutUser()
  }


  getAllCate = () => {
    this.cate.getCategoryEnable().subscribe((res) => {
      this.category = res
    })

  }
}
