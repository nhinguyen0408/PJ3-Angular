import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'src/app/models/upload/FileUpload.model';
import { AuthService } from 'src/app/services/admin/auth/auth.service';
import { ApiProfileService } from 'src/app/services/admin/profile/api-profile.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { FileUploadService } from 'src/app/services/upload/file-upload.service';
declare var jQuery: any;
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(
    private api: ApiProfileService,
    private auth: AuthService,
    private route: Router,
    private uploadService: FileUploadService,
    private toastsService: ToastService,
  ) { }
  isLoading: boolean = false;
  myProfile: any;
  profileUpdate: any;
  ngOnInit(): void {
    this.getMydata();

    (function ($) {
      $(document).ready(function(){
        $("#changeProfile").click(function(){
          $("#activity").addClass("active");
          $("#settings").removeClass("active");
        });
        $("#changePass").click(function(){
          $("#settings").addClass("active");
          $("#activity").removeClass("active");
        })
        $("#close").click(function(){
          $("#settings").removeClass("active");
          $("#activity").removeClass("active");
        })
      });
    })(jQuery);
  }

  selectedFiles?: FileList;
  fileNamePreView: string = '';
  currentFileUpload?: FileUpload;
  result: any;
  objChangePass: any;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
      const reader = new FileReader();

      if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.fileNamePreView = reader.result as string;

        };
      }

  }
  async upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        const fileName = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        this.currentFileUpload.name = fileName;
        this.fileNamePreView = this.currentFileUpload.url;
        this.result = await this.uploadService.pushFileToStorage(this.currentFileUpload)
        // console.log('result:::',this.result)
        setTimeout(()=>{
          // this.product.avatarUrl = this.result.url;
          this.myProfile.imageUrl = this.result.url;
        },4000)

      }
    }

  }
  changePassForm = new FormGroup({
    oldPass: new FormControl('',[Validators.required,Validators.minLength(6)]),
    newPass: new FormControl('',[Validators.required,Validators.minLength(6)]),
    reNewPass: new FormControl('',[Validators.required,Validators.minLength(6)])
  })


  getMydata(){
    const adminId = Number(localStorage.getItem("adminId"));
    this.api.getProfileById(adminId).subscribe((data: any)=>{
      this.myProfile = data;
      // console.log(this.myProfile)
    })

  }
  //localStorage.getItem("adminId")

  onSubmitUpdate(){
    if(this.myProfile.fistName === "" || this.myProfile.lastName === "" || this.myProfile.email === ""|| this.myProfile.address === ""){
      this.toastsService.alert("Thông báo !!!!", "Vui lòng nhập đủ thông tin !!!","bg-warning");
    } else {
      if(window.confirm("Chắc chắn bạn muốn thực hiện thay đổi ????")){
        this.isLoading = true;
        if(this.selectedFiles != null && this.selectedFiles != undefined){
          this.upload();
          setTimeout(()=>{
            this.api.updateMyProfile(this.myProfile).subscribe((data:{})=>{
              this.isLoading = false;
              this.toastsService.alert("Thông báo !!!!", "Sửa tài khoản thành công !!!","bg-success");
              this.getMydata()
            });
          },4300)
        } else {
          this.api.updateMyProfile(this.myProfile).subscribe((data:{})=>{
            this.isLoading = false;
            window.location.reload;
            this.toastsService.alert("Thông báo !!!!", "Sửa tài khoản thành công !!!","bg-success");
          });
        }
      }
    }

  }

  onChangePassword(){
    if(this.changePassForm.valid){
      if(this.changePassForm.value.newPass === this.changePassForm.value.reNewPass && this.changePassForm.value.newPass != this.changePassForm.value.oldPass) {
        this.isLoading = true;
        const oldPass = this.changePassForm.value.oldPass;
        const newPass = this.changePassForm.value.newPass;
        const myId = localStorage.getItem("adminId");
        const objChangePass = {oldPass,newPass,myId}
        console.log("objChangePass===== ", objChangePass)
        this.api.updatePassword(objChangePass).subscribe(data =>{
          // window.alert("Đổi mật khẩu thành công !!!!!");
          this.isLoading = false;
          this.toastsService.alert('Thông báo !!!', 'Đổi mật khẩu thành công !!!!!','bg-success');
          this.auth.logout();
        })
        this.changePassForm.reset()
        this.isLoading = false;
       } else {
        // alert("Mật khẩu nhập lại không trùng khớp hoặc trùng với mật khẩu cũ !!!")
        this.isLoading = false;
        this.toastsService.alert('Thông báo !!!', 'Mật khẩu nhập lại không trùng khớp hoặc trùng với mật khẩu cũ !!!','bg-danger');
       }

    } else {
      if(this.changePassForm.value.oldPass.length < 6){
        // alert("Mật khẩu cũ phải dài hơn 6 ký tự")
        this.toastsService.alert('Thông báo !!!', 'Mật khẩu cũ phải dài hơn 6 ký tự !!!','bg-danger');
       } else if(this.changePassForm.value.newPass.length < 6){
        // alert("Mật khẩu mới phải dài hơn 6 ký tự")
        this.toastsService.alert('Thông báo !!!', 'Mật khẩu mới phải dài hơn 6 ký tự !!!','bg-danger');
       } else if(this.changePassForm.value.reNewPass.length < 6){
        // alert("Nhập lại mật khẩu phải dài hơn 6 ký tự")
        this.toastsService.alert('Thông báo !!!', 'Nhập lại mật khẩu phải dài hơn 6 ký tự !!!','bg-danger');
       }
    }

  }
}
