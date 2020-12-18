import { round1 , round2, round3 } from "./finals.mjs";

const rounds = [
  {
    speakers: round1,
    container: 'round1'
  },
  {
    speakers: round2,
    container: 'round2'
  },
  {
    speakers: round3,
    container: 'round3'
  }
];

// Populate Card Details
function setCard(student) {
  const card = document.querySelector('#card').content.cloneNode(true);

  // Name, tagline
  card.querySelector('header').innerHTML = student.name;
  if (student.tagline) {
    card.querySelector('p').innerText = student.tagline;
  } else {
    card.querySelector('p').remove();
  }
  
  // Profile pic
  const image = card.querySelector('img');

  // Set image src
  const src = (student.links[0].imageLink.length) ? student.links[0].imageLink  : (student.handle === "lauren") ? `assets/images/${student.handle}.jpg` : 'assets/images/this_is_fine.jpg'
  image.setAttribute('src', src);

  image.setAttribute('alt', `${student.name} Profile Pic`);

  // Trophies
  student.trophies = '';
  student.achievements.forEach(achievement => {
    if (achievement.trophy) {
      if (achievement.name === 'MVP') {
        student.trophies += `<li><img src="assets/images/mvp.svg" alt="${achievement.name} Icon" title="${achievement.name}"></a></li>`;
      } else if (achievement.name === 'Coach of the Year') {
        student.trophies += `<li><img src="assets/images/creative.svg" alt="${achievement.name} Icon" title="${achievement.name}"></li>`;
      } else if (achievement.name === 'Perfect Attendance') {
        student.trophies += `<li><img src="assets/images/perfect-attendance.svg" alt="${achievement.name} Icon" title="${achievement.name}"></li>`;
      } else if (achievement.name === 'Coach Plus One') {
        student.trophies += `<li><img src="assets/images/plus-1.svg" alt="${achievement.name} Icon" title="${achievement.name}"></li>`;
      } else if (achievement.name === 'MVP Plus One') {
        student.trophies += `<li><img src="assets/images/plus-1.svg" alt="${achievement.name} Icon" title="${achievement.name}"></li>`;
      }
    }
  });
  if (student.trophies) {
    card.querySelector('.trophies').innerHTML = student.trophies;
  } else {
    card.querySelector('.trophies').remove();
  }
  
  // Skills
  if (student.skills.length > 0) {
    console.log(Boolean(student.skills));
    card.querySelector('.skills').innerHTML = `${student.skills.join(', ')}`;
  } else {
    card.querySelector('.skills').remove();
  }

  // Social Links
  student.socials = '';
  student.links.forEach(link => {
    if (link.name === 'github') {
      if (link.username) {
        student.socials += `<li class="github"><a href="${link.username}" target="_blank"><i class="fab fa-github"></i></a></li>`;
      }
    } else if (link.name === 'codepen') {
      if (link.username) {
        student.socials += `<li class="codepen"><a href="${link.username}" target="_blank"><i class="fab fa-codepen"></i></a></li>`;
      }
    } else if (link.name === 'website') {
      if (link.link) {
        student.socials += `<li class="website"><a href="${link.link}" target="_blank"><i class="fas fa-home"></i></a></li>`;
      }
    } else if (link.name === 'linkedin') {
      if (link.link) {
        student.socials += `<li class="linkedin"><a href="${link.link}" target="_blank"><i class="fab fa-linkedin"></i></a></li>`;
      }
    } else {
      console.warn('unknown social');
    }
  });
  if (student.socials) {
    card.querySelector('.socials').innerHTML = student.socials;
  } else {
    card.querySelector('.socials').remove();
  }
  return card;
}


// Fetch implementation

fetch('https://sait-wbdv.herokuapp.com/api/v0/students/')
.then(res => {
  return res.json();
})
.then(students => {
  let output;
  
  rounds.forEach((round) => {
    const section = document.querySelector(`#${round.container}`);
    round.speakers.forEach((speaker) => {
      let student = '';
      let group = {};
      

      // Presentation title
      let presentation = document.querySelector('#presentation').content.cloneNode(true);

      if (speaker.title) {
        presentation.querySelector('header').innerHTML = `<h4>${speaker.title}</h4>`;
      } else {
        presentation.querySelector('header').innerHTML = `<h4>Portfolio Presentation</h4>`;
      }

      if (typeof speaker.members === 'undefined') {
        student = students.find((student) => student.handle === speaker.name);

        // Add to speaker list
        presentation.querySelector('ul').innerHTML = '';
        presentation.querySelector('ul').appendChild(setCard(student));
        section.appendChild(presentation);
        
      } else if (typeof speaker.members !== 'undefined') {
          // Group presentation
          presentation.querySelector('ul').innerHTML = '';
          presentation.querySelector('ul').classList.add('group');
          speaker.members.forEach((member) => {
            student = students.find((student) => student.handle === member);
            presentation.querySelector('ul').appendChild(setCard(student));
          });
      } else {
        return false;
      }
      section.appendChild(presentation);
    });
  });
});