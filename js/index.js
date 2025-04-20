const markerList = [
    { id: 'marker-device', name: 'Device' },
    { id: 'marker-ethernet', name: 'Ethernet' },
    { id: 'marker-power', name: 'Power' },
    { id: 'marker-router', name: 'Router' }
  ];

  markerList.forEach(marker => {
    const el = document.getElementById(marker.id)

    el.addEventListener('markerFound', () => {
      alert(`${marker.name} marker found`);
    })

    el.addEventListener('markerLost', () => {
      console.log(`${marker.name} marker lost`);
    })
  });