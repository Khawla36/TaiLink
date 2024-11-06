import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface DialogData {
  countryId: number;
  countryName: string;
}

@Component({
  selector: 'app-add-city-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-city-dialog.component.html',
  styleUrls: ['./add-city-dialog.component.scss']
})
export class AddCityDialogComponent {
  cityForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {countryId:number,countryName:string}
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.cityForm = this.fb.group({
      cityName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\u0590-\u05FF\s-]+$/) 
      ]]
    });
  }

  onSubmit(): void {
    
    if (this.cityForm.valid) {
      this.dialogRef.close({
        name: this.cityForm.value.cityName,
        countryId: this.data.countryId
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get cityNameControl() {
    return this.cityForm.get('cityName');
  }
}