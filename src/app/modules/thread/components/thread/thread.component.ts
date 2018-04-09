import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {THREAD_ANIMATIONS} from './thread.animation';
import {Thread} from '../../types/thread';

@Component({
  selector: 'cb-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
  animations: THREAD_ANIMATIONS,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThreadComponent implements OnInit {
  @Input() thread: Thread;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.router.navigate(['/threads', this.thread.id]);
  }
}