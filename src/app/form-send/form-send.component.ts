import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-form-send',
  templateUrl: './form-send.component.html',
  styleUrls: ['./form-send.component.scss']
})
export class FormSendComponent implements OnInit {
  public process: any;
  public wallet: any;
  public walletData: any;
  public walletBalance: string = '';
  public walletaddress: string = '';
  public walletwif: string = '';
  public dataForm: FormGroup;
  public validateForm: FormGroup;

  constructor(private fb: FormBuilder, public networkService: NetworkService) { }
  ngOnInit(): void {
    this.wallet = {
      "privateKey":
      {
        "bn": "b0e0dcde3d0a3ea5b25ac4876c73ce3bc4b9a4f3deaeb4d3b024c7fb6f73a616",
        "compressed": true,
        "network": "livenet"
      },
      "walletwif": "XHDTgnjnVUtBMkr3jWfNXquiBMmqYUXHNr2LstwRPMu6j57y8XYR",
      "publicKey": "Xhzm3LZDHewNScg2q44b1a9MTbSKyPTGQC"
    }
    this.setProcess();
    this.setFundAddress(this.wallet);
    this.validateForm = this.fb.group({
      walletwif: [this.walletwif, [Validators.required]],
      balance: [this.walletBalance, [Validators.required]],
      amount: ['', [Validators.required]],
      genAddress: ['', [Validators.required]]
    });
    this.dataForm = this.fb.group({
      walletwif: [this.walletwif, [Validators.required]],
      balance: [this.walletBalance, [Validators.required]],
      amount: ['', [Validators.required]],
      genAddress: ['', [Validators.required]]
    });
  }

  getbalance(): void {
    if (this.walletaddress) {
      (!this.walletaddress) ?
        this.networkService.loading(`${this.networkService.netState}: Address empty`) :
        this.networkService.getBalance(this.walletaddress, this.networkService.netState).then((data: any) => {
          this.process.address.state = 'finished';
          this.walletData = data;
          this.validateForm.patchValue({
            walletwif: this.walletwif,
            balance: this.walletData.balance
          });
          (this.walletData != null) ?
            this.walletBalance = this.walletData.balance : this.networkService.loading('Query failed');
          this.senddirectpayment()
          this.networkService.modal.destroy()
        }, (err) => {
          this.networkService.loading('Query failed')
        });
    } else {
      this.networkService.loading("Please Create a Wallet!!");
    }
  }
  setFundAddress(fundAddress): void {
    this.networkService.setFundAddress(fundAddress);
    this.walletwif = fundAddress.walletwif;
    this.walletaddress = fundAddress.publicKey;
    if (this.walletaddress) {
      this.process.home.state = 'finished';
    }
  }
  generateAddress() {
    const genAddress = this.networkService.generateWIF(this.wallet.walletwif);
    this.dataForm.patchValue({ genAddress });
    this.validateForm.patchValue({ genAddress });
  }

  submitForm(value: any): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }
  resetData(e: MouseEvent): void {
    e.preventDefault();
    this.dataForm.reset();
    for (const key in this.dataForm.controls) {
      this.dataForm.controls[key].markAsPristine();
      this.dataForm.controls[key].updateValueAndValidity();
    }
    this.resetForm(e);
    this.setProcess();
  }
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  setProcess() {
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
      }
    }
  }
  async senddirectpayment() {
    const fees = 15000;
    await this.generateAddress();
    const changeaddress = this.walletaddress
    this.networkService.getUtxo(changeaddress).then(async (utxo: any) => {
      const payload = {
        utxo,
        fees,
        changeaddress,
        privatekey: this.validateForm.controls['genAddress'].value,
        toaddress: this.validateForm.controls['genAddress'].value,
        toamount: Number(this.validateForm.controls['amount'].value)
      }
      const tx = await this.networkService.createtransaction(payload);
      console.log('this.validateForm.controls:', tx)
      // this.networkService.broadcast(tx.toString('hex')).then((res: any) => {
      //      if(res) {
      //        this.txid = res.txid;
      //        var trandata = {
      //            txid: this.txid,
      //            fromaddress: this.walletaddress,
      //            toaddress: this.toaddress,
      //            amount: Number(this.toamount),
      //            fees: fees
      //        };

      //       this.networkService.savesendtransaction(trandata);

      //      }
      //    });
      this.networkService.modal.destroy();

    });
    this.networkService.modal.destroy();
  }
}
