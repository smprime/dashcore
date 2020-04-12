import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

declare var dashcore;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public network = {
    testnet: 'https://testnet-insight.dashevo.org/insight-api/addr/',
    mainnet: 'https://insight.dashevo.org/insight-api/addr/'
  }
  constructor(public http: Http) { }

  public createwif(network) {

    const privateKey = new dashcore.PrivateKey(dashcore.Networks[network]);
    let fundAddress = {
      privateKey,
      walletwif: privateKey.toWIF(),
      publicKey: new dashcore.PublicKey(privateKey, dashcore.Networks[network])
        .toAddress()
        .toString()
    };
    return fundAddress;
  }

  public getFundAddress(): string {
    return localStorage.getItem('fundAddress')
  }

  setFundAddress(fundAddress): void {

    localStorage.setItem('fundAddress', JSON.stringify(fundAddress));
  }

  public getBalance(address: string, net = 'testnet'): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.network[net] + address).subscribe(res => {
        let data = res.json();
        resolve(data);
      }, (err) => {
        reject(err);
      });
    })
  }

  public sentMessage(address: string, details: any, net = 'testnet') {

    return new Promise((resolve, reject) => {
      this.http.get(this.network[net] + address + '/utxo').subscribe(res => {
        let data = res.json();
        resolve(data);
      }, (err) => {
        reject(err);
      });
    })
  }
}
