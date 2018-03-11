// WHATEVER THE WEATHER
// Project created by Krzysztof Kamieniecki as a part of application process in MONOGO LUBLIN
// 2018

// Description

// site is a main object. It is a collection of properties of website and methods for controlling data flow nad interactions.

// List of properties of site object

// active         indicates on current page (object in array of pages)
// content        all content data from wtw.json
// pages          array of pages
// activeContent  content data of current (active) page
// dataJsonUrl    url to wtw.json with content data
// apiConfig      object with parameters needed to make url for weather api
// rules          array of "rules" pages
// paginationPageRules  array of "rules" pages shown on Summary page (active sub-page)
// activePaginationPage number of active sub-page on Summary page
// bgImages       arrary with names of jpgs used as backgrounds

const site = {
  active: {
    id: 1,
    name: 'home',
    template: 'homeTpl'
  },
  content: '',
  pages: [],
  activeContent: {},
  dataJsonUrl: 'https://raw.githubusercontent.com/krowa-kura/WTW/master/wtw.json',
  apiConfig: {
    url: 'http://api.wunderground.com/api/',
    clientId: '35ff75c1a13dc7d6',
    lang: 'EN',
    city: 'Lublin',
    code: 'PL'
  },
  rules: [],
  paginationPageRules: [],
  activePaginationPage: 1,

  bgImages: [ 'bg-home.jpg', 'rule1.jpg', 'rule2.jpg', 'rule3.jpg', 'rule4.jpg', 'rule5.jpg', 'rule6.jpg', 'rule7.jpg', 'rule8.jpg', 'rule9.jpg', 'rule10.jpg', 'rule11.jpg', 'rule12.jpg', 'bg.jpg' ],

  // Getter of url for weather api
  get weatherJsonUrl () {
    return `${this.apiConfig.url}${this.apiConfig.clientId}/conditions/lang:${this.apiConfig.lang}/q/${this.apiConfig.code}/${this.apiConfig.city}.json`
  },

  // Inital function invoked after collecting content and weather data
  init: function () {
    this.makePages()
    this.setActiveContent()
    this.display()
  },

  // Making a array of pages from main menu links (based on data-name & data-template attribute values)
  makePages: function () {
    const links = Array.from(document.querySelectorAll('a[data-name]'))
    this.pages = []
    links.forEach((link, index) => {
      let page = {
        id: index,
        name: link.dataset.name,
        template: link.dataset.template
      }
      this.pages.push(page)
    })
    this.active = this.pages[0]
  },

  // sets active page after events
  setActivePage: function (e) {
    this.active = this.pages.filter(item => item.name === e.target.dataset.name)[0]
    document.querySelectorAll('.active').forEach(item => item.classList.remove('active'))
    e.target.classList.add('active')
    if (site.active.template === 'ruleTpl') {
      document.getElementById('navbarDropdown').classList.add('active')
    }
  },

  // sets content for active page
  setActiveContent: function () {
    this.activeContent = this.content.filter(page => page.name === this.active.name)[0]
  },

  // Redirect to display page depending on active site template
  display: function () {
    switch (this.active.template) {
      case 'homeTpl' : ui.displayHome(this.activeContent)
        break
      case 'ruleTpl' : ui.displayRule(this.activeContent)
        break
      case 'paginationTpl' : ui.displaySummary(this.activeContent)
        break
    }
  },

  // preloader of background images
  bgPreloader: function (arr) {
    arr.forEach(imgName => {
      let image = new Image()
      image.src = `img/${imgName}`
    })
  },

  // Make page visible from the beginning of #content div
  showFromTop: function (el) {
    const y = document.getElementById(el).offsetTop
    const ySite = window.pageYOffset
    if (y < ySite) window.scrollTo(0, y)
  }
}

// Initialization of objects

// siteData instance is responsible for collecting data from Weather API and site content data (json)
const siteData = new DataCollector()

// Collecting data from two sources with fetch and Promises
// After resolve both Promises data is assigned to site object
siteData.waitUntilGotData(siteData.getFetchPromise(site.weatherJsonUrl), siteData.getFetchPromise(site.dataJsonUrl))
  .then(function (values) {
    site.weather = values[0].current_observation
    site.content = values[1]
    site.rules = site.content.slice(1, 13)
    site.paginationPageRules = site.rules.slice(0, 3)
    site.init()
    console.log('Site data succesfully loaded')
  })

// ui set of templates home | rule | summary
const ui = new UI()

// Background images preloader function
site.bgPreloader(site.bgImages)

// Update weather data each 30 seconds
setInterval(function () {
  siteData.getWeatherData(site.weatherJsonUrl)
    .then(data => {
      site.weather = data.current_observation
      ui.displayWeather(site.weather)
    })
    .catch(err => console.log(err))
}, 30000)

// Add Event Listeners for links in the main navigation
const links = document.querySelectorAll('a[data-name]')

links.forEach(link => {
  link.addEventListener('click', function (e) {
    site.setActivePage(e)
    site.setActiveContent()
    site.display()
    e.preventDefault()
  })
})

// Reload document after click on the WTW logo
document.querySelector('.navbar-brand').addEventListener('click', function (e) {
  location.reload()
  e.preventDefault()
})

// info stuff for devs
console.info('%c MONOGO | Whatever the Weather | 2018%s', 'background:#1f9bcf; color:#eee; padding:5px', '💥')
