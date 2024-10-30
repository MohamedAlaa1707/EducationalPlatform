using System;
using System.Collections.Generic;

namespace EduPlatformAPI.Models;

public partial class Receipt
{
    public int ReceiptId { get; set; }

    public string ReceiptImageLink { get; set; } = null!;

    public DateTime? UploadDate { get; set; }

    public string AdminReviewed { get; set; } = null!;

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
