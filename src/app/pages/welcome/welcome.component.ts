import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { NetworkService } from 'src/app/services/network.service';
let netState = 'testnet' || 'mainnet'
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
  public walletData: any;
  public walletBalance: string = '';
  public walletaddress: string = '';
  public walletwif: string = '';
  public toaddress: string;
  public toamount: number;
  public transactions: any;
  public fileUploaded: any;
  public receivedmessages = [];
  public whichsegment = "receive";
  public network = {
    testnet: 'https://testnet-insight.dashevo.org/insight-api/addr/',
    insight: 'https://insight.dashevo.org/insight-api/addr/'
  }
  public showQR = false;
  public fileID: string = '';
  public fileList = [];
  constructor(public networkService: NetworkService, private modalService: NzModalService) { }

  liveNet(){
    switch (netState) {
      case 'testnet':
        netState = 'mainnet'
        break;
      default:
        netState = 'testnet'
        break;
    }
    console.log(netState)
  }
  ngOnInit(): void {

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
  }
  getAddress(){
    this.setFundAddress(this.networkService.createwif(netState))
  }

  setFundAddress(fundAddress): void {
    this.networkService.setFundAddress(fundAddress);
    this.walletwif =  fundAddress.walletwif;
    this.walletaddress = fundAddress.publicKey;
    if (this.walletaddress) {
      this.process.home.state = 'finished';
    }
  }

  gettestnetbalance(): void {
    if(this.walletaddress){
    this.loading('<img src="../assets/images/dash_gif.gif" width=250>');
    (!this.walletaddress) ?
      this.loading(`${netState}: Address empty`) :
      this.networkService.getBalance(this.walletaddress, netState).then((data: any) => {
        this.process.address.state = 'finished';
        this.walletData = data;
        (this.walletData != null) ?
          this.walletBalance = this.walletData.balance : this.loading('Query failed');
        this.modal.destroy()
      }, (err) => {
        this.loading('Query failed')
      });
    } else {
      this.loading("Please Create a Wallet!!"); 
    }
  }

  loading(nzContent): void {

    this.modal = this.modalService.info({
      nzTitle: 'Loading Data...!!!',
      nzContent
    });
  }

  public createQR(): void {
    if (this.walletBalance === '') {
      this.loading("Please request balance");
    } else {
      this.showQR = !this.showQR;
      this.process.qrcode.state = 'finished';
    }
  }

  sendMessage() {
    if(this.walletaddress){
      this.networkService.sentMessage(this.walletaddress, this.revertible, netState).then((data: any) => {
        if (data != null) {
          console.log({ data })
          this.transactions = data;
          this.exportJson()
        }
        else {
          alert("Consume failed");
        }
      }, (err) => {
        alert(err)
      });
    } else {
      this.loading("Please create a Wallet!!");
    }
    
  }

  public getFiles(info: any) {
    if (info.file.status === 'uploading') {
      this.loading('<img src="../assets/images/dash_gif.gif" width=250>');
    }
    if (info.file.status = 'done') {
      this.modal.destroy();
    }
  }

  customRequest = (req: any) => {
    const { file } = req;
    try {
      const readFile = new FileReader();
      readFile.readAsText(file, "UTF-8");
      readFile.onload = (e) => {  
       console.log(readFile.result)
        this.setFundAddress(JSON.parse(readFile.result.toString()))
      }
    } catch (e){
      this.loading(e);
    }
    
  }
  beforeUpload = (file) => {
    const isLt512M = file.size / 1024 / 1024 < 512;
    if (!isLt512M) {
      this.loading('File must smaller than 512 MB');
    }
    return isLt512M;
  }

  exportJson(): void {
    const fundAddress = this.networkService.getFundAddress();
    if(fundAddress){
      const file = new Blob([fundAddress], { type: 'text/json' });
      this.fileID = `file${ + new Date() }.json`;
      this.download(file, this.fileID);
    } else {
      this.loading("Please create a Wallet!!");
    }
  }
  async download(blob, filename) {
    this.loading('<img src="../assets/images/dash_gif.gif" width=250>');
    if (window.navigator.msSaveOrOpenBlob) // IE10+
      await window.navigator.msSaveOrOpenBlob(blob, filename);
    else { // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
    this.process.iconTemplate.state = 'finished';
    this.modal.destroy();
  }
}
