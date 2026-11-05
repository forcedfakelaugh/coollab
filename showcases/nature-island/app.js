const plans = {
  slow: {
    title: 'Nowhere to be. Everything to see.',
    description: 'A day for salt air and slow pages.',
    stops: [
      ['09:00', 'Coffee at Shell Cove', 'Find a patch of sand and watch the little boats drift by.'],
      ['12:30', 'A long lunch in the grove', 'Unpack a picnic in the shade. The afternoon can wait.'],
      ['17:00', 'The lighthouse at golden hour', 'Follow the headland path for one last look at the sea.'],
    ],
  },
  adventure: {
    title: 'Take the path you haven’t taken.',
    description: 'A day for curious feet and wide-open views.',
    stops: [
      ['08:00', 'Up to Fern Lookout', 'Wind through the pines, then pause above the blue bay.'],
      ['12:00', 'Explore the tide pools', 'Look closely at the little worlds between the rocks.'],
      ['17:00', 'Sunset on the headland', 'Take the long way to the lighthouse. You’ve earned the view.'],
    ],
  },
  family: {
    title: 'Small feet. Big discoveries.',
    description: 'An easy day with room for everyone.',
    stops: [
      ['09:30', 'Shell spotting at the cove', 'Count the colours along the shore, then leave the shells for the sea.'],
      ['12:00', 'A picnic under the pines', 'Find a shady spot for sandwiches, stories and a little rest.'],
      ['15:30', 'Hello, lighthouse', 'Walk the gentle path together and wave to the passing boats.'],
    ],
  },
};
const itinerary = document.querySelector('#itinerary');
const status = document.querySelector('.save-status');
let selected = 'slow';
function renderPlan(pace) {
  if (!plans[pace]) return;
  selected = pace;
  const plan = plans[pace];
  // These strings are authored content; the shared language observer translates
  // the new nodes while preserving the selected radio and download state.
  itinerary.innerHTML = `<h3>${plan.title}</h3><p class="day-description">${plan.description}</p><ol class="itinerary-stops">${plan.stops.map(([time, title, description]) => `<li><time>${time}</time><div><h4>${title}</h4><p>${description}</p></div></li>`).join('')}</ol>`;
  status.textContent = '';
  window.showcaseLanguage?.refresh();
}
document.querySelectorAll('[name="pace"]').forEach(input => {
  input.addEventListener('change', () => { if (input.checked) renderPlan(input.value); });
});
document.querySelectorAll('[data-choose]').forEach(link => {
  link.addEventListener('click', () => {
    const pace = link.dataset.choose;
    document.querySelector(`[name="pace"][value="${pace}"]`).checked = true;
    renderPlan(pace);
  });
});
document.querySelector('.save-day').addEventListener('click', () => {
  const translate = value => window.showcaseLanguage?.translate(value) ?? value;
  const plan = plans[selected];
  const lines = ['NATURE ISLAND', translate(plan.title), translate(plan.description), '', ...plan.stops.flatMap(([time, title, description]) => [`${time} · ${translate(title)}`, translate(description), '']), translate('An imaginary itinerary. No reservations, just inspiration.')];
  const url = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `nature-island-${selected}-${document.documentElement.lang}.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Your plan is downloaded. A little inspiration to keep.';
  window.showcaseLanguage?.refresh();
});
renderPlan(selected);
