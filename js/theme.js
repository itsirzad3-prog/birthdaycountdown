/* 🎨 Theme switcher — "cute" (white + pink) and "dreamy" (rose + lavender).
   The choice is remembered on the device. You can also share a link like  index.html?skin=dreamy  */
const SKINS = {
  cute:   { petals: ['🩷', '🤍', '🎀', '✨', '🌸'], confetti: ['#ff5f9e', '#ffadcb', '#ffffff', '#ffe0ec', '#ff8db8'] },
  dreamy: { petals: ['🌸', '✨', '🌷', '💫', '🤍'], confetti: ['#e8467c', '#ff8fb1', '#ffffff', '#cdb4db', '#b5fffc'] }
};
let skin = 'cute';

function seedPetals() {
  document.querySelectorAll('.petal').forEach(p => p.remove());
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('span');
    s.className = 'petal';
    s.textContent = SKINS[skin].petals[i % 5];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 14 + Math.random() * 14 + 'px';
    s.style.animationDuration = 14 + Math.random() * 12 + 's';
    s.style.animationDelay = -Math.random() * 20 + 's';
    document.body.appendChild(s);
  }
}

function setSkin(name, save) {
  if (!SKINS[name]) name = 'cute';
  skin = name;
  document.documentElement.dataset.skin = name;
  document.querySelectorAll('#skinSwitch button').forEach(b => b.classList.toggle('on', b.dataset.skin === name));
  seedPetals();
  if (save) { try { localStorage.setItem('birthdaySkin', name); } catch (e) {} }
}

document.querySelectorAll('#skinSwitch button').forEach(b => b.onclick = () => setSkin(b.dataset.skin, true));
let savedSkin = null;
try { savedSkin = localStorage.getItem('birthdaySkin'); } catch (e) {}
setSkin(new URLSearchParams(location.search).get('skin') || savedSkin || 'cute');
