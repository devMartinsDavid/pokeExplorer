import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  standalone: true,
  imports:[CommonModule, HeaderComponent, NavBarComponent ]
})
export class AppLayoutComponent { }
