// Central event data shared by the popup and future event sections.
//
// Scheduling uses America/Puerto_Rico by default. Use YYYY-MM-DD or an ISO
// date/time (for example, 2026-11-01T09:00:00). You may add `timeZone` with an
// IANA timezone name, or include an explicit ISO offset, when an event needs it.
// Leave optional fields empty or omit them; the popup will hide them.
(function () {
  window.SOLAR_BOAT_EVENTS = [
    {
      id: 'pretzel-fundraiser-2026',
      version: 1,
      type: 'fundraising',
      category: 'Fundraiser',
      title: 'PRETZEL FUNDRAISER',
      description: 'Support UPRM Solar Boat with Mr. Pretzels! Pre-sale runs until November 9.',
      image: 'fotos/pretzel-fundraiser.jpg',
      imageAlt: 'Pretzel Fundraiser poster: November 17 at Chardon Lobby, 10:30 AM to 12:00 PM, pre-sale until November 9',
      eventDate: 'November 17, 2026 · 10:30 AM – 12:00 PM',
      location: 'Chardon Lobby, UPRM',
      buttonText: '',
      buttonUrl: '', // Add the pre-sale form URL here and set buttonText to show a button.
      active: true,
      priority: 1,
      displayStart: '',
      displayEnd: '2026-11-17'
    },
    {
      id: 'gran-rifa-solar-boat',
      version: 1,
      type: 'raffle',
      category: 'Featured Announcement',
      title: 'GRAND SOLAR BOAT RAFFLE',
      description: 'Support Solar Boat UPRM by participating in our fundraising raffle.',
      image: '', // Example: 'fotos/gran-rifa-solar-boat.jpg'
      imageAlt: 'Grand Solar Boat Raffle',
      prize: 'Coming Soon',
      ticketPrice: 'Coming Soon',
      raffleDate: 'Coming Soon',
      buttonText: 'Participate Now',
      buttonUrl: '', // Add the participation URL to enable the button.
      active: false,
      priority: 1,
      displayStart: '',
      displayEnd: ''
    }
  ];
})();
