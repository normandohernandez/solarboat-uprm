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

  root.SOLAR_BOAT_ADVISOR = {
    name: 'Prof. Guillermo Serrano',
    role: 'Faculty Advisor',
    profileUrl: 'https://ece.uprm.edu/people/faculty/name/guillermo-serrano/',
    image: 'fotos/team/guillermo-serrano.jpg',
    imageAlt: 'Portrait of Prof. Guillermo Serrano'
  };

  root.SOLAR_BOAT_TEAM_MEMBERS = [
    {
      id: 'normando-hernandez',
      name: 'Normando Hernández',
      image: 'fotos/team/normando-hernandez.jpg',
      imageAlt: 'Portrait of Normando Hernández',
      division: 'icom-inso',
      role: 'Software Lead',
      academicYear: '3rd Year',
      isLeader: true,
      leadershipOrder: 2
    },
    {
      id: 'ronald-perez',
      name: 'Ronald Pérez',
      image: 'fotos/team/ronald-perez.jpg',
      imageAlt: 'Portrait of Ronald Pérez',
      division: 'icom-inso',
      role: 'Team Captain',
      academicYear: '6th Year',
      isLeader: true,
      leadershipTier: 'captain',
      leadershipOrder: 1
    },
    {
      id: 'eliel-santiago',
      name: 'Eliel Santiago',
      image: 'fotos/team/eliel-santiago.jpg',
      imageAlt: 'Portrait of Eliel Santiago',
      division: 'icom-inso',
      academicYear: '4th Year',
      isLeader: false
    },
    {
      id: 'sebastian-latalladi',
      name: 'Sebastián Latalladi',
      image: 'fotos/team/sebastian-latalladi.jpg',
      imageAlt: 'Portrait of Sebastián Latalladi',
      division: 'icom-inso',
      academicYear: '2nd Year',
      isLeader: false
    },
    {
      id: 'abdiel-vallejo',
      name: 'Abdiel Vallejo',
      image: 'fotos/team/abdiel-vallejo.jpg',
      imageAlt: 'Portrait of Abdiel Vallejo',
      division: 'icom-inso',
      academicYear: '3rd Year',
      isLeader: false
    },
    {
      id: 'gabriel-martinez',
      name: 'Gabriel Martínez',
      image: 'fotos/team/gabriel-martinez.jpg',
      imageAlt: 'Portrait of Gabriel Martínez',
      division: 'operations-logistics',
      role: 'Operations & Logistics Lead',
      academicYear: '3rd Year',
      isLeader: true,
      leadershipOrder: 3
    },
    {
      id: 'celso-rivera',
      name: 'Celso Rivera',
      image: 'fotos/team/celso-rivera.jpg',
      imageAlt: 'Portrait of Celso Rivera',
      division: 'operations-logistics',
      academicYear: '3rd Year',
      isLeader: false
    },
    {
      id: 'gustavo-alvarado',
      name: 'Gustavo Alvarado',
      image: 'fotos/team/gustavo-alvarado.jpg',
      imageAlt: 'Portrait of Gustavo Alvarado',
      division: 'operations-logistics',
      academicYear: '3rd Year',
      isLeader: false
    },
    {
      id: 'yosef-santiago',
      name: 'Yosef Santiago',
      image: 'fotos/team/yosef-santiago.jpg',
      imageAlt: 'Portrait of Yosef Santiago',
      division: 'inme',
      role: 'Mechanical Lead',
      academicYear: '5th Year',
      isLeader: true,
      leadershipOrder: 4
    },
    {
      id: 'yahil-roman',
      name: 'Yahil Román',
      image: 'fotos/team/yahil-roman.jpg',
      imageAlt: 'Portrait of Yahil Román',
      division: 'inme',
      academicYear: '1st Year',
      isLeader: false
    },
    {
      id: 'yan-ortiz',
      name: 'Yan Ortiz',
      image: 'fotos/team/yan-ortiz.jpg',
      imageAlt: 'Portrait of Yan Ortiz',
      division: 'inme',
      academicYear: '4th Year',
      isLeader: false
    },
    {
      id: 'carlos-tirado',
      name: 'Carlos Tirado',
      image: 'fotos/team/carlos-tirado.jpg',
      imageAlt: 'Portrait of Carlos Tirado',
      division: 'inme',
      academicYear: '5th Year',
      isLeader: false
    },
    {
      id: 'ivan-vera',
      name: 'Iván Vera',
      image: 'fotos/team/ivan-vera.jpg',
      imageAlt: 'Portrait of Iván Vera',
      division: 'inme',
      academicYear: '2nd Year',
      isLeader: false
    },
    {
      id: 'alexis-bonilla',
      name: 'Alexis Bonilla',
      image: 'fotos/team/alexis-bonilla.jpg',
      imageAlt: 'Portrait of Alexis Bonilla',
      division: 'inme',
      academicYear: '3rd Year',
      isLeader: false
    },
    {
      id: 'ian-perez',
      name: 'Ian Pérez',
      image: 'fotos/team/ian-perez.jpg',
      imageAlt: 'Portrait of Ian Pérez',
      division: 'inme',
      academicYear: '3rd Year',
      isLeader: false
    },
    {
      id: 'fabian-diaz',
      name: 'Fabián Díaz',
      image: 'fotos/team/fabian-diaz.jpg',
      imageAlt: 'Portrait of Fabián Díaz',
      division: 'inme',
      academicYear: '3rd Year',
      isLeader: false
    },
    {
      id: 'adrian-carrero',
      name: 'Adrián Carrero',
      image: 'fotos/team/adrian-carrero.jpg',
      imageAlt: 'Portrait of Adrián Carrero',
      division: 'inme',
      academicYear: '1st Year',
      isLeader: false
    },
    {
      id: 'williezer-valentin',
      name: 'Williezer Valentín',
      image: 'fotos/team/williezer-valentin.jpg',
      imageAlt: 'Portrait of Williezer Valentín',
      division: 'inel',
      role: 'Electrical Lead',
      academicYear: '9th Year',
      isLeader: true,
      leadershipOrder: 5
    },
    {
      id: 'juliana-beltran',
      name: 'Juliana Beltrán',
      image: 'fotos/team/juliana-beltran.jpg',
      imageAlt: 'Portrait of Juliana Beltrán',
      division: 'inel',
      academicYear: '2nd Year',
      isLeader: false
    },
    {
      id: 'fidel-torres',
      name: 'Fidel Torres',
      image: 'fotos/team/fidel-torres.jpg',
      imageAlt: 'Portrait of Fidel Torres',
      division: 'inel',
      academicYear: '6th Year',
      isLeader: false
    },
    {
      id: 'diego-gonzales',
      name: 'Diego Gonzales',
      image: 'fotos/team/diego-gonzales.jpg',
      imageAlt: 'Portrait of Diego Gonzales',
      division: 'inel',
      academicYear: '1st Year',
      isLeader: false
    },
    {
      id: 'gustavo-gonzales',
      name: 'Gustavo Gonzales',
      image: 'fotos/team/gustavo-gonzales.jpg',
      imageAlt: 'Portrait of Gustavo Gonzales',
      division: 'inel',
      academicYear: '3rd Year',
      isLeader: false
    },
    {
      id: 'gilianie-avila',
      name: 'Gilianie Ávila',
      image: 'fotos/team/gilianie-avila.jpg',
      imageAlt: 'Portrait of Gilianie Ávila',
      division: 'inel',
      academicYear: '3rd Year',
      isLeader: false
    },
    {
      id: 'sergio-cartagena',
      name: 'Sergio Cartagena',
      image: 'fotos/team/sergio-cartagena.jpg',
      imageAlt: 'Portrait of Sergio Cartagena',
      division: 'inel',
      academicYear: '3rd Year',
      isLeader: false
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
