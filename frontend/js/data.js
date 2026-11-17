// Fake sample data — matches the planned database tables.
// Remove this file once the real API is ready.
// Bump DATA_VERSION whenever this file changes so browsers reload the fake data.
const DATA_VERSION = 4;

const MOCK_DATA = {
  Users: [
    { UserID: 1, FirstName: "Admin", LastName: "User", Email: "admin@wpunj.edu", Password: "admin123", Phone: "973-720-2000", StudentID: null, Role: "Admin", CreatedAt: "2026-08-20" },
    { UserID: 2, FirstName: "Maria", LastName: "Lopez", Email: "lopezm@wpunj.edu", Password: "staff123", Phone: "973-720-2100", StudentID: null, Role: "Organizer", CreatedAt: "2026-08-25" },
    { UserID: 3, FirstName: "David", LastName: "Kim", Email: "kimd@wpunj.edu", Password: "staff123", Phone: "973-720-2200", StudentID: null, Role: "Organizer", CreatedAt: "2026-08-25" },
    { UserID: 4, FirstName: "Jane", LastName: "Doe", Email: "doej@student.wpunj.edu", Password: "jane1234", Phone: "973-555-0101", StudentID: "855123456", Role: "Customer", CreatedAt: "2026-09-02" },
    { UserID: 5, FirstName: "Alex", LastName: "Rivera", Email: "riveraa@student.wpunj.edu", Password: "alex1234", Phone: "973-555-0102", StudentID: "855234567", Role: "Customer", CreatedAt: "2026-09-05" },
    { UserID: 6, FirstName: "Priya", LastName: "Shah", Email: "shahp@student.wpunj.edu", Password: "priya123", Phone: "973-555-0103", StudentID: "855345678", Role: "Customer", CreatedAt: "2026-09-10" },
    { UserID: 7, FirstName: "Marcus", LastName: "Brown", Email: "brownm@student.wpunj.edu", Password: "marcus12", Phone: "973-555-0104", StudentID: "855456789", Role: "Customer", CreatedAt: "2026-09-08" },
    { UserID: 8, FirstName: "Tom", LastName: "Reed", Email: "tom@pioneerpromo.com", Password: "promo123", Phone: "201-555-0150", StudentID: null, Role: "Organizer", CreatedAt: "2026-10-30" }
  ],

  Venues: [
    { VenueID: 1, Name: "Shea Center for Performing Arts", Address: "300 Pompton Rd", City: "Wayne", State: "NJ", Capacity: 900 },
    { VenueID: 2, Name: "University Commons Ballroom", Address: "300 Pompton Rd", City: "Wayne", State: "NJ", Capacity: 400 },
    { VenueID: 3, Name: "Wightman Gym", Address: "300 Pompton Rd", City: "Wayne", State: "NJ", Capacity: 1500 },
    { VenueID: 4, Name: "Wightman Field", Address: "300 Pompton Rd", City: "Wayne", State: "NJ", Capacity: 2500 }
  ],

  Categories: [
    { CategoryID: 1, Name: "Concerts & Music" },
    { CategoryID: 2, Name: "Sports" },
    { CategoryID: 3, Name: "Club & Greek Life" },
    { CategoryID: 4, Name: "Career & Academic" }
  ],

  // Status: Pending (waiting for admin approval) | Active | Cancelled
  Events: [
    { EventID: 1, OrganizerID: 2, VenueID: 1, CategoryID: 1, Title: "Fall Jazz Night", Description: "The WPU Jazz Ensemble's fall concert, featuring big-band classics and student solos.", EventDate: "2026-11-20", StartTime: "19:30", ImageURL: null, Status: "Active" },
    { EventID: 2, OrganizerID: 3, VenueID: 3, CategoryID: 2, Title: "Pioneers Basketball vs. Ramapo", Description: "Men's basketball home game. Wear orange!", EventDate: "2026-11-22", StartTime: "18:00", ImageURL: null, Status: "Active" },
    { EventID: 3, OrganizerID: 2, VenueID: 2, CategoryID: 4, Title: "Winter Career Fair", Description: "Meet 40+ employers hiring WPU students for internships and full-time roles. Bring your resume.", EventDate: "2026-12-02", StartTime: "11:00", ImageURL: null, Status: "Active" },
    { EventID: 4, OrganizerID: 3, VenueID: 2, CategoryID: 3, Title: "Greek Life Winter Mixer", Description: "Meet WPU fraternities and sororities over music and snacks.", EventDate: "2026-12-04", StartTime: "20:00", ImageURL: null, Status: "Active" },
    { EventID: 5, OrganizerID: 2, VenueID: 1, CategoryID: 1, Title: "Student Band Showcase", Description: "Six student bands, one night. VIP seats include front rows.", EventDate: "2026-12-06", StartTime: "19:00", ImageURL: null, Status: "Active" },
    { EventID: 6, OrganizerID: 3, VenueID: 4, CategoryID: 2, Title: "Pioneers Alumni Flag Football", Description: "Students vs. alumni charity game. All ticket money goes to the food pantry.", EventDate: "2026-12-09", StartTime: "13:00", ImageURL: null, Status: "Active" },
    { EventID: 7, OrganizerID: 2, VenueID: 2, CategoryID: 4, Title: "Resume & LinkedIn Workshop", Description: "Hands-on workshop with Career Services. Bring a laptop.", EventDate: "2026-11-18", StartTime: "14:00", ImageURL: null, Status: "Active" },
    { EventID: 8, OrganizerID: 3, VenueID: 1, CategoryID: 4, Title: "Guest Speaker: AI in 2027", Description: "Talk and Q&A with an industry speaker.", EventDate: "2026-12-10", StartTime: "17:00", ImageURL: null, Status: "Cancelled" },
    { EventID: 9, OrganizerID: 2, VenueID: 1, CategoryID: 1, Title: "Homecoming Concert", Description: "Homecoming weekend concert on the Shea stage.", EventDate: "2026-10-17", StartTime: "20:00", ImageURL: null, Status: "Active" },
    { EventID: 10, OrganizerID: 3, VenueID: 2, CategoryID: 3, Title: "Fall Club Fair", Description: "Find your club — 100+ student organizations.", EventDate: "2026-09-16", StartTime: "12:00", ImageURL: null, Status: "Active" },
    { EventID: 11, OrganizerID: 8, VenueID: 3, CategoryID: 2, Title: "Pioneer Esports Tournament", Description: "Smash and Rocket League brackets with prizes.", EventDate: "2026-12-11", StartTime: "16:00", ImageURL: null, Status: "Pending" }
  ],

  // QuantityAvailable is calculated at the bottom of this file from the bookings
  TicketTypes: [
    { TicketTypeID: 1, EventID: 1, Name: "Student", Price: 10, QuantityTotal: 600 },
    { TicketTypeID: 2, EventID: 1, Name: "General", Price: 20, QuantityTotal: 300 },
    { TicketTypeID: 3, EventID: 2, Name: "Student", Price: 0, QuantityTotal: 1500 },
    { TicketTypeID: 4, EventID: 3, Name: "Student", Price: 0, QuantityTotal: 400 },
    { TicketTypeID: 5, EventID: 4, Name: "Student", Price: 0, QuantityTotal: 400 },
    { TicketTypeID: 6, EventID: 5, Name: "Student", Price: 5, QuantityTotal: 800 },
    { TicketTypeID: 7, EventID: 5, Name: "VIP", Price: 15, QuantityTotal: 10 },
    { TicketTypeID: 8, EventID: 6, Name: "Student", Price: 5, QuantityTotal: 2500 },
    { TicketTypeID: 9, EventID: 7, Name: "Student", Price: 0, QuantityTotal: 3 },
    { TicketTypeID: 10, EventID: 8, Name: "Student", Price: 0, QuantityTotal: 900 },
    { TicketTypeID: 11, EventID: 9, Name: "Student", Price: 12, QuantityTotal: 700 },
    { TicketTypeID: 12, EventID: 9, Name: "General", Price: 20, QuantityTotal: 200 },
    { TicketTypeID: 13, EventID: 10, Name: "Student", Price: 0, QuantityTotal: 400 },
    { TicketTypeID: 14, EventID: 11, Name: "Player", Price: 5, QuantityTotal: 64 }
  ],

  // Status: Confirmed | Cancelled
  Bookings: [
    { BookingID: 1, UserID: 4, BookingDate: "2026-11-01", TotalAmount: 30, Status: "Confirmed" },
    { BookingID: 2, UserID: 5, BookingDate: "2026-11-02", TotalAmount: 0, Status: "Confirmed" },
    { BookingID: 3, UserID: 6, BookingDate: "2026-11-03", TotalAmount: 10, Status: "Confirmed" },
    { BookingID: 4, UserID: 7, BookingDate: "2026-11-03", TotalAmount: 0, Status: "Confirmed" },
    { BookingID: 5, UserID: 4, BookingDate: "2026-11-04", TotalAmount: 0, Status: "Confirmed" },
    { BookingID: 6, UserID: 5, BookingDate: "2026-11-04", TotalAmount: 20, Status: "Confirmed" },
    { BookingID: 7, UserID: 6, BookingDate: "2026-11-05", TotalAmount: 5, Status: "Cancelled" },
    { BookingID: 8, UserID: 4, BookingDate: "2026-10-05", TotalAmount: 24, Status: "Confirmed" },
    { BookingID: 9, UserID: 7, BookingDate: "2026-09-10", TotalAmount: 0, Status: "Confirmed" },
    { BookingID: 10, UserID: 5, BookingDate: "2026-10-10", TotalAmount: 20, Status: "Confirmed" }
  ],

  BookingItems: [
    { BookingItemID: 1, BookingID: 1, TicketTypeID: 1, Quantity: 1, UnitPrice: 10 },
    { BookingItemID: 2, BookingID: 1, TicketTypeID: 2, Quantity: 1, UnitPrice: 20 },
    { BookingItemID: 3, BookingID: 2, TicketTypeID: 3, Quantity: 2, UnitPrice: 0 },
    { BookingItemID: 4, BookingID: 3, TicketTypeID: 1, Quantity: 1, UnitPrice: 10 },
    { BookingItemID: 5, BookingID: 4, TicketTypeID: 3, Quantity: 2, UnitPrice: 0 },
    { BookingItemID: 6, BookingID: 5, TicketTypeID: 4, Quantity: 1, UnitPrice: 0 },
    { BookingItemID: 7, BookingID: 5, TicketTypeID: 9, Quantity: 1, UnitPrice: 0 },
    { BookingItemID: 8, BookingID: 6, TicketTypeID: 6, Quantity: 2, UnitPrice: 5 },
    { BookingItemID: 9, BookingID: 6, TicketTypeID: 1, Quantity: 1, UnitPrice: 10 },
    { BookingItemID: 10, BookingID: 7, TicketTypeID: 6, Quantity: 1, UnitPrice: 5 },
    { BookingItemID: 11, BookingID: 8, TicketTypeID: 11, Quantity: 2, UnitPrice: 12 },
    { BookingItemID: 12, BookingID: 9, TicketTypeID: 13, Quantity: 1, UnitPrice: 0 },
    { BookingItemID: 13, BookingID: 10, TicketTypeID: 12, Quantity: 1, UnitPrice: 20 }
  ],

  // Only the last 4 card digits are ever stored. Status: Paid | Refunded
  Payments: [
    { PaymentID: 1, BookingID: 1, Amount: 30, PaymentMethod: "Card •••• 4242", PaymentDate: "2026-11-01", Status: "Paid" },
    { PaymentID: 2, BookingID: 3, Amount: 10, PaymentMethod: "Card •••• 1881", PaymentDate: "2026-11-03", Status: "Paid" },
    { PaymentID: 3, BookingID: 6, Amount: 20, PaymentMethod: "Card •••• 5100", PaymentDate: "2026-11-04", Status: "Paid" },
    { PaymentID: 4, BookingID: 7, Amount: 5, PaymentMethod: "Card •••• 1881", PaymentDate: "2026-11-05", Status: "Refunded" },
    { PaymentID: 5, BookingID: 8, Amount: 24, PaymentMethod: "Card •••• 4242", PaymentDate: "2026-10-05", Status: "Paid" },
    { PaymentID: 6, BookingID: 10, Amount: 20, PaymentMethod: "Card •••• 5100", PaymentDate: "2026-10-10", Status: "Paid" }
  ],

  // One row per seat. Filled in below.
  Tickets: []
};

