const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const form = document.querySelector('#priority-form');
const status = document.querySelector('#form-status');

document.querySelector('#year').textContent = new Date().getFullYear();

function updateHeader(){
  header.classList.toggle('scrolled', window.scrollY > 40);
}
updateHeader();
window.addEventListener('scroll', updateHeader, {passive:true});

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

document.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded','false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Submitting…';
  status.textContent = '';

  try {
    const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSeoWXOSu--YlP6uCTV5IXh-ghcxNhsPHDaxep13_iKXfeadEQ/formResponse', {
      method: 'POST',
      mode: 'no-cors',
      body: new FormData(form)
    });
    status.textContent = 'Thank you for registering. You’re now on the Casabella priority list.';
    form.reset();
  } catch (error) {
    status.textContent = 'We could not submit your registration. Please try again.';
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
