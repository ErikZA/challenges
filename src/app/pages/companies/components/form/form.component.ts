import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  @Output() private onSearch = new EventEmitter();

  public form = new FormGroup({
    search: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  public submit() {
    if (this.form.valid) {
      this.onSearch.emit(this.form.value);
    }
  }

  public get hasError() {
    return (
      (!!this.form.controls.search.getError('required') &&
        this.form.controls.search.touched) ||
      this.form.controls.search.getError('minlength')
    );
  }
}
