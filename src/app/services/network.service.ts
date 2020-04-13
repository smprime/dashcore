import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NzModalService } from 'ng-zorro-antd';

declare var dashcore;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public modal;
  public sendtransactions = [];
  public netState = 'mainnet' || 'testnet'
  public network = {
    testnet: 'https://testnet-insight.dashevo.org/insight-api/addr/',
    mainnet: 'https://insight.dashevo.org/insight-api/addr/'
  }
  constructor(public http: Http, private modalService: NzModalService) { }

  public loading(nzContent): void {

    this.modal = this.modalService.info({
      nzTitle: 'Loading Data...!!!',
      nzContent
    });
  }

  public createwif(network) {

    const privateKey = new dashcore.PrivateKey(dashcore.Networks[this.netState]);
    let fundAddress = {
      privateKey,
      walletwif: this.generateWIF(privateKey.toWIF()),
      publicKey: this.generateAddress(privateKey)
    };
    return fundAddress;
  }
  public generateWIF(Key) {
    // this.walletaddress = dashcore.PrivateKey.fromWIF(Key).toAddress(dashcore.Networks[network]).toString();
    // const privateKey =  dashcore.PrivateKey(Key);
    // return privateKey.toWIF()
    return dashcore.PrivateKey.fromWIF(Key).toAddress(dashcore.Networks[this.netState]).toString();
  }

  public generateAddress(privateKey) {
    return new dashcore.PublicKey(privateKey, dashcore.Networks[this.netState])
      .toAddress()
      .toString()
  }
  public getFundAddress(): string {

    return localStorage.getItem('fundAddress')
  }

  setFundAddress(fundAddress): void {

    localStorage.setItem('fundAddress', JSON.stringify(fundAddress));
  }

  public getBalance(address: string, net = 'testnet'): any {
    this.loading('<img src="../assets/images/dash_gif.gif" width=250>');
    return new Promise((resolve, reject) => {
      this.http.get(this.network[net] + address).subscribe(res => {
        let data = res.json();
        resolve(data);
      }, (err) => reject(err));
    })
  }

  public sentMessage(address: string, details: any, net = 'testnet') {

    return new Promise((resolve, reject) => {
      this.http.get(this.network[net] + address + '/utxo').subscribe(res => {
        let data = res.json();
        resolve(data);
      }, (err) => reject(err));
    })
  }

  public getUtxo(address: string): any {
    // this.loading('<img src="../assets/images/dash_gif.gif" width=250>');
    return new Promise((resolve, reject) => {
      this.http.get(this.network[this.netState] + address + "/utxo").subscribe(res => {
        let data = res.json();
        resolve(data);
        
      }, (err) => reject(err));
    });
  }

 async createtransaction(payload) {
    
    return await new dashcore.Transaction()
    .verify(dashcore.PrivateKey.fromWIF(payload.privatekey))
      // .from(payload.utxo)
      // .to([{ address: payload.toaddress, satoshis: payload.toamount }])
      // .fee(payload.fees)
      // .change(payload.changeaddress)
      // .sign(dashcore.PrivateKey.fromWIF(payload.privatekey))
      // // .addData('Buffer')
      // .toBuffer();
  }
  broadcast(rawtx) {

    const pushtx = {rawtx};
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const lurl = 'https://testnet-insight.dashevo.org/insight-api/tx/send';

    return new Promise((resolve, reject) => {
      this.http.post(lurl, JSON.stringify(pushtx), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          resolve(data);
        }, (err) =>  reject(err));
    });
  }
  savesendtransaction(details: any) {
    if (details != null) {
      this.sendtransactions.push(details);
      localStorage.setItem('sendtransactions', JSON.stringify(this.sendtransactions));
    }
  }
}
