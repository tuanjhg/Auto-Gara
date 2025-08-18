import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  userName: string = 'Cody Fisher';
  userRole: string = 'Owner';
  userAvatarUrl: string = 'assets/images/Avatar.png'; 
  @Input() currentFeature: string = '';

}