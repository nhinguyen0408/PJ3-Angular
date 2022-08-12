import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Image } from 'src/app/models/Image.model';
import { ProductInformation } from 'src/app/models/ProductInformation.model';
import { FileUpload } from 'src/app/models/upload/FileUpload.model';
import { ApiCategoryService } from 'src/app/services/admin/category/api-category.service';
import { ApiProductService } from 'src/app/services/admin/product/api-product.service';
import { ApiProductionService } from 'src/app/services/admin/production/api-production.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { FileUploadService } from 'src/app/services/upload/file-upload.service';
declare var jQuery: any;
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})


export class EditProductComponent implements OnInit {

  constructor(
    private apiCategory: ApiCategoryService,
    private apiProduction: ApiProductionService,
    private apiProduct: ApiProductService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private uploadService: FileUploadService,
    private toastsService: ToastService,
    private location: Location
    ) { }
  isLoading: boolean = false
  aliases: any[] = []
  productInformation: any
  product: any;
  numberValidate = "^[0-9]*$"
  id = this.actRoute.snapshot.params['id']
  dataEditor = "";
  avtUrl = true;
  ngOnInit(): void {
    this.getAllCategory();
    this.getAllProduction();
    this.getById();
    // console.log("this.dataEditor oninit:::", this.dataEditor)

    (function ($) {
      $(document).ready(function(){
        $('.textarea').summernote({focus: true});
        $('.select2bs4').select2({
          theme: 'bootstrap4'
        });
        $('.toastsDefaultInfo').click(function() {
          $(document).Toasts('create', {
            class: 'bg-info',
            title: 'Đang tiến hành vui lòng đợi',
            subtitle: '',
            body: 'Updating...',
            autohide: true,
            delay: 2000
          })

        });
      });

    })(jQuery);
  }
  selectedFiles?: FileList;
  fileNamePreView: string = '';
  currentFileUpload?: FileUpload;
  percentage = 0;
  result : any;
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
        setTimeout(()=>{
          this.product.avatarUrl = this.result.url;
          // console.log('this.currentFileUpload upload:::',this.currentFileUpload)
        },4000)

      }

    }
}
selectedFilesArray: File[] = [];
imgNamePreview: string [] = []
  onFileChange(event:any) {
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                this.selectedFilesArray?.push(event.target.files[i]);
                var reader = new FileReader();

                reader.onload = (event:any) => {
                   this.imgNamePreview.push(event.target.result);
                }

                reader.readAsDataURL(event.target.files[i]);
        }
    }
  }
  setNewAvatarOpen(){
    this.avtUrl = false

  }
  setNewAvatarClose(){
    this.avtUrl = true
  }
  setOpenUploadFormToMoreImage = false;
  buttonName = "Thêm ảnh";
  uploadNewImage(){
    if(this.setOpenUploadFormToMoreImage == false){
      this.setOpenUploadFormToMoreImage = true;
      this.buttonName = "Hủy"
    } else {
      this.setOpenUploadFormToMoreImage = false;
      this.buttonName = "Thêm ảnh";
      this.selectedFilesArray= [];
      this.imgNamePreview = []
    }

  }
  resultMul: any [] = [];
  async uploadMultiple(){
    if(this.selectedFilesArray.length > 0){
      for(let i = 0; i < this.selectedFilesArray.length; i++){
        const files: File | null = this.selectedFilesArray[i];
        if(files){
          let newFileUpload = new FileUpload(files);
          const fileName = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
          newFileUpload.name = fileName;
          // const resultOfUpload = null;
          // this.resultMul = await this.uploadService.pushFileToStorage(newFileUpload)
          this.resultMul[i] = await this.uploadService.pushFileToStorage(newFileUpload)
        }
      }
      setTimeout(()=>{
        for(let i = 0; i < this.resultMul.length; i++){
          const image = new Image();
          image.imageUrl = this.resultMul[i].url;
          this.product.listImage.push(image);
        }
        // this.resultMul = {};
      },4500 + 200*(this.selectedFilesArray.length))

    }
  }

  getById(){
    this.apiProduct.getById(this.id).subscribe((res: any) => {
      this.product = res;
      this.listImg = this.product.listImage
      this.aliases = res.listInformation;
      this.dataEditor = res.description;
      this.editEditor(this.dataEditor);
      // console.log(this.product);
    })


  }
  listImg: Image[] = []
  deleteImageInformation(id: number | null){
    if(id){
      if(window.confirm("Bạn có chắc muốn xóa hình ảnh này !!!!! \nSau khi xóa sẽ không thể hoàn tác lại !!!")){
        this.apiProduct.deleteImageInformation(id).subscribe(res => {
          this.toastsService.alert('Thông báo !!!', 'Xóa ảnh mô tả sản phẩm thành công!!!','bg-success');
        })
        const index = this.listImg.findIndex(x => x.id === id)
        this.listImg.splice(index,1);

      }
    }

  }

  addAlias() {
    this.product.listInformation = this.aliases
    let productInfor = { productId: 0, key:'', value:''};
    // console.log("this.prduct", this.product)
    // console.log("this.aliases[0].productId", this.aliases[0].productId)
    productInfor.productId = this.product.id;
    this.aliases.push(productInfor);
  }
  deleteAlias(index: number){
    if(window.confirm("Bạn có chắc chắn muốn xóa đặc tính này !!!!! \nSau khi thay đổi sẽ không thể hoàn tác !!!")){
      // console.log(this.aliases[index])
      // console.log(index)
      if(this.aliases[index].id){
        this.apiProduct.deleteProductInformation(this.aliases[index].id).subscribe(res => {
          this.toastsService.alert('Thông báo !!!', 'Xóa thuộc tính thành công!!!','bg-success');
        });
      }
      this.aliases.splice(index,1);
    }

  }

  //Get data Production
  productionList : any;
  getAllProduction(){
    this.apiProduction.getProductionEnable().subscribe((res: any) => {
      this.productionList = res
    })
  }
  //Get data Category
  categoryList : any;
  getAllCategory(){
    this.apiCategory.getCategoryEnable().subscribe((res: any) => {
      this.categoryList = res
    })
  }
  open= false;
  editEditor(dataa: string){
    (function ($) {
      let se = $('#textareaInput').summernote('code',dataa)
    })(jQuery);
  }
  $: any;
  onSubmit(){
    this.isLoading = true
    if(window.confirm("Bạn có muốn thực thi những thay đổi??? Xác Nhận::::")){
      let categoryId = (function ($) {
        let se = $('#category').select2('data')[0]
        return se.id
      })(jQuery);
      let productionId = (function ($) {
          let se = $('#production').select2('data')[0]
          return se.id
      })(jQuery);

      let data = (function ($){
          let data = $('#textareaInput').summernote('code').toString();

          return data
      })(jQuery);

      this.product.description = data ;
      this.product.categoryId = Number(categoryId);
      this.product.productionId = Number(productionId);
      this.product.listInformation = this.aliases;
      this.product.modifiedBy = Number(localStorage.getItem("adminId"));
      if(this.product.name == ''
      || this.product.categoryId == 0 || this.product.productionId == 0 ){
        this.toastsService.alert('Thông báo !!!', 'Vui lòng điền đầy đủ các trường thông tin!!!','bg-warning');
      }else {
        if(this.aliases.length > 0){
        this.aliases.forEach(element => {
          if(element.key == '' || element.value == ''){
            // alert("Vui lòng điền đủ trường thông tin Đặc điểm!!!")
            this.toastsService.alert('Thông báo !!!', 'Vui lòng điền đủ trường thông tin Đặc điểm!!!','bg-warning');
          }
        });



        }
        if(this.avtUrl == false){
          this.product.avatarUrl = "";
          this.upload()
          if(this.selectedFilesArray.length > 0){
            this.uploadMultiple()
          }
          setTimeout(()=>{
            this.apiProduct.editProduct(this.product).subscribe((data: {})=>{
              this.toastsService.alert('Thông báo !!!', 'Sửa sản phẩm thành công!!!','bg-success');
              this.isLoading = false;
              this.route.navigate(['/admin/product/details/'+ this.product.id])
            })
          }, 5000)

        } else {
          if(this.selectedFilesArray.length > 0){
            this.uploadMultiple()
            setTimeout(()=>{
              this.apiProduct.editProduct(this.product).subscribe((data: {})=>{
                this.toastsService.alert('Thông báo !!!', 'Sửa sản phẩm thành công!!!','bg-success');
                this.isLoading = false;
                this.route.navigate(['/admin/product/details/'+ this.product.id])
              })
            }, 5000)
          } else {
            this.apiProduct.editProduct(this.product).subscribe((data: {})=>{
              this.toastsService.alert('Thông báo !!!', 'Sửa sản phẩm thành công!!!','bg-success');
              this.isLoading = false;
              this.route.navigate(['/admin/product/details/'+ this.product.id])
            })
          }

        }

      }
    }

  }
  back(){
    this.location.back();
  }

}
