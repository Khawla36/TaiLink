import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { userService } from '../../services/user.service';
import { AddressComponent } from '../user-form/address/address.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Address } from '../../models/address';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    MatDividerModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    AddressComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class AddUserComponent {
  userForm!: FormGroup;
  addresses: any[] = [{}];
  isSubmitting = false;

  constructor(private fb: FormBuilder, private userService: userService) {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      birthdate: ['', Validators.required],
    });
  }

  addAddress() {//add new address form
    this.addresses = [...this.addresses, {}];
  }

  onAddressesChange(newAddresses: Address[]): void {//Receives the data from the address component and then adds it to the new array
    this.addresses = newAddresses;
  }

  isFormValid(): boolean {
    return this.userForm.valid && this.addresses.length > 0;
  }

  onRemoveAddress(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.splice(index, 1);
    }
  }

  // Handles the form submission process, including form validation, data preparation,
  // and sending user data to the service.
  async onSubmit(): Promise<void> {
    if (this.isFormValid() && !this.isSubmitting) {
      try {
        this.isSubmitting = true;
        const userData: User = {
          ...this.userForm.value,
          addresses: this.addresses,
        };
        await this.userService.addUser(userData).toPromise();
        this.userForm.reset();
        this.addresses = [{}];
      } catch (error) {
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  // Provides easy access to the 'name' form control, allowing for validation and value retrieval.
  get nameControl() {
    return this.userForm.get('name');
  }

  // Provides easy access to the 'birthdate' form control, allowing for validation and value retrieval.
  get birthdateControl() {
    return this.userForm.get('birthdate');
  }


}
