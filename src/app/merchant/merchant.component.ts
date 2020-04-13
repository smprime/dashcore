import { Component, OnInit, Input } from '@angular/core';
import _Crypttp from 'crypttp';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  @Input() buttonText: string;
  @Input() buttonColor: string;
  @Input() buttonWidth: string;
  @Input() type: string;
  @Input() merchant_id: string;
  @Input() country_currency: string;
  @Input() currency: string;
  @Input() amount: string;
  @Input() payload: string;
  @Input() memo: string;
  @Input() onsuccess: string;
  @Input() onerror: string;

  display_loader: string;
  crypttp: _Crypttp;
  title = 'crypttp-angular';
  finalButtonColor: string;
  fontColor = "#FFF";
  finalButtonText: string;
  image: string;

  constructor() {
    this.crypttp = new _Crypttp();
    this.displayLoader();
  }

  ngOnInit() {
    this.finalButtonText = (!this.buttonText || typeof this.buttonText == "undefined") ? "Instant payment" : this.buttonText

    if (typeof this.buttonColor != 'undefined')
      if (parseInt(this.buttonColor.split('#')[1], 16) > 13224393) {
        this.finalButtonColor = this.buttonColor
        this.fontColor = "#000"
        this.image = "https://i.imgur.com/RZJ1r6X.png"
      }
      else {
        this.finalButtonColor = this.buttonColor
        this.image = "https://i.imgur.com/gtOApwq.png"
      }
  }

  proceedCheckout() {
    this.displayLoader()

    let orderDetails = {
      type: this.type,
      merchant_id: this.merchant_id,
      country_currency: this.country_currency,
      currency: this.currency,
      amount: this.amount,
      payload: this.payload,
      memo: this.memo,
      onsuccess: this.onsuccess,
      onerror: this.onerror
    }

    this.crypttp.pay(orderDetails)

    setTimeout(() => {
      this.displayLoader()
    }, 1500)
  }

  displayLoader() {
    if (this.display_loader == "none")
      this.display_loader = "block"

    else
      this.display_loader = "none"
  }
}
