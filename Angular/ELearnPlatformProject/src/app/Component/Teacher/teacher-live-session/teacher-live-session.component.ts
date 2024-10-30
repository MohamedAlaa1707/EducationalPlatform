import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../../Services/Hubs/signalr.service';

@Component({
  selector: 'app-teacher-live-session',
  templateUrl: './teacher-live-session.component.html',
  styleUrls: ['./teacher-live-session.component.css']
})
export class TeacherLiveSessionComponent implements OnInit {
  private localStream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;

  constructor(private signalRService: SignalRService) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
  }

  ngOnInit() {
    if (this.peerConnection) {
      this.peerConnection.ontrack = (event) => {
        const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
        if (remoteVideo) {
          remoteVideo.srcObject = event.streams[0];
        }
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('Sending ICE candidate:', event.candidate);
            this.signalRService.sendIceCandidate(event.candidate);
        }
    };
    }

    this.signalRService.onReceiveMessage((message: string) => {
      const data = JSON.parse(message);
      if (data.type === 'offer') {
        this.handleOffer(data.offer);
      } else if (data.type === 'answer') {
        this.handleAnswer(data.answer);
      } else if (data.type === 'ice-candidate') {
        this.handleIceCandidate(data.candidate);
      }
    });
  }

  async startCall() {
    console.log('Starting call...');
    const localVideo = document.getElementById('localVideo') as HTMLVideoElement;

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.srcObject = this.localStream;

      if (this.localStream && this.peerConnection) {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true });
        localStream.getTracks().forEach(track => {
          if (this.peerConnection) {
            this.peerConnection.addTrack(track, localStream);
          }

        });
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.signalRService.sendMessage('Student', JSON.stringify({ type: 'offer', offer }));
      } else {
        console.error("RTCPeerConnection is closed, cannot add tracks.");
      }
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }

  private async handleOffer(offer: any) {
    await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection?.createAnswer();
    await this.peerConnection?.setLocalDescription(answer);
    this.signalRService.sendMessage('Teacher', JSON.stringify({ type: 'answer', answer }));
  }

  private async handleAnswer(answer: any) {
    await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
  }

  private handleIceCandidate(candidate: any) {
    this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
  }

  async endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    this.peerConnection?.close();
  }
}
