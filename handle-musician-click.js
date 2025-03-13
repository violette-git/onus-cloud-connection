document.addEventListener('DOMContentLoaded', () => {
  // Assuming musician profiles are elements with a class 'musician-profile'
  const musicianProfiles = document.querySelectorAll('.musician-profile');

  musicianProfiles.forEach(profile => {
    profile.addEventListener('click', () => {
      const musicianId = profile.getAttribute('data-musician-id');
      const stageName = profile.getAttribute('data-stage-name');
      console.log(`Musician ID: ${musicianId}, Stage Name: ${stageName}`);
    });
  });
});
