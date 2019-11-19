import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'xmas-vr';
  snowing: boolean = false;
  snow: string =
    "https://raw.githubusercontent.com/anacidre/angular-babylonjs/master/src/assets/textures/flare.png";
  ground: string =
    "https://raw.githubusercontent.com/anacidre/angular-babylonjs/master/src/assets/textures/distortion.png";
  wrap: string =
    "https://static.vecteezy.com/system/resources/thumbnails/000/139/454/small/red-christmas-fabric-vector-pattern.jpg";

  toggleSnow() { this.snowing = !this.snowing; console.log(this.snowing); }
}
