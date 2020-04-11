import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NzModalService } from 'ng-zorro-antd';

declare var dashcore;
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public process;
  public modal: any;
  public revertible: any;
  public transacted: any;
  public walletBalance = '';
  public walletaddress: any;
  public walletwif: string = '';
  public toaddress: string;
  public toamount: number;
  public receivedmessages = [];
  public whichsegment = "receive";
  public network = {
    testnet: 'https://testnet-insight.dashevo.org/insight-api/addr/',
    insight: 'https://insight.dashevo.org/insight-api/addr/'
  }
  public showQR = false;

  constructor(public http: Http, private modalService: NzModalService) { }

  ngOnInit() {

    this.process = {
      home: {
        state: 'wait',
        icon: 'home'
      },
      address: {
        state: 'wait',
        icon: 'money-collect'
      },
      qrcode: {
        state: 'wait',
        icon: 'qrcode'
      },
      iconTemplate: {
        state: 'wait',
        icon: 'file-done'
      },
    }

    this.transacted = {
      "txid": "",
      "amount": "",
      "fromaddress": "",
      "toaddress": "",
    };

    this.revertible = {
      "message": "",
      "pin": "",
      "address": "",
      "target": "",
      "network": "",
      "type": "BLUE011",
    };
    // let privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
    // this.createwif()
  }
  createwif() {

    const PrivateKey = dashcore.PrivateKey;
    const privateKey = new PrivateKey();
    this.walletwif = privateKey.toWIF();

    if (this.walletwif) {
      this.wiftoaddress();
      this.process.home.state = 'finished';
    }
    console.log('this.walletaddress:', this.walletaddress)
  }
  wiftoaddress() {

    this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif).toAddress(dashcore.Networks.testnet).toString();
  }

  savewif() {

    this.wiftoaddress();
    localStorage.setItem('walletwif', this.walletwif);
  }

  loadwalletwif() {
    this.walletwif = localStorage.getItem('walletwif');
    this.wiftoaddress();
  }
  gettestnetbalance() {

    (!this.walletaddress) ?
      this.loading("Testnet address empty") :
      this.getBalance(this.walletaddress, "testnet").then((data: any) => {
        this.process.address.state = 'finished';
        (data != null) ?
          this.walletBalance = data.balance :
          this.loading('Query failed');
        this.modal.destroy()
      }, (err) => {
        this.loading(err.message)
      });
  }
  getBalance(address: string, net = 'testnet'): any {
    this.loading('<img src="../assets/images/dash_gif.gif" width=250>')
    return new Promise((resolve, reject) => {
      this.http.get(this.network[net] + address).subscribe(res => {
        let data = res.json();
        resolve(data);
      }, (err) => {
        reject(err);
      });
    })
  }

  loading(nzContent): void {
    this.modal = this.modalService.info({
      nzTitle: 'Loading Data...!!!',
      nzContent
    });
  }

  public createQR() {
    if(this.walletBalance ==='') {
      this.loading("Please request balance");
    } else {
      this.showQR = !this.showQR;
      this.process.qrcode.state = 'finished';
    }
  }
}
