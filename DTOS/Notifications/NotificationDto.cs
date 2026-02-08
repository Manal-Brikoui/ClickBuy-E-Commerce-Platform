using shopstore.DTOS.Orders;

namespace shopstore.DTOS.Notifications
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public int? OrderId { get; set; }
        public int? RelatedUserId { get; set; }
        public string RelatedUserName { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Link { get; set; }
    }

    public class MarkAsReadRequest
    {
        public int NotificationId { get; set; }
    }
}