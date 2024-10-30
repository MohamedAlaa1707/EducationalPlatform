namespace EduPlatformAPI.Hubs
{
    public class IceCandidate
    {
        public string Candidate { get; set; }
        public string SdpMid { get; set; }
        public int SdpMLineIndex { get; set; }

        public IceCandidate(string candidate, string sdpMid, int sdpMLineIndex)
        {
            Candidate = candidate;
            SdpMid = sdpMid;
            SdpMLineIndex = sdpMLineIndex;
        }
    }
}