// Primary key column for each table
const TABLE_KEYS = {
  Users: "UserID", Venues: "VenueID", Categories: "CategoryID", Events: "EventID",
  TicketTypes: "TicketTypeID", Bookings: "BookingID", BookingItems: "BookingItemID",
  Payments: "PaymentID", Tickets: "TicketID"
};

// Build the Tickets table and seat counts from the bookings above
(function buildMockTickets() {
  const pastEvents = new Set([9, 10]); // tickets for past events are checked in
  MOCK_DATA.TicketTypes.forEach(t => { t.QuantityAvailable = t.QuantityTotal; });
  MOCK_DATA.BookingItems.forEach(item => {
    const booking = MOCK_DATA.Bookings.find(b => b.BookingID === item.BookingID);
    const type = MOCK_DATA.TicketTypes.find(t => t.TicketTypeID === item.TicketTypeID);
    if (booking.Status === "Confirmed") type.QuantityAvailable -= item.Quantity;
    for (let n = 1; n <= item.Quantity; n++) {
      MOCK_DATA.Tickets.push({
        TicketID: MOCK_DATA.Tickets.length + 1,
        BookingItemID: item.BookingItemID,
        TicketCode: "EP-" + String(item.BookingID).padStart(4, "0") + "-" + item.BookingItemID + n,
        IsCheckedIn: booking.Status === "Confirmed" && pastEvents.has(type.EventID)
      });
    }
  });
})();
