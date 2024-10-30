import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  public hubConnection!: HubConnection;
  public isConnected: boolean = false;
  private messageHandlers: Array<(user: string, message: string, commentId: number) => void> = [];

  constructor() {
    this.createConnection();
    this.startConnection();
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7217/classroomhub')
      .build();

    // Handle connection state change
    this.hubConnection.onclose(() => {
      this.isConnected = false;
    });

    // Live session events
    this.hubConnection.on('ReceiveMessage', (user: string, message: string, commentId: number) => {
      this.handleMessage(user, message, commentId);
    });
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public sendMessage(user: string, message: string) {
    if (this.isConnected) {
      this.hubConnection.invoke('SendStudentMessage', user, message)
        .catch(err => console.log(err));
    }
  }

  public sendTeacherReply(user: string, reply: string, commentId: number) {
    if (this.isConnected) {
      this.hubConnection.invoke('SendTeacherMessage', user, reply, commentId)
        .catch(err => console.log(err));
    }
  }

  private handleMessage(user: string, message: string, commentId: number) {
    console.log(`${user}: ${message}`);
    this.messageHandlers.forEach(handler => handler(user, message, commentId));
  }

  // Method to register message handlers
  public onReceiveMessage(handler: (user: string, message: string, commentId: number) => void) {
    this.messageHandlers.push(handler);
  }

  // New method to add receive message listener
  public addReceiveMessageListener() {
    this.hubConnection.on('ReceiveMessage', (user: string, message: string, commentId: number) => {
      this.handleMessage(user, message, commentId);
    });
  }

  public  async sendIceCandidate(candidate: RTCIceCandidate) {
    if (this.isConnected) {
      try {
        await this.hubConnection.invoke("SendIceCandidate", candidate);
    } catch (error) {
        console.error("Error invoking SendIceCandidate:", error);
    }

    }
  }

  // افترض أن لديك طريقة onReceiveMessage
  public onReceiveIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    this.hubConnection.on('ReceiveIceCandidate', (candidate) => {
      callback(candidate);
    });
  }
}
