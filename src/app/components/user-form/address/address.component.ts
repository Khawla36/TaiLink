// address.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LocationService } from '../../../services/location.service';
import { Address } from '../../../models/address';
import { Country } from '../../../models/country';
import { City } from '../../../models/city';
import { AddCityDialogComponent } from '../../add-city-dialog/add-city-dialog.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
 @Input() address: Address[] = []; // Input property: receives an array of Address objects from the parent component.
 @Output() addressChange = new EventEmitter<Address[]>(); // Output property: emits an event with an updated array of Address objects to notify the parent component of changes.
 @Output() remove = new EventEmitter<void>(); // Output property: emits an event without any data to signal the parent component to remove an address.


  addressForm!: FormGroup;
  cities: City[] = [];
  countries: Country[] = [];

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private dialog: MatDialog,
  ) {
    this.initForm();
    this.loadCountries();
  }

  private initForm(): void {
    this.addressForm = this.fb.group({
      name: ['', [Validators.required]],
      country: [''],
      city: [''],
      street: ['', [Validators.required]],
    });

    this.addressForm.get('country')?.valueChanges.subscribe((countryId) => {//  // Subscribes to changes in the 'country' dropdown and loads cities when a new country is selected.

      if (countryId) {
        this.loadCities(countryId);
      }
    });
  }


  // Fetches the list of countries and, if available, sets the first country as the default.
  // Then, it loads the cities for the selected country.
  private loadCountries(): void {
    this.locationService.getCountries().subscribe({
      next: (countries: Country[]) => {
        this.countries = countries;
        if (countries.length > 0) {
          const firstCountry = countries[0];
          this.addressForm.patchValue({ country: firstCountry.id });
          this.loadCities(firstCountry.id);
        }
      },
      error: (error) => console.error('Error loading countries:', error),
    });
  }

  // Fetches the list of cities based on the selected country ID and updates the form's city field.
  private loadCities(countryId: number): void {
    this.locationService.getCitiesByCountryId(countryId).subscribe({
      next: (cities: City[]) => {
        this.cities = cities;
        this.addressForm.patchValue({ city: '' });
      },
      error: (error) => console.error('Error loading cities:', error),
    });
  }

  // Adds a new address to the list if the form is valid, then emits the updated address list.
  onAddAddress(): void {
    if (this.addressForm.valid) {
      const formValue = this.addressForm.value;
      const country = this.countries.find((c) => c.id === formValue.country);

      const newAddress: Address = {
        name: formValue.name,
        country: country?.name || '',
        city: formValue.city,
        street: formValue.street,
      };

      this.address = [...this.address, newAddress];
      this.addressChange.emit(this.address);

 
    }
  }

  // Emits an event to remove the current address.
  onRemoveAddress(): void {
    this.remove.emit();
  }


  // Opens a dialog for adding a new city and, if successful, updates the list of cities with the newly added city.
  openAddCityDialog(): void {
    const selectedCountryId = this.addressForm.get('country')?.value;
    const selectedCountry = this.countries.find(
      (c) => c.id === selectedCountryId,
    );

    if (selectedCountry) {
      const dialogRef = this.dialog.open(AddCityDialogComponent, {
        width: '400px',
        data: {
          countryId: selectedCountry.id,
          countryName: selectedCountry.name,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.locationService
            .addCity({
              name: result.name,
              countryId: result.countryId,
            })
            .subscribe({
              next: () => {
                this.loadCities(selectedCountryId);
                this.addressForm.patchValue({ city: result.name });
              },
              error: (error) => console.error('Error adding city:', error),
            });
        }
      });
    }
  }
}
