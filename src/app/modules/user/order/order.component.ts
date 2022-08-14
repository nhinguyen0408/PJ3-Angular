import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';
import { CartService } from 'src/app/services/user/cart/cart.service';
import { OrderService } from 'src/app/services/user/order/order.service';

const AbortType = [
  {
    value: 1,
    reason: 'Thay đổi địa chỉ giao hàng'
  },
  {
    value: 2,
    reason: 'Thay đổi số điện thoại'
  },
  {
    value: 3,
    reason: 'Đơn hàng bị trùng lặp'
  },
  {
    value: 4,
    reason: 'Muốn mua hàng trực tiếp tại shop'
  },
  {
    value: 5,
    reason: 'Khác'
  },
]
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(
    private apiOrder: OrderService,
    private toastService: ToastService,
    private apiCart: CartService
  ) { }

  ngOnInit(): void {
    this.getMyOrder()
  }

  veryfyingOrder: any[] = []
  veryfiedOrder: any[] = []
  isProcessingOrder: any[] = []
  bougthOrder: any[] = []
  abortOrder: any[] = []
  userId = localStorage.getItem('userId')
  getMyOrder = () => {
    this.apiOrder.getMyOrder(Number(this.userId)).subscribe((res: any) => {
      if(res){
        this.veryfyingOrder = res.filter((e: any) =>{ if(e.status == 'VERIFYING' || e.status == 'CANCELED_REQUEST') {return e} })
        this.veryfiedOrder = res.filter((e: any) => e.status == 'VERIFIED')
        this.isProcessingOrder = res.filter((e: any) => e.status == 'INPROGRESS')
        this.bougthOrder = res.filter((e: any) => e.status == 'COMPLETED')
        this.abortOrder = res.filter((e: any) => e.status == 'CANCELED')
        if(this.veryfyingOrder && this.veryfyingOrder.length > 0){
          this.veryfyingOrder.map((element: any, index: number) => {
            this.apiOrder.getOrderDetails(element.id).subscribe(res => {
              this.veryfyingOrder[index] = {...element, billDetail: res.billDetail}
            })
          })
        }
        console.log('this.veryfyingOrder',this.veryfyingOrder)
        if(this.veryfiedOrder && this.veryfiedOrder.length > 0){
          this.veryfiedOrder.map((element: any, index: number) => {
            this.apiOrder.getOrderDetails(element.id).subscribe(res => {
              this.veryfiedOrder[index] = {...element, billDetail: res.billDetail}
            })
          })
        }
        if(this.isProcessingOrder && this.isProcessingOrder.length > 0){
          this.isProcessingOrder.map((element: any, index: number) => {
            this.apiOrder.getOrderDetails(element.id).subscribe(res => {
              this.isProcessingOrder[index] = {...element, billDetail: res.billDetail}
            })
          })

        }
        if(this.bougthOrder && this.bougthOrder.length > 0){
          this.bougthOrder.map((element: any, index: number) => {
            this.apiOrder.getOrderDetails(element.id).subscribe(res => {
              this.bougthOrder[index] = {...element, billDetail: res.billDetail}
            })
          })

        }
        if(this.abortOrder && this.abortOrder.length > 0){
          this.abortOrder.map((element: any, index: number) => {
            this.apiOrder.getOrderDetails(element.id).subscribe(res => {
              this.abortOrder[index] = {...element, billDetail: res.billDetail}
            })
          })

        }
      }
    })
  }
  isOtherReason: boolean = false
  reason: string = ''
  resonValue: any
  onChangeReason = (e: any) => {
    this.resonValue = e.target.value
    if(this.resonValue == 5){
      this.isOtherReason = true
      this.reason = ''
    } else {
      this.isOtherReason = false
      const dataReason = AbortType.filter((e: any) => e.value == this.resonValue)
      this.reason = dataReason[0].reason
    }
  }
  billId: number | null = null;
  setBillId = (id: number) => {
    this.billId = id
  }

  requestAbortOrder = () => {
    if(this.reason == '' || this.billId == null){
      this.toastService.alert('Thông báo !!!', "Vui lòng chọn lý do hủy đơn !!!!",'bg-warning');
    } else {
    if(window.confirm('Xác nhận hủy đơn hàng này ???')){
        const data = {billId: this.billId, status: 'CANCELED_REQUEST', reason: this.reason}
        this.apiOrder.updateStatus(data).subscribe((res: any) =>{
          if(res){
            this.getMyOrder()
            this.reason = ''
            this.resonValue = null
            this.billId = null
            this.toastService.alert('Thông báo !!!', "Hủy đơn hàng thành công !!!!",'bg-success');
          }
        })
      }
    }

  }
  unAbortOrder = (id : number) => {
    if(window.confirm('Xác nhận hủy yêu cầu ???')){
      const data = {billId: id, status: 'VERIFYING'}
      this.apiOrder.updateStatus(data).subscribe((res: any) =>{
        if(res){
          this.getMyOrder()
          this.toastService.alert('Thông báo !!!', "Hủy yêu cầu thành công !!!!",'bg-success');
        }
      })
    }
  }
  revicedOrder = (id: number) => {
    if(window.confirm('Xác nhận đã nhận hàng tận tay ???')){
      const data = {billId: id, status: 'COMPLETED'}
      this.apiOrder.updateStatus(data).subscribe((res: any) =>{
        if(res){
          this.getMyOrder()
          this.toastService.alert('Thông báo !!!', "Xác nhận đã nhận hàng thành công !!!!",'bg-success');
        }
      })
    }
  }

  buyAgain = (billDetail: any[]) => {
    if(window.confirm("Thêm những sản phẩm này vào giỏ hàng ????")){
      if(billDetail && billDetail.length > 0){
        billDetail.map((e: any) => {
          this.apiCart.addToCart(e.productId, e.quantity).subscribe(res => {
            this.toastService.alert('Thông báo !!!', "Thêm sản phẩm vào giỏ hàng thành công !!!!",'bg-success')
          },
          (err:ErrorEvent) => {
            this.toastService.alert('Thông báo !!!', "Sản phẩm đã hết !!!!",'bg-warning')
          }
          )
        })
      }
    }
  }
  onClose = () =>{
    this.billId = null
  }
}
