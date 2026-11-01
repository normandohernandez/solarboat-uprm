(function () {
  'use strict';

  const divisions = Array.isArray(window.SOLAR_BOAT_DIVISIONS) ? window.SOLAR_BOAT_DIVISIONS : [];
  const members = Array.isArray(window.SOLAR_BOAT_TEAM_MEMBERS) ? window.SOLAR_BOAT_TEAM_MEMBERS : [];
  const advisor = window.SOLAR_BOAT_ADVISOR || null;
  const placeholderImage = 'fotos/emblema-bulldog-equipo.jpg';

  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const membersFor = divisionId => members
    .filter(member => member.division === divisionId)
    .sort((left, right) => {
      if (Boolean(left.isLeader) !== Boolean(right.isLeader)) return left.isLeader ? -1 : 1;
      return String(left.name).localeCompare(String(right.name)) || String(left.id).localeCompare(String(right.id));
    });

  const buildMemberCard = (member, modifier = '') => {
    const card = create('article', `team-profile-card reveal${modifier ? ` ${modifier}` : ''}`);
    const photo = create('div', 'team-profile-photo');
    const image = create('img');
    image.src = member.image || placeholderImage;
    image.alt = member.imageAlt || '';
    image.loading = 'lazy';
    image.addEventListener('error', () => { image.src = placeholderImage; }, { once: true });
    photo.appendChild(image);

    const body = create('div', 'team-profile-body');
    body.appendChild(create('h3', 'team-profile-name', member.name));
    if (member.role) body.appendChild(create('p', 'team-profile-role', member.role));
    if (member.major) body.appendChild(create('p', 'team-profile-meta', member.major));
    if (member.academicYear) body.appendChild(create('p', 'team-profile-meta', member.academicYear));
    card.append(photo, body);
    return card;
  };

  const buildAdvisorCard = person => {
    const card = create('article', 'advisor-card reveal');
    const identity = create('div', 'advisor-card-identity');
    const portrait = create('div', 'advisor-portrait');
    const monogram = create('span', 'advisor-monogram', 'GS');
    monogram.setAttribute('aria-hidden', 'true');
    const image = create('img');
    image.src = person.image;
    image.alt = person.imageAlt || '';
    image.loading = 'lazy';
    image.addEventListener('load', () => portrait.classList.add('has-image'));
    image.addEventListener('error', () => image.remove(), { once: true });
    portrait.append(monogram, image);

    const details = create('div', 'advisor-card-details');
    const name = create('h3', 'advisor-card-name');
    const profileLink = create('a', 'advisor-card-link', person.name);
    profileLink.href = person.profileUrl;
    profileLink.target = '_blank';
    profileLink.rel = 'noopener noreferrer';
    profileLink.setAttribute('aria-label', `${person.name} — view UPRM faculty profile`);
    name.appendChild(profileLink);
    details.append(create('span', 'advisor-card-label', 'Team Advisor'), name, create('p', 'advisor-card-role', person.role));
    identity.append(portrait, details);
    card.appendChild(identity);
    return card;
  };

  const renderOverview = overview => {
    const totalMembers = members.length;
    const memberStat = overview.querySelector('[data-team-member-count]');
    const divisionStat = overview.querySelector('[data-team-division-count]');
    if (memberStat) memberStat.textContent = String(totalMembers);
    if (divisionStat) divisionStat.textContent = String(divisions.length);

    const divisionGrid = overview.querySelector('[data-division-grid]');
    divisions.forEach(division => {
      const card = create('a', 'division-overview-card reveal');
      card.href = division.pageUrl;
      card.setAttribute('aria-label', `View ${division.name} members`);

      const top = create('div', 'division-card-top');
      top.append(
        create('span', 'division-card-code', division.shortCode),
        create('span', 'division-card-count', `${membersFor(division.id).length} ${membersFor(division.id).length === 1 ? 'member' : 'members'}`)
      );
      card.appendChild(top);
      card.appendChild(create('h3', 'division-card-title', division.name));
      card.appendChild(create('p', 'division-card-description', division.description));
      card.appendChild(create('span', 'division-card-action', 'View Members →'));
      divisionGrid.appendChild(card);
    });

    const leaders = members
      .filter(member => member.isLeader)
      .sort((left, right) => (Number(left.leadershipOrder) || 999) - (Number(right.leadershipOrder) || 999));
    const leadershipSection = overview.querySelector('[data-leadership-section]');
    const leadershipGrid = overview.querySelector('[data-leadership-grid]');
    if (!leaders.length) {
      if (leadershipSection) leadershipSection.hidden = true;
      return;
    }
    const captain = leaders.find(member => member.leadershipTier === 'captain' || member.role === 'Team Captain');
    const divisionLeaders = leaders.filter(member => member !== captain);

    if (captain) {
      const apex = create('div', 'leadership-apex');
      apex.appendChild(buildMemberCard(captain, 'leadership-card--captain'));
      leadershipGrid.appendChild(apex);
    }

    if (divisionLeaders.length) {
      const divisionRow = create('div', 'leadership-division-row');
      divisionLeaders.forEach(member => divisionRow.appendChild(buildMemberCard(member, 'leadership-card--division')));
      leadershipGrid.appendChild(divisionRow);
    }

    const advisorContainer = overview.querySelector('[data-team-advisor]');
    if (advisorContainer && advisor) advisorContainer.appendChild(buildAdvisorCard(advisor));
  };

  const renderDivision = page => {
    const divisionId = page.dataset.teamDivision;
    const division = divisions.find(item => item.id === divisionId);
    if (!division) {
      page.hidden = true;
      return;
    }

    document.title = `${division.name} — Solar Boat UPRM Team`;
    page.querySelector('[data-division-name]').textContent = division.name;
    page.querySelector('[data-division-description]').textContent = division.description;

    const divisionMembers = membersFor(division.id);
    const count = page.querySelector('[data-division-member-count]');
    count.textContent = `${divisionMembers.length} ${divisionMembers.length === 1 ? 'member' : 'members'}`;
    const grid = page.querySelector('[data-division-members]');
    divisionMembers.forEach(member => grid.appendChild(buildMemberCard(member)));

    if (!divisionMembers.length) {
      const empty = create('p', 'team-empty-state', 'Member information will be added soon.');
      grid.replaceWith(empty);
    }
  };

  const overview = document.querySelector('[data-team-overview]');
  if (overview) renderOverview(overview);
  const divisionPage = document.querySelector('[data-team-division]');
  if (divisionPage) renderDivision(divisionPage);
})();
