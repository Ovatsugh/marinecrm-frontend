import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-clients-form',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    ButtonModule
  ],
  templateUrl: './clients-form.component.html',
  styleUrl: './clients-form.component.scss'
})
export class ClientsFormComponent {
  @Input() visible: boolean = false;
  @Input() client: any = {};
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
    if (!this.client.company_name || !this.client.contact_name || !this.client.phone) {
      return;
    }
    this.onSave.emit(this.client);
  }
}
