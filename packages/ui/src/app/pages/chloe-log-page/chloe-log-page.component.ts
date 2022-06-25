import { Component, OnInit } from '@angular/core';

enum MetricType {
  boob = 'boob',
  diaper = 'diaper',
  temp = 'temp',
  weight = 'weight',
  bottle = 'bottle',
  note = 'note',
}

enum DiaperAmount {
  none = 'none',
  spot = 'spot',
  medium = 'medium',
  lots = 'lots',
  blowout = 'blowout',
}

enum Boob {
  left = 'left',
  right = 'right',
}

type Metric = { time: Date } & (
  | {
      type: MetricType.boob;
      side: Boob;
      duration: number;
    }
  | {
      type: MetricType.diaper;
      poop: DiaperAmount;
      pee: DiaperAmount;
    }
  | {
      type: MetricType.weight;
      lb: number;
      oz: number;
    }
  | {
      type: MetricType.bottle;
      oz: number;
    }
  | {
      type: MetricType.note;
      note: string;
    }
  | {
      type: MetricType.temp;
      temp: number;
    }
);

@Component({
  selector: 'app-chloe-log-page',
  templateUrl: './chloe-log-page.component.html',
  styleUrls: ['./chloe-log-page.component.scss'],
})
export class ChloeLogPageComponent implements OnInit {
  public readonly MetricType = MetricType;

  metrics: Metric[] = [
    {
      type: MetricType.note,
      time: new Date('2022-06-11 3:28 am'),
      note: 'Born!',
    },
    {
      type: MetricType.boob,
      time: new Date('2022-06-11 11:11 am'),
      side: Boob.left,
      duration: 15,
    },
    {
      type: MetricType.temp,
      time: new Date('2022-06-11 11:35 am'),
      temp: 97.7,
    },
    {
      type: MetricType.diaper,
      time: new Date('2022-06-11 12:10 pm'),
      pee: DiaperAmount.medium,
      poop: DiaperAmount.lots,
    },
    {
      type: MetricType.boob,
      time: new Date('2022-06-11 12:18 pm'),
      side: Boob.right,
      duration: 12,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.metrics.sort((a, b) => b.time.getTime() - a.time.getTime());
  }
}
