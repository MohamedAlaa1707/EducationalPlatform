using EduPlatformAPI.Models;
using EduPlatformAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EduPlatformAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaypalController : ControllerBase
    {
        private readonly EduPlatformDbContext context;
        private readonly PayPalService _payPalService;

        public PaypalController(PayPalService payPalService , EduPlatformDbContext context)
        {
            _payPalService = payPalService;
            this.context = context;
        }

        [HttpGet("payment/{paymentId}")]
        public async Task<IActionResult> GetPayment(string paymentId)
        {
            var payment = await _payPalService.GetPaymentAsync(paymentId);

            if (payment == null)
                return NotFound("Payment not found or error occurred.");

            return Ok(payment);
        }

        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest request)
        {
            if (request == null)
                return BadRequest("Invalid payment request.");

            var payment = await _payPalService.CreatePaymentAsync(request.Total, request.Currency, request.Description, request.ReturnUrl, request.CancelUrl);

            if (payment == null)
                return BadRequest("Failed to create payment. Check the PayPal settings or parameters.");

            var approvalUrl = payment.links.FirstOrDefault(l => l.rel == "approval_url")?.href;

            if (string.IsNullOrEmpty(approvalUrl))
                return BadRequest("Could not get PayPal approval URL.");

            return Ok(new { approvalUrl, id = payment.id });
        }




    }
}

// Existing PaymentRequest Class
public class PaymentRequest
{
    public decimal Total { get; set; }
    public string Currency { get; set; }
    public string Description { get; set; }
    public string ReturnUrl { get; set; }
    public string CancelUrl { get; set; }
}
   

