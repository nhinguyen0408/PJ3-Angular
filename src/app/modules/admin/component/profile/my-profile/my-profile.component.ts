import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'src/app/models/upload/FileUpload.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiProfileService } from 'src/app/services/profile/api-profile.service';
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
  ) { }
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
          console.log('this.result.url:::',this.result.url)
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
    console.log("profile update======== ", this.myProfile);
    if(window.confirm("Chắc chắn bạn muốn thực hiện thay đổi ????")){
      if(this.selectedFiles != null && this.selectedFiles != undefined){
        this.upload();
        setTimeout(()=>{
          console.log("Mydata",this.myProfile)
          this.api.updateMyProfile(this.myProfile).subscribe((data:{})=>{
            this.getMydata()
          });
        },4300)
      } else {
        this.api.updateMyProfile(this.myProfile).subscribe((data:{})=>{
          window.location.reload
        });
      }
    }
  }

  onChangePassword(){
    if(this.changePassForm.valid){
      if(this.changePassForm.value.newPass === this.changePassForm.value.reNewPass && this.changePassForm.value.newPass != this.changePassForm.value.oldPass) {
        const oldPass = this.changePassForm.value.oldPass;
        const newPass = this.changePassForm.value.newPass;
        const myId = localStorage.getItem("adminId");
        const objChangePass = {oldPass,newPass,myId}
        console.log("objChangePass===== ", objChangePass)
        this.api.updatePassword(objChangePass).subscribe(data =>{
          window.alert("Đổi mật khẩu thành công !!!!!");
          this.auth.logout();
        })
        this.changePassForm.reset()

       } else {
        alert("Mật khẩu nhập lại không trùng khớp hoặc trùng với mật khẩu cũ !!!")
       }

    } else {
      if(this.changePassForm.value.oldPass.length < 6){
        alert("Mật khẩu cũ phải dài hơn 6 ký tự")
       } else if(this.changePassForm.value.newPass.length < 6){
        alert("Mật khẩu mới phải dài hơn 6 ký tự")
       } else if(this.changePassForm.value.reNewPass.length < 6){
        alert("Nhập lại mật khẩu phải dài hơn 6 ký tự")
       }
    }

  }
}
