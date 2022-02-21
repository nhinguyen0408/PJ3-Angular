import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { ApiBillService } from 'src/app/services/bill/api-bill.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(
    private api: ApiBillService
  ) { }

  ngOnInit(): void {
    this.getAllBill()
  }
  listBill: any
  bill:  any | null;
  onShow: boolean = false;
  getAllBill(){
    this.api.getBill().subscribe((res: Bill) =>{
      this.listBill = res;
    })
  }
  getDataDetail(id: number){
    this.api.getBillById(id).subscribe((res: Bill) =>{
      this.bill = res;
      this.onShow = true;
    })
  }
  onClose(){
    this.onShow = false;
    this.bill = null;
  }

}
