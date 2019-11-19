import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef
} from '@angular/core';

import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  SpotLight,
  MeshBuilder,
  Color3,
  StandardMaterial,
  Texture,
  Mesh,
  ParticleSystem,
  Color4,
  CubeTexture
} from "@babylonjs/core";
import { GiftService } from './gift.service';
import { Gift } from './gift';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.scss']
})
export class GiftComponent implements OnInit, AfterViewInit {
  @ViewChild("renderingCanvas", { static: false })
  public renderingCanvas: ElementRef<HTMLCanvasElement>;


  // Component Input 
  @Input() snow: string;
  @Input() ground: string;
  @Input() wrap: string;
  @Input() snowing: boolean;

  scene: Scene;
  engine: Engine;
  param: Gift;

  constructor(private gift: GiftService) { }

  ngOnInit() {
    this.param = {
      snowing: this.snowing,
      groundPattern: this.ground,
      wrapPattern: this.wrap,
      snowPattern: this.snow
    }
    console.log("GIFT", this.renderingCanvas);

  }

  ngOnChanges(changes: SimpleChanges) {

    if (!changes.snowing.firstChange) {
      this.param.snowing = changes.snowing.currentValue;
      this.gift.createScene(this.renderingCanvas, this.param);
      this.gift.animate();
    }
  }
  ngAfterViewInit(): void {
    console.log(this.renderingCanvas);
    this.gift.createScene(this.renderingCanvas, this.param);
    this.gift.animate();

  }

}
