function moonPhase(date) {
  const synodicMonthInMs = 2551442878
  const aNewMoon = new Date('11 Feb 2021 19:05').getTime()
  const now = date.getTime()
  const moment = ((now - aNewMoon + 86450000) % synodicMonthInMs) / synodicMonthInMs 
  const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
  return phases[Math.floor(moment * 8)];
}

document.getElementById('moon').innerText = moonPhase(new Date())

