import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/Profile.model';
import { ApiProfileService } from 'src/app/services/admin/profile/api-profile.service';

declare var jQuery: any;
@Component({
  selector: 'app-employee-manager',
  templateUrl: './employee-manager.component.html',
  styleUrls: ['./employee-manager.component.css']
})
export class EmployeeManagerComponent implements OnInit, AfterViewInit {

  constructor(
    private api: ApiProfileService,
  ) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }
  ngOnInit(): void {
    console.log('idAdmin', this.idAdmin);

    this.getAllProfile();
  }
  listProfile: Profile[] = []
  idAdmin: any = localStorage.getItem("adminId")

  getAllProfile(){
    this.api.getProfile('EMPLOYEE,SUPERADMIN').subscribe((data: any)=>{
      this.listProfile = data
    })
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
