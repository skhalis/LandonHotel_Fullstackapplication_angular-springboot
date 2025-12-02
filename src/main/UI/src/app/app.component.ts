import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private httpClient: HttpClient) {}

  private baseURL: string = 'http://localhost:8080';

  roomsearch!: FormGroup;

  rooms!: Room[];
  currentCheckInVal!: string;
  currentCheckOutVal!: string;

  welcomeMessages: string[] = [];
  presentationTime: string = '';

  ngOnInit() {
    this.roomsearch = new FormGroup({
      checkin: new FormControl(' '),
      checkout: new FormControl(' ')
    });

    this.fetchWelcomeMessages();
    this.fetchPresentationTime();

    const roomsearchValueChanges$ = this.roomsearch.valueChanges;
    roomsearchValueChanges$.subscribe(x => {
      this.currentCheckInVal = x.checkin;
      this.currentCheckOutVal = x.checkout;
    });
  }

  fetchWelcomeMessages() {
    console.log('Fetching welcome messages from /api/welcome...');
    this.httpClient.get<string[]>(this.baseURL + '/api/welcome')
      .subscribe(
        (data) => {
          this.welcomeMessages = data;
          console.log('Received welcome messages:', data);
        },
        (error) => {
          console.error('Error fetching welcome messages:', error);
        }
      );
  }

  fetchPresentationTime() {
    console.log('Fetching presentation time from /api/presentation...');
    this.httpClient.get(this.baseURL + '/api/presentation', { responseType: 'text' })
      .subscribe(
        (data) => {
          this.presentationTime = data as string;
          console.log('Received presentation time:', data);
        },
        (error) => {
          console.error('Error fetching presentation time:', error);
        }
      );
  }

  onSubmit({value, valid}: {value: Roomsearch, valid: boolean}) {
    this.getAll().subscribe(
      rooms => {
        console.log('Received rooms:', Object.values(rooms)[0]);
        this.rooms = <Room[]>Object.values(rooms)[0];
      }
    );
  }

  reserveRoom(value: string) {
    const request = new ReserveRoomRequest(value, this.currentCheckInVal, this.currentCheckOutVal);
    this.createReservation(request);
  }

  createReservation(body: ReserveRoomRequest) {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    this.httpClient.post(this.baseURL + '/room/reservation/v1', body, options)
      .subscribe(res => console.log('Reservation created:', res));
  }

  getAll(): Observable<any> {
    return this.httpClient.get(
      this.baseURL + '/room/reservation/v1?checkin=' +
      this.currentCheckInVal + '&checkout=' + this.currentCheckOutVal,
      {responseType: 'json'}
    );
  }
}

export interface Roomsearch {
  checkin: string;
  checkout: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  price: string;
  links: string;
}

export class ReserveRoomRequest {
  roomId: string;
  checkin: string;
  checkout: string;

  constructor(roomId: string, checkin: string, checkout: string) {
    this.roomId = roomId;
    this.checkin = checkin;
    this.checkout = checkout;
  }
}
