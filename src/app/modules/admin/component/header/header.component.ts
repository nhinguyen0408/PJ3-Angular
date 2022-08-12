import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/admin/auth/auth.service';
import { NotificationService } from 'src/app/services/admin/notification/notification.service';
import TimeAgo from 'javascript-time-ago'

// English.
import vn from 'javascript-time-ago/locale/vi'

TimeAgo.addDefaultLocale(vn)

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private apiNotification: NotificationService,
    ) { }

  ngOnInit(): void {
    this.getNotification()
  }
  name: string| null = localStorage.getItem("name");
  logOut(){
    this.auth.logout();
  }
  timeAgo = new TimeAgo('en-US')
  search: string | null = null
  notification: any = []
  countUnread: any
  getNotification = () => {
    // setInterval(() => {
      this.apiNotification.getAllNotification().subscribe((res: any) => {
        this.notification = res
        if(this.notification && this.notification.length > 0){
          const data = this.notification.map((element: any) => {
            const param = element.params ? JSON.parse(element.params) : null;
            return {...element, createdDate: this.timeAgo.format(new Date(element.createdDate)), params: param}
          })

          this.notification = data
        }
      })
      this.apiNotification.countUnReadNotification().subscribe((res: any) => {
        this.countUnread = res
      })
    // }, 1000)
  }

  readNotification = (id: number | string) => {
    this.apiNotification.readNotification(id).subscribe((res: any) => {
      if(res){
        this.getNotification()
      }
    })
  }
}
