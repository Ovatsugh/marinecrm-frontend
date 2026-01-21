import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-sales-form',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    ButtonModule,
    Select,
    InputNumberModule,
    DatePicker
  ],
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss'
})
export class SalesFormComponent {
  @Input() visible: boolean = false;
  @Input() sale: any = {};
  @Input() customers: any[] = [];
  @Input() products: any[] = [];
  @Input() isEditing: boolean = false;
  @Input() loading: boolean = false;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  stageOptions = [
    { label: 'Prospecção', value: 'prospecção' },
    { label: 'Negociação', value: 'negociação' },
    { label: 'Fechada', value: 'fechada' },
    { label: 'Perdida', value: 'perdida' }
  ];

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.onCancel.emit();
  }

  save() {
    // Validação adicional antes de emitir o evento
    if (!this.sale.customer_id || !this.sale.product_id || !this.sale.amount || !this.sale.stage) {
      return;
    }
    this.onSave.emit(this.sale);
  }
}
