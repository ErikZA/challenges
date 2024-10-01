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
  public form = new FormGroup({
    search: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  @Output() private onSearch = new EventEmitter();

  constructor() {
    this.clearSpacesIfMoreThanOne();
  }

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

  public get formHasError() {
    return (
      (this.form.controls.search.hasError('minlength') &&
        this.form.controls.search.touched) ||
      (this.form.controls.search.hasError('required') &&
        this.form.controls.search.touched)
    );
  }

  private clearSpacesIfMoreThanOne() {
    this.form.controls.search.valueChanges.subscribe(src => {
      const newValue = src?.replace(/\s{2,}/g, ' ').replace(/^\s/, '') || '';

      this.form.controls.search.setValue(newValue, { emitEvent: false });
      this.onSearch.emit({ search: newValue });
    });
  }
}
