const lightTiles = () => L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  maxZoom: 18
});

const heroMapEl = document.getElementById('hero-map');
if (heroMapEl) {
  const heroMap = L.map(heroMapEl, { scrollWheelZoom: false, worldCopyJump: true }).setView([25, -40], 2);
  lightTiles().addTo(heroMap);

  const locations = [
    { name: 'Chipanga, Tanzania', desc: 'Water & Garden Project', lat: -9.33, lng: 34.77, href: 'https://zanderhirman08.github.io/Chipanga-Water-Charlie-PC/' },
    { name: 'Boulder, CO', desc: 'CoNPS Native Seed StoryMap', lat: 40.015, lng: -105.2705, href: 'https://storymaps.arcgis.com/stories/62ef5034f6354fd686edf1f41c1125cd' },
    { name: 'Four Corners region (CO/NM/WY/UT)', desc: 'Wildfire Risk Model', lat: 37.0, lng: -109.0, href: '#projects' },
    { name: 'Sonoran Desert border region', desc: 'Migration Route Mapping', lat: 31.34, lng: -111.0, href: 'https://zanderhirman08.github.io/border-storymap/' }
  ];

  locations.forEach(loc => {
    L.circleMarker([loc.lat, loc.lng], {
      radius: 7,
      color: '#2f5d6b',
      weight: 2,
      fillColor: '#2f5d6b',
      fillOpacity: 0.6
    })
      .addTo(heroMap)
      .bindPopup(`<strong>${loc.name}</strong><br>${loc.desc}<br><a href="${loc.href}">View project</a>`);
  });
}

const wildfireMapEl = document.getElementById('wildfire-map');
if (wildfireMapEl) {
  const riskColors = { 1: '#2f855a', 2: '#a3b342', 3: '#dd9a1f', 4: '#d9622b', 5: '#b0261e' };
  const fireMap = L.map(wildfireMapEl, {
    scrollWheelZoom: false,
    zoomControl: false,
    attributionControl: false,
    renderer: L.canvas()
  }).setView([39, -105.7], 6);
  lightTiles().addTo(fireMap);

  fetch('assets/images/wildfire-project/risk_grid.json')
    .then(res => res.json())
    .then(points => {
      points.forEach(([lon, lat, risk]) => {
        L.circleMarker([lat, lon], {
          radius: 2,
          weight: 0,
          fillColor: riskColors[risk] || '#999',
          fillOpacity: 0.75
        }).addTo(fireMap);
      });
    });
}
