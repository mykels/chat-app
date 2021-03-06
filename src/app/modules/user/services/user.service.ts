import {Injectable} from '@angular/core';
import {User} from '../types/user';
import {Store} from '@ngrx/store';
import {AddUserAction, UpdateUserAction} from '../../core/store/user/user.actions';
import {AppState} from '../../core/store/types/app-state';
import {generateId} from '../../core/services/utils';
import {Thread} from '../../thread/types/thread';
import {interval} from 'rxjs';

@Injectable()
export class UserService {
  private usersToAdd: User[];
  private users: User[];
  private loggedUser: User;

  constructor(private store: Store<AppState>) {
  }

  init() {
    this.initCurrentUsers();
    this.initLoggedUser();
    this.initUsersToAdd();
    this.randomizeOnlineIndicator();
    this.randomizeNewUsers();
    this.subscribeToMessages();
  }

  initLoggedUser(): void {
    this.loggedUser = {
      id: generateId(),
      name: 'Micha Sherman',
      avatar: 'assets/images/avatars/ms.jpg',
      online: true,
      notified: false
    };

    this.dispatchNewUser(this.loggedUser);
  }

  initCurrentUsers(): void {
    this.dispatchNewUser({
      id: generateId(),
      name: 'David Yahalomi',
      avatar: 'assets/images/avatars/dy.jpg',
      online: true,
      notified: false
    });
    this.dispatchNewUser({
      id: generateId(),
      name: 'Zoe Shwartz',
      avatar: 'assets/images/avatars/zs.jpg',
      online: true,
      notified: false
    });
    this.dispatchNewUser({
      id: generateId(),
      name: 'Liran Pesach',
      avatar: 'assets/images/avatars/lp.jpg',
      online: true,
      notified: false
    });
    this.dispatchNewUser({
      id: generateId(),
      name: 'Nir Amsellem',
      avatar: 'assets/images/avatars/na.jpg',
      online: true,
      notified: false
    });
    this.dispatchNewUser({
      id: generateId(),
      name: 'Michael Balber',
      avatar: 'assets/images/avatars/mb.jpg',
      online: true,
      notified: false
    });

    this.store.select('users').subscribe((users: User[]) => {
      this.users = users;
    });
  }

  initUsersToAdd() {
    this.usersToAdd = [];
    this.usersToAdd.push({
      id: generateId(),
      name: 'Royi Freifeld',
      avatar: 'assets/images/avatars/rf.jpg',
      online: true,
      notified: false
    });
    this.usersToAdd.push({
      id: generateId(),
      name: 'Yogev Yehuda',
      avatar: 'assets/images/avatars/yy.jpg',
      online: true,
      notified: false
    });
    this.usersToAdd.push({id: generateId(), name: 'Guy Raviv', avatar: 'assets/images/avatars/gr.jpg', online: true, notified: false});
  }

  randomizeOnlineIndicator() {
    interval(5000).subscribe(() => {
      const randomUser: User = this.users[Math.floor((Math.random() * 100) % (this.users.length - 1))];

      if (randomUser && randomUser.id !== this.loggedUser.id) {
        randomUser.online = !randomUser.online;
        this.store.dispatch(new UpdateUserAction(randomUser));
      }
    });
  }

  randomizeNewUsers() {
    const newUsersAdder = interval(10000).subscribe(() => {
      if (this.usersToAdd.length === 0) {
        newUsersAdder.unsubscribe();
      } else {
        this.dispatchNewUser(this.usersToAdd.pop());
      }
    });
  }

  dispatchNewUser(user: User) {
    this.store.dispatch(new AddUserAction(user));
  }

  getById(userId: string): User {
    const [user] = this.users.filter(scannedUser => scannedUser.id === userId);
    return user;
  }

  getLoggedUser(): User {
    return this.loggedUser;
  }

  private subscribeToMessages() {
    this.store.select('threads')
      .subscribe(threads => {
        this.updateUserNotification(threads);
      });
  }

  private updateUserNotification(threads: Thread[]) {
    threads.forEach(thread => {
      const [user] = this.users.filter(user => user.id === thread.user);

      if (thread.notified && !user.notified) {
        user.notified = true;
        this.store.dispatch(new UpdateUserAction(user));
      } else if (!thread.notified && user.notified) {
        user.notified = false;
        this.store.dispatch(new UpdateUserAction(user));
      }
    });
  }
}

