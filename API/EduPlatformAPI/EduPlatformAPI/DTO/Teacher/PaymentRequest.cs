namespace EduPlatformAPI.DTO.Teacher
{
    public class PaymentRequest
    {
        public decimal Total { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}

