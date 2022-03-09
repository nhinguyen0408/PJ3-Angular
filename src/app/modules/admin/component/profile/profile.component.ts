import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/Profile.model';
import { ApiProfileService } from 'src/app/services/profile/api-profile.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private api: ApiProfileService,
    private toastsService: ToastService
  ) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },200)
  }
  ngOnInit(): void {
    this.getAllProfile();
  }
  listProfile: Profile[] = []

  getAllProfile(){
    this.api.getProfile().subscribe((data: any)=>{
      this.listProfile = data
    })
  }
  blockUser(id: number){
    if(window.confirm("Bạn đã chắc chắn muốn thực hiện khóa nhân viên này !!!!!")){
      this.api.blockOrUnBlockUser(id).subscribe(res => {
        // window.alert("Khóa tài khoản thành công !!!");
        this.toastsService.alert('Thông báo !!!', 'Khóa tài khoản thành công !!!','bg-success');
        this.getAllProfile()
      })
    }
    // console.log("id user:::", id)
  }
  unBlockUser(id: number){
    if(window.confirm("Bạn đã chắc chắn muốn thực hiện mở khóa nhân viên này !!!!!")){
      this.api.blockOrUnBlockUser(id).subscribe(res => {
        // window.alert("Mở khóa tài khoản thành công !!!");
        this.toastsService.alert('Thông báo !!!', 'Mở khóa tài khoản thành công !!!','bg-success');
        this.getAllProfile()
      })
    }
    // console.log("id user:::", id)
  }
  resetPass(role: string ,id: number){
    if(window.confirm("Bạn đã chắc chắn muốn reset mật khẩu cho nhân viên này !!!!!")){
      this.api.resetPass({role, id}).subscribe(res => {
        // window.alert("Reset mật khẩu thành công !!!");
        this.toastsService.alert('Thông báo !!!', 'Reset mật khẩu thành công !!!','bg-success');
        this.getAllProfile()
      })
    }
  }
  setDataTable(){
    (function ($) {
        $("#table-employee").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
  }

}
