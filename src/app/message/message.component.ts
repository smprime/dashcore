import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  state;
  setLoop;
  constructor(public changeDetect: ChangeDetectorRef) {
    this.state = {
      priceUsd: 112.5,
      priceEur: 103.1,
      priceGbp: 97.1,
      priceBtc: 0.01,
      // encryptedPasswordHash: encryptedPasswordHash,
      // hdSeedE: hdSeedE,
      // totalBalance: totalBalance,
      // addresses: addresses.split(' '),
      // loading: false,
      // mode: this.getModeFromUrl(),
      // collapsed: window.innerWidth < 768,
      explorer: 'insight.dash.org',
    }
    this.getPrice();
  }

  ngOnInit(): void {
    this.setLoop = setInterval(() => this.getPrice(), 10000);
  }
  getPrice() {
    fetch('https://old.mydashwallet.org/getPrice', {
      mode: 'cors',
      cache: 'no-cache',
    })
      .then(response => response.json())
      .then(data => {
        this.state = {
          ...this.state,
          priceUsd: data.price_usd,
          priceEur: data.price_eur,
          priceGbp: data.price_gbp,
          priceBtc: data.price_btc,
        }
      });
  }
  showNumber(amount, decimals) {
    let result;
    switch (decimals) {
      case 3:
        result = this.setFloat(amount, 1000, decimals)
        break;
      case 4:
        result = this.setFloat(amount, 10000, decimals)
        if (result.length > 6 && amount > 0) result = result.substring(0, result.length - 1)
        break;
      case 5:
        result = this.setFloat(amount, 100000, decimals)
        if (result.length > 7 && amount > 0) result = result.substring(0, result.length - 1)
        break;
      case 6:
        result = this.setFloat(amount, 1000000, decimals)
        break;
      case 7:
        result = this.setFloat(amount, 10000000, decimals)
        break;
      case 8:
        result = this.setFloat(amount, 100000000, decimals)
        if (decimals > 2)
          for (var i = 0; i < 9; i++) {
            var isDot = result.endsWith('.')
            if (result.endsWith('0') || isDot) {
              result = result.substring(0, result.length - 1)
              if (isDot) break
            } else break
          }
        break;
      default:
        result = parseFloat(amount).toFixed(decimals)
        break;
    }
    return result

  }
  setFloat(amount, numerate, decimals) {
    return parseFloat((Math.round(amount * numerate) / numerate).toString()).toFixed(decimals);
  }
  ngOnDestroy() {
    this.setLoop = null;
  }
}
