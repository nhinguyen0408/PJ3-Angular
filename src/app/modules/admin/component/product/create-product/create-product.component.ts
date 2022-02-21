import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { Image } from 'src/app/models/Image.model';
import { Product } from 'src/app/models/Product.model';
import { ProductInformation } from 'src/app/models/ProductInformation.model';
import { Production } from 'src/app/models/Production.model';
import { FileUpload } from 'src/app/models/upload/FileUpload.model';
import { ApiCategoryService } from 'src/app/services/category/api-category.service';
import { ApiProductService } from 'src/app/services/product/api-product.service';
import { ApiProductionService } from 'src/app/services/production/api-production.service';
import { FileUploadService } from 'src/app/services/upload/file-upload.service';
import { __await } from 'tslib';
// import ClassicEditor from 'node_modules/ckeditor5-build-classic';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var jQuery: any;
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  @Input() product = new Product()
  constructor(
    private apiCategory: ApiCategoryService,
    private apiProduction: ApiProductionService,
    private apiProduct: ApiProductService,
    private route: Router,
    private uploadService: FileUploadService
    ) { }

  aliases: ProductInformation[] = []
  productInformation: any
  numberValidate = "^[0-9]*$"
  // Editor = ClassicEditor
  ngOnInit(): void {
    this.getAllCategory();
    this.getAllProduction();
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
            delay: 2500
          })
        });
      });
    })(jQuery);
  }
  //UPLAOD FILE
  selectedFiles?: FileList;
  selectedFilesArray: File[] = [];
  currentFileUpload?: FileUpload;
  currentFileUploadArray: FileUpload[] = [];
  percentage = 0;
  result : any;
  resultMul : any [] = [];
  fileNamePreView: string = '';
  imgNamePreview: string [] = []
  listImage: Image [] = []
  image: Image = new Image();
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
        console.log(" this.selectedFilesArray ====", this.selectedFilesArray)
    }
  }
  async uploadMultiple(){
    if(this.selectedFilesArray.length > 0){
      for(let i = 0; i < this.selectedFilesArray.length; i++){
        const files: File | null = this.selectedFilesArray[i];
        if(files){
          let newFileUpload = new FileUpload(files);
          console.log('newFileUpload=====================', newFileUpload)
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
          console.log('this.image' + i ,image)
          this.listImage.push(image);
          console.log('this.listImage:::',this.listImage)
          console.log('this.product.avatarUrl upload:::' + i ,this.resultMul[i].url)
        }
        // this.resultMul = {};
      },4000)

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
            this.product.avatarUrl = this.result.url;
            console.log('this.product.avatarUrl upload:::',this.product.avatarUrl)
          },4000)

        }
      }

  }
  addAlias() {
    this.product.listInformation = this.aliases
    let productInfor = new ProductInformation();
    this.aliases.push(productInfor);
  }
  deleteAlias(index: number){
    this.aliases.splice(index,1)
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
  $: any;
  onSubmit(){
    let categoryId = (function ($) {
      let se = $('#category').select2('data')[0]
      // console.log("selected category: ", se.id)
      return se.id
    })(jQuery);
    let productionId = (function ($) {
        let se = $('#production').select2('data')[0]
        // console.log("selected category: ", se.id)
        return se.id
    })(jQuery);

    let data = (function ($){
        let data = $('#textareaInput').summernote('code').toString();
        // console.log("selected: ", data)

        return data
    })(jQuery);
    // console.log("data: ", data)

    this.product.description = data ;
    this.product.categoryId = Number(categoryId);
    this.product.productionId = Number(productionId);
    this.product.listInformation = this.aliases;
    this.product.createdBy = Number(localStorage.getItem("adminId"));
    this.product.modifiedBy = Number(localStorage.getItem("adminId"));
    if(this.product.name == '' || this.product.description == '<p><br></p>'
    || this.product.categoryId == 0|| this.product.productionId == 0  || this.product.quantity == 0  ){
      alert("Vui lòng điền đầy đủ các trường thông tin")
    }else {
      if(this.aliases.length > 0){
      this.aliases.forEach(element => {
        if(element.key == '' || element.value == ''){
          alert("Vui lòng điền đủ trường thông tin Đặc điểm!!!")
        }
      });
      this.upload()

      this.uploadMultiple()

      // console.log(this.product);
      setTimeout(()=>{
        this.product.listImage = this.listImage;
        this.apiProduct.createProduct(this.product).subscribe((data:{})=>{
        console.log(this.product)
        this.route.navigate(['/admin/product'])
      })
      },4100)

      }
    }
  }
}
