import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
];

@Component({
  selector: 'app-list-of-people',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './list-of-people.component.html',
  styleUrls: ['./list-of-people.component.scss']
})
export class ListOfPeopleComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
