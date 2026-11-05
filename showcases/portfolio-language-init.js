// Run in the head before the body can paint in the wrong language.
(() => {
  const root = document.documentElement;
  root.classList.add('language-pending');
  const pageReady = new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', resolve, { once: true });
  });
  Promise.all([import('./portfolio-language.js'), pageReady])
    .then(async ([module]) => {
      module.initializeLanguage();
      // Translation can request extra font subsets for accented characters.
      if (root.hasAttribute('data-wait-for-fonts')) await document.fonts.ready;
    })
    .catch(error => console.error('Could not initialize showcase language.', error))
    // Leave the original content usable if a translation file fails to load.
    .finally(() => root.classList.remove('language-pending'));
})();
