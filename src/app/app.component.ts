import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ListOfPeopleComponent } from './components/list-of-people/list-of-people.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,ListOfPeopleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sealights-Form';
}
