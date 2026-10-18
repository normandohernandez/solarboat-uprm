// Central source for team divisions and members.
// Optional member fields (major, academicYear, image) are only rendered when set.
(function (root) {
  'use strict';

  root.SOLAR_BOAT_DIVISIONS = [
    {
      id: 'icom-inso',
      name: 'ICOM / INSO',
      shortCode: '01',
      pageUrl: 'team-icom-inso.html',
      description: 'Responsible for software development, programming, systems integration, and technological solutions.'
    },
    {
      id: 'operations-logistics',
      name: 'Operations & Logistics',
      shortCode: '02',
      pageUrl: 'team-operations-logistics.html',
      description: 'Responsible for team operations, logistics, sponsorships, fundraising, and organizational coordination.'
    },
    {
      id: 'inme',
      name: 'INME',
      shortCode: '03',
      pageUrl: 'team-inme.html',
      description: 'Responsible for mechanical design, manufacturing, structural development, and mechanical systems.'
    },
    {
      id: 'inel',
      name: 'INEL',
      shortCode: '04',
      pageUrl: 'team-inel.html',
      description: 'Responsible for electrical systems, power distribution, electronics, and electrical integration.'
    }
  ];

  root.SOLAR_BOAT_TEAM_MEMBERS = [
    {
      id: 'software-lead-placeholder',
      name: 'Name Surname',
      image: 'fotos/emblema-bulldog-equipo.jpg',
      division: 'icom-inso',
      role: 'Software Lead',
      isLeader: true,
      leadershipOrder: 2
    },
    {
      id: 'team-captain-placeholder',
      name: 'Name Surname',
      image: 'fotos/emblema-bulldog-equipo.jpg',
      division: 'operations-logistics',
      role: 'Team Captain',
      isLeader: true,
      leadershipOrder: 1
    },
    {
      id: 'mechanical-lead-placeholder',
      name: 'Name Surname',
      image: 'fotos/emblema-bulldog-equipo.jpg',
      division: 'inme',
      role: 'Mechanical Lead',
      isLeader: true,
      leadershipOrder: 3
    },
    {
      id: 'hull-design-placeholder',
      name: 'Name Surname',
      image: 'fotos/emblema-bulldog-equipo.jpg',
      division: 'inme',
      role: 'Hull Design',
      isLeader: false
    },
    {
      id: 'electrical-lead-placeholder',
      name: 'Name Surname',
      image: 'fotos/emblema-bulldog-equipo.jpg',
      division: 'inel',
      role: 'Electrical Lead',
      isLeader: true,
      leadershipOrder: 4
    },
    {
      id: 'solar-systems-placeholder',
      name: 'Name Surname',
      image: 'fotos/emblema-bulldog-equipo.jpg',
      division: 'inel',
      role: 'Solar Systems',
      isLeader: false
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
