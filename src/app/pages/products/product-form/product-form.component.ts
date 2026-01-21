import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  @Input() visible: boolean = false;
  @Input() product: any = {};
  @Input() isEditing: boolean = false;
  @Input() loading: boolean = false;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.onCancel.emit();
  }

  save() {
    // Validação adicional antes de emitir o evento
    if (!this.product.name || !this.product.category || !this.product.reference_price) {
      return;
    }
    this.onSave.emit(this.product);
  }
}
