import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductInformation } from 'src/app/models/ProductInformation.model';
import { FileUpload } from 'src/app/models/upload/FileUpload.model';
import { ApiCategoryService } from 'src/app/services/category/api-category.service';
import { ApiProductService } from 'src/app/services/product/api-product.service';
import { ApiProductionService } from 'src/app/services/production/api-production.service';
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
    private uploadService: FileUploadService
    ) { }

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
        })
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
        console.log('result:::',this.result)
        setTimeout(()=>{
          this.product.avatarUrl = this.result.url;
          console.log('this.product.avatarUrl upload:::',this.product.avatarUrl)
          // console.log('this.currentFileUpload upload:::',this.currentFileUpload)
        },4000)

      }

    }
}

  setNewAvatarOpen(){
    console.log("avtURL:::", this.avtUrl)
    this.avtUrl = false

  }
  setNewAvatarClose(){
    console.log("avtURL:::", this.avtUrl)
    this.avtUrl = true
  }

  getById(){
    this.apiProduct.getById(this.id).subscribe((res: any) => {
      this.product = res;
      this.aliases = res.listInformation;
      this.dataEditor = res.description;
      console.log("aliases:::", this.aliases)
      console.log("dataEditor:::", this.dataEditor)
      this.editEditor(this.dataEditor);
    })
    console.log(this.product);

  }

  addAlias() {
    this.product.listInformation = this.aliases
    console.log("this.product.listInformation::::", this.product.listInformation)
    let productInfor = { productId: 0, key:'', value:''};
    productInfor.productId = this.aliases[0].productId;
    this.aliases.push(productInfor);
  }
  deleteAlias(index: number){
    this.aliases.splice(index,1)
  }

  //Get data Production
  productionList : any;
  getAllProduction(){
    this.apiProduction.getProduction().subscribe((res: any) => {
      this.productionList = res
    })
  }
  //Get data Category
  categoryList : any;
  getAllCategory(){
    this.apiCategory.getCategory().subscribe((res: any) => {
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
    if(window.confirm("Bạn có muốn thực thi những thay đổi??? Xác Nhận::::")){
      let categoryId = (function ($) {
        let se = $('#category').select2('data')[0]
        console.log("selected category: ", se.id)
        return se.id
      })(jQuery);
      let productionId = (function ($) {
          let se = $('#production').select2('data')[0]
          console.log("selected category: ", se.id)
          return se.id
      })(jQuery);

      let data = (function ($){
          let data = $('#textareaInput').summernote('code').toString();
          console.log("selected: ", data)

          return data
      })(jQuery);
      console.log("data: ", data)

      this.product.description = data ;
      this.product.categoryId = Number(categoryId);
      this.product.productionId = Number(productionId);
      this.product.listInformation = this.aliases
      if(this.product.name == ''
      || this.product.categoryId == 0 || this.product.productionId == 0 || this.product.quantity == 0  || this.product.avatarUrl == '' ){
        alert("Vui lòng điền đầy đủ các trường thông tin")
      }else {
        if(this.aliases.length > 0){
        this.aliases.forEach(element => {
          if(element.key == '' || element.value == ''){
            alert("Vui lòng điền đủ trường thông tin Đặc điểm!!!")
          }
        });



        }
        if(this.avtUrl == false){
          this.product.avatarUrl = "";
          this.upload()
          setTimeout(()=>{
            console.log(this.product);
            this.apiProduct.editProduct(this.product).subscribe((data: {})=>{
              this.route.navigate(['/admin/product/details/'+ this.product.id])
            })
          }, 4100)

        } else {
          console.log(this.product);
          this.apiProduct.editProduct(this.product).subscribe((data: {})=>{
            this.route.navigate(['/admin/product/details/'+ this.product.id])
          })
        }

      }
    }

  }

}
