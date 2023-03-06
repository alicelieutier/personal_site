function moonPhase(date) {
  const synodicMonthInMs = 2551442878
  const aNewMoon = new Date('11 Feb 2021 19:05').getTime()
  const now = date.getTime()
  const moment = ((now - aNewMoon + 86450000) % synodicMonthInMs) / synodicMonthInMs 
  const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
  return phases[Math.floor(moment * 8)];
}

document.getElementById('moon').innerText = moonPhase(new Date())

// generate code for audit
const genCodeButton = document.getElementById('gen-code')
const codeResult = document.getElementById('result-code')
const codeEmail = document.getElementById('report-email')
genCodeButton.addEventListener('click', () => {
  // fetch https://random-word-api.herokuapp.com/word?length=5&number=3
  fetch("https://random-word-api.herokuapp.com/word?length=5&number=3")
  .then((response) => response.json())
  .then((data) => {
    // alert the result
    const teamCode = data.join('-')
    codeResult.innerText = teamCode
    codeEmail.href = `mailto:alice@lieutier.me?subject=Requesting%20a%20report%20for%20team%20code:%20${teamCode}`
  })
  .catch((error) => {
    console.error("There has been a problem with the code generation:", error);
  });
})

// insta feed
const instaSection = document.getElementById('instafeed');
const feed = document.getElementById('feed');
const HOUR_IN_MILLISECONDS = 1000*60*60

async function showInstaFeed(div, callback) {
  // fetch from behold + cache in local storage to avoid
  // overusing
  let posts = JSON.parse(localStorage.getItem('instaPosts'))
  let cacheDate = localStorage.getItem('instaPostsDate')
  if (posts == null || Date.now() - cacheDate > 12*HOUR_IN_MILLISECONDS) {
    console.log('fetching instagram posts')
    let response = await fetch("https://feeds.behold.so/mL2MHftJ3BTU8quhsp6a");
    if (!response.ok) {
      console.log('fetching failed, falling back on cached posts')
      response = await fetch("/cached_insta_feed.json");
    }
    posts = await response.json()
    localStorage.setItem('instaPosts', JSON.stringify(posts));
    localStorage.setItem('instaPostsDate', Date.now());
  }

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const element = document.createElement('div')
    element.className = 'post'
    element.innerHTML = `
    <a href="${post.permalink}">
      <img width="250" height="250" alt="${post.prunedCaption}" src="${post.mediaUrl}">
    </a>
    `
    div.appendChild(element)
  }
  callback()
}

showInstaFeed(feed, () => instaSection.style.display = 'block')

// testimonial carousels
class Slide {
  constructor(htmlNode) {
    this.content = htmlNode
  }

  appear() {
    this.content.style.opacity = '100%';
    this.content.style.zIndex = '100';
  }

  disappear() {
    this.content.style.opacity = '0';
    this.content.style.zIndex = '0';
  }
}

class Carrousel {
  constructor(parentNode) {
    // create an array containing the nodes
    this.parentNode = parentNode
    this.slides = [...parentNode.children].map((node, index) => new Slide(node, index))
    this.currentSlide = 0
    this.slides.forEach(slide => slide.disappear())
    this.slides[this.currentSlide].appear()
  }

  prevSlideIndex() {
    return (this.slides.length + this.currentSlide - 1) % this.slides.length
  }

  nextSlideIndex() {
    return (this.currentSlide + 1) % this.slides.length
  }

  next() {
    this.slides[this.nextSlideIndex()].appear()
    this.slides[this.currentSlide].disappear()
    this.currentSlide = this.nextSlideIndex()
  }

  prev() {
    this.slides[this.prevSlideIndex()].appear()
    this.slides[this.currentSlide].disappear()
    this.currentSlide = this.prevSlideIndex()
  }
}

const caroussel = new Carrousel(document.getElementById('carrousel'));
let tick = Date.now()

caroussel.parentNode.addEventListener("mousedown", () => tick = Date.now(), true)
function step() {
  if (Date.now() - tick > 4000) {
    caroussel.next()
    tick = Date.now()
  }
  window.requestAnimationFrame(step)
}
window.requestAnimationFrame(step)

window.c = caroussel