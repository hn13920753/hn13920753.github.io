/* 點閱統計（Google Analytics 4）
   把下面的 G-XXXXXXXXXX 換成你自己的評估 ID 就會開始統計。 */
(() => {
  'use strict';
  const GA_ID = 'G-XXXXXXXXXX';
  if (!/^G-[A-Z0-9]{4,}$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;
  if (/^(localhost|127\.)/.test(location.hostname)) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  // 記錄「有人按了聯絡方式」：LINE、Facebook、Email、Instagram、YouTube
  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button');
    if (!el) return;
    const href = el.getAttribute('href') || '';
    let method = '';
    if (el.id === 'copy-line') method = 'LINE 複製 ID';
    else if (href.includes('line.me')) method = 'LINE 加好友';
    else if (href.includes('facebook.com')) method = 'Facebook';
    else if (href.startsWith('mailto:')) method = 'Email';
    else if (href.includes('instagram.com')) method = 'Instagram';
    else if (href.includes('youtube.com')) method = 'YouTube';
    if (method) gtag('event', 'contact_click', { method: method, page: location.pathname });
  });
})();
