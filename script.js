const form = document.getElementById('loginForm');
const createAccountLink = document.getElementById('createAccountLink');
const signupForm = document.getElementById('signupForm');
const signInLink = document.getElementById('signInLink');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const username = (data.get('username') || '').toString().trim();
    const password = (data.get('password') || '').toString();

    if (!username || !password) {
      alert('Please enter username and password.');
      return;
    }

    window.location.href = 'landing.html';
  });
}

const lectureButtons = document.querySelectorAll('.lecture-btn');
const videoPanel = document.getElementById('videoPanel');
const lectureVideo = document.getElementById('lectureVideo');
const videoTitle = document.getElementById('videoTitle');
const videoClose = document.getElementById('videoClose');

const sampleVideos = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://media.w3.org/2010/05/bunny/trailer.mp4',
];

function openVideoForLecture(lectureNumber) {
  if (!videoPanel || !lectureVideo) return;

  const randomUrl = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

  if (videoTitle) videoTitle.textContent = `Lecture ${lectureNumber}`;

  lectureVideo.pause();
  lectureVideo.removeAttribute('src');
  lectureVideo.load();

  lectureVideo.src = randomUrl;
  videoPanel.hidden = false;

  const playPromise = lectureVideo.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      // Autoplay can be blocked; controls still allow manual play.
    });
  }
}

if (lectureButtons.length) {
  lectureButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-lecture') || '';
      if (id === '1') {
        openVideoForLecture(1);
        return;
      }

      alert('This lecture will be added later.');
    });
  });
}

if (videoClose && videoPanel && lectureVideo) {
  videoClose.addEventListener('click', () => {
    lectureVideo.pause();
    lectureVideo.removeAttribute('src');
    lectureVideo.load();
    videoPanel.hidden = true;
  });
}

if (createAccountLink) {
  createAccountLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = createAccountLink.getAttribute('href') || 'signup.html';
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(signupForm);
    const username = (data.get('username') || '').toString().trim();
    const password = (data.get('password') || '').toString();

    if (!username || !password) {
      alert('Please create a username and password.');
      return;
    }

    window.location.href = 'landing.html';
  });
}

if (signInLink) {
  signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = signInLink.getAttribute('href') || 'index.html';
  });
}

const courseToggles = document.querySelectorAll('.course-toggle');

if (courseToggles.length) {
  courseToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const course = btn.closest('.course');
      const body = course ? course.querySelector('.course-body') : null;
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      courseToggles.forEach((otherBtn) => {
        otherBtn.setAttribute('aria-expanded', 'false');
        const otherCourse = otherBtn.closest('.course');
        const otherBody = otherCourse ? otherCourse.querySelector('.course-body') : null;
        if (otherBody) otherBody.hidden = true;
      });

      if (!body) return;

      btn.setAttribute('aria-expanded', (!isExpanded).toString());
      body.hidden = isExpanded;
    });
  });
}
