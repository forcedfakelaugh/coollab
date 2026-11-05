// A small typographic poster. CSS supplies the motion; no graphics runtime.
class SongArt extends HTMLElement {
  connectedCallback() {
    this.controller = new AbortController();
    this.visible = false;
    this.setAttribute('role', 'img');
    this.setAttribute('aria-label', 'SÓNG: bold white lettering and a lime sound wave on charcoal');
    this.innerHTML = `<div class="song-topline"><span>INDEPENDENT MUSIC</span><span>SAIGON / 2026</span></div><div class="song-word" aria-hidden="true"><span>S</span><span>Ó</span><span>N</span><span>G</span><sup>®</sup></div><svg class="song-wave" viewBox="0 0 1200 160" fill="none" aria-hidden="true"><path d="M-300 80Q-150-20 0 80T300 80T600 80T900 80T1200 80T1500 80"/></svg><div class="song-baseline"><span>A CITY IN MOTION.</span><span>01 / 26</span></div>`;
    const options = { signal: this.controller.signal };
    this.intersection = new IntersectionObserver(entries => { this.visible = entries[0].isIntersecting; this.updatePlayback(); });
    this.intersection.observe(this);
    document.addEventListener('visibilitychange', () => this.updatePlayback(), options);
    window.addEventListener('elseform-project', () => this.updatePlayback(), options);
    window.addEventListener('elseform-motion', () => this.updatePlayback(), options);
    this.updatePlayback();
  }
  updatePlayback() {
    const covered = !!document.querySelector('#project-dialog[open], #site-menu[open]') && !this.closest('dialog[open]');
    this.classList.toggle('is-paused', !this.visible || covered || document.hidden || document.body.classList.contains('motion-paused'));
  }
  disconnectedCallback() { this.controller.abort(); this.intersection.disconnect(); }
}
customElements.define('song-art', SongArt);
