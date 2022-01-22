import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/models/upload/FileUpload.model';
import { FileUploadService } from 'src/app/services/upload/file-upload.service';

declare const $: any;
@Component({
  selector: 'app-upload-example',
  templateUrl: './upload-example.component.html',
  styleUrls: ['./upload-example.component.css']
})


export class UploadExampleComponent implements OnInit, AfterViewInit {

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  constructor(private uploadService: FileUploadService) { }

  ngAfterViewInit(): void {
    $('.dropify').dropify();
    }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.currentFileUpload.name = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '') +  this.currentFileUpload.name;
        this.uploadService.pushFileToStorage(this.currentFileUpload)
      }
    }
  }

}
