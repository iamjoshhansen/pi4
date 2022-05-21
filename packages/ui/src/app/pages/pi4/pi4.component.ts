import { Component, OnInit } from '@angular/core';
import { CpuTempService } from 'src/app/services/cpu-temp.service';

@Component({
  selector: 'app-pi4',
  templateUrl: './pi4.component.html',
  styleUrls: ['./pi4.component.scss'],
})
export class Pi4Component implements OnInit {
  readonly cpuTemp$ = this.cpuTempService.cpuTemp$;

  constructor(private cpuTempService: CpuTempService) {}

  ngOnInit(): void {}
}
