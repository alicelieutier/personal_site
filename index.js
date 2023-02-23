function moonPhase(date) {
  const synodicMonthInMs = 2551442878
  const aNewMoon = new Date('11 Feb 2021 19:05').getTime()
  const now = date.getTime()
  const moment = ((now - aNewMoon + 86450000) % synodicMonthInMs) / synodicMonthInMs 
  const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
  return phases[Math.floor(moment * 8)];
}

document.getElementById('moon').innerText = moonPhase(new Date())


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