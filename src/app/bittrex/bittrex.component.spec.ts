import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BittrexComponent } from './bittrex.component';

describe('BittrexComponent', () => {
  let component: BittrexComponent;
  let fixture: ComponentFixture<BittrexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BittrexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BittrexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
