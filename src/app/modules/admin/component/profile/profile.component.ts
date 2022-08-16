import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/Profile.model';
import { ApiProfileService } from 'src/app/services/admin/profile/api-profile.service';
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
    },500)
  }
  ngOnInit(): void {
    this.getAllProfile();
  }
  listProfile: Profile[] = []
  idAdmin: any = localStorage.getItem("adminId")
  getAllProfile(){
    this.api.getProfile('EMPLOYEE,SUPERADMIN').subscribe((data: any)=>{
      this.listProfile = data
    })
  }
  getAllUser(){
    this.api.getProfile('USER').subscribe((data: any)=>{
      this.listProfile = data
    })
  }
  blockEmployee(id: number){
    if(window.confirm("Bạn đã chắc chắn muốn thực hiện khóa nhân viên này !!!!!")){
      this.api.blockOrUnBlockUser(id).subscribe(res => {
        // window.alert("Khóa tài khoản thành công !!!");
        this.toastsService.alert('Thông báo !!!', 'Khóa tài khoản thành công !!!','bg-success');
        this.getAllProfile()
      })
    }
    // console.log("id user:::", id)
  }
  blockUser(id: number){
    if(window.confirm("Bạn đã chắc chắn muốn thực hiện khóa Tài khoản user này !!!!!")){
      this.api.blockOrUnBlockUser(id).subscribe(res => {
        // window.alert("Khóa tài khoản thành công !!!");
        this.toastsService.alert('Thông báo !!!', 'Khóa tài khoản thành công !!!','bg-success');
        this.getAllUser()
      })
    }
    // console.log("id user:::", id)
  }
  unBlockEmployee(id: number){
    if(window.confirm("Bạn đã chắc chắn muốn thực hiện mở khóa nhân viên này !!!!!")){
      this.api.blockOrUnBlockUser(id).subscribe(res => {
        // window.alert("Mở khóa tài khoản thành công !!!");
        this.toastsService.alert('Thông báo !!!', 'Mở khóa tài khoản thành công !!!','bg-success');
        this.getAllProfile()
      })
    }
    // console.log("id user:::", id)
  }
  unBlockUser(id: number){
    if(window.confirm("Bạn đã chắc chắn muốn thực hiện mở khóa User này !!!!!")){
      this.api.blockOrUnBlockUser(id).subscribe(res => {
        // window.alert("Mở khóa tài khoản thành công !!!");
        this.toastsService.alert('Thông báo !!!', 'Mở khóa tài khoản thành công !!!','bg-success');
        this.getAllUser()
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
