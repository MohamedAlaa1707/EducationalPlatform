using Microsoft.AspNetCore.SignalR;

namespace EduPlatformAPI.Hubs
{
    public class ClassroomHub : Hub
    {
        public async Task SendTeacherMessage(string teacherReply, int commentId)
        {
            await Clients.All.SendAsync("ReceiveMessage", "Teacher", teacherReply, commentId);
        }

        public async Task SendStudentMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message, null);
        }

        public async Task SendIceCandidate(IceCandidate candidate)
        {
            await Clients.All.SendAsync("ReceiveIceCandidate", candidate);
        }





    }
}
