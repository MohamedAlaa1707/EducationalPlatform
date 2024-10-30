import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignalRService } from '../../../Services/Hubs/signalr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-live-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-live-session.component.html',
  styleUrls: ['./student-live-session.component.css']
})
export class StudentLiveSessionComponent implements OnInit {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  session = {
    title: 'Math Live Session',
    instructor: 'Mr. Smith',
    description: 'Join us for an interactive math session!'
  };

  messages: { sender: string; text: string }[] = [];
  newMessage: string = '';
  private peerConnection: RTCPeerConnection | null = null;

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.addReceiveMessageListener();

    // Listen for incoming messages from the SignalR service
    this.signalRService.onReceiveMessage((user: string, message: string) => {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'offer':
          this.handleOffer(data.offer);
          break;
        case 'answer':
          this.handleAnswer(data.answer);
          break;
        case 'ice-candidate':
          this.handleIceCandidate(data.candidate);
          break;
      }
    });

    this.initializePeerConnection(); // Initialize the peer connection
  }

  initializePeerConnection() {
    if (!this.peerConnection) {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Use Google STUN server
      });

      // Handle remote track event
      this.peerConnection.ontrack = (event) => {
        console.log("Track event received.");
        if (this.remoteVideo) {
          this.remoteVideo.nativeElement.srcObject = event.streams[0];
          this.remoteVideo.nativeElement.play().catch((error) => {
            console.error('Error playing video:', error);
          }); // Ensure the video plays
        }
      };

      // Handle ICE candidate event
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate);
          this.signalRService.sendIceCandidate(event.candidate);
        }
      };
    }
  }

  startWatching() {
    console.log("Start watching the instructor's video.");
    this.signalRService.sendMessage('Teacher', JSON.stringify({ type: 'request-offer' }));
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    console.log("Received offer: ", offer);
    if (!this.peerConnection) return;

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.signalRService.sendMessage('Student', JSON.stringify({ type: 'answer', answer }));
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  private handleAnswer(answer: RTCSessionDescriptionInit) {
    console.log("Received answer:", answer);
    // No need to handle answer on the student side
  }

  private handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (this.peerConnection) {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(error => {
        console.error('Error adding ICE candidate:', error);
      });
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.signalRService.sendMessage('Student', this.newMessage);
      this.messages.push({ sender: 'Student', text: this.newMessage });
      this.newMessage = '';
    }
  }

  leaveSession() {
    console.log('Left the session');
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}
