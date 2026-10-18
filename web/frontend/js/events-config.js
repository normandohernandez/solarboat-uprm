// Central event data shared by the popup and future event sections.
//
// Scheduling uses America/Puerto_Rico by default. Use YYYY-MM-DD or an ISO
// date/time (for example, 2026-11-01T09:00:00). You may add `timeZone` with an
// IANA timezone name, or include an explicit ISO offset, when an event needs it.
// Leave optional fields empty or omit them; the popup will hide them.
(function () {
  window.SOLAR_BOAT_EVENTS = [
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
      active: true,
      priority: 1,
      displayStart: '',
      displayEnd: ''
    }
  ];
})();
