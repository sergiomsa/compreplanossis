import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-boleto-popup',
  templateUrl: './boleto-popup.component.html'
})
export class BoletoPopupComponent implements OnInit {

  public payment_link: string;
  public messages 		  = { emptyMessage: 'Nenhum registro', loadingMessage: 'Carregando', totalMessage: 'registro(s)', selectedMessage: 'selecionado(s)' };
  constructor(
    @Inject(MAT_DIALOG_DATA) public paymentlink: any,
    public dialogRef: MatDialogRef<BoletoPopupComponent>,
  ) {}

  ngOnInit() 
  {
    this.payment_link = this.paymentlink;
  }

}
