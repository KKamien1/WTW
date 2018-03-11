
class UI {
  constructor () {
    this.container = document.getElementById('container')
  }

  // Displays Home Page (homeTpl)
  displayHome (data) {
    this.container.classList.remove('flex-column')
    this.container.innerHTML = `

      ${ui.displayWeather(site.weather)}

      <div id="content" class="col-s12 p-5 bg${data.id - 1}" >
        <h1 id="heading" class="mb-3">${data.site}</h1>
        <h4>${data.headline}</h4>
        <h2 class="mb-3">${data.headlineend}</h2>
        <div>
          <p id="lead">${data.intro} <a class="text-info" href="https://jordanbpeterson.com/">${data.subintro}</a></p>
          <p class='lead-bg'>${data.rule}</p>
          <hr class="my-4">
          <a id="main-btn" class="btn btn-primary btn-lg mt-4" href="#" role="button">${data.btn}</a>
        </div>
      </div>
    `
    site.showFromTop('content')
    document.querySelector('#lead').classList.add('lead-bg')
    document.getElementById('main-btn').addEventListener('click', this.btnActions)
  }

  // Displays Rule Page (ruleTpl)
  displayRule (data) {
    this.container.classList.remove('flex-column')
    this.container.innerHTML = `
    
      ${ui.displayWeather(site.weather)}

      <div id="content" class="col-s12 p-5 bg${data.id - 1}">
        <h1 id="heading" class="h4 page${data.id - 1}">WHATEVER THE WEATHER</h1>
        <p class="display-4 wtw-blue">Rule #${data.id - 1}</p>
        <h2 id="headline" class="mb-4 page${data.id - 1}">${data.rule}</h2>
        <div>
            <p id="lead">${data.intro}</p>
            <hr class="my-4">
            <a id="back-btn" class="btn btn-primary btn-lg mt-4" href="#" role="button">back</a>
            <a id="next-btn" class="btn btn-primary btn-lg mt-4" href="#" role="button">${data.btn}</a>
        </div>
      </div>
      `
    site.showFromTop('content')
    document.querySelector('#lead').classList.add('lead-bg')

    document.getElementById('back-btn').addEventListener('click', this.btnActions)
    document.getElementById('next-btn').addEventListener('click', this.btnActions)
  }

  // Displays Summary page (paginationTpl)
  displaySummary (data) {
    // add class flex-colum to change container elements layout
    this.container.classList.add('flex-column')

    //  Creating pagination on Summary page
    const total = site.rules.length
    const perRow = 3
    const pagesNum = Math.round(total / perRow)

    // add html code with cards with rules
    this.container.innerHTML = this.createCards()

    // Creating buttons for pagination
    const div = document.createElement('div')
    const ul = document.createElement('ul')
    div.className = 'd-flex justify-content-center mb-3'
    ul.className = 'pagination pagination-lg'
    // Each button is created in loop
    for (let i = 1; i <= pagesNum; i++) {
      const li = document.createElement('li')
      const a = document.createElement('a')
      const numTxt = document.createTextNode(i)
      li.classList.add('page-item')
      if (site.activePaginationPage === i) {
        li.classList.add('active')
      }
      a.classList.add('page-link')
      a.dataset.page = i
      a.setAttribute('href', '#')
      a.appendChild(numTxt)
      li.appendChild(a)
      ul.appendChild(li)
    }

    if (site.activePaginationPage === 1) ul.firstChild.classList.add('active')
    div.appendChild(ul)
    this.container.appendChild(div)

    // Display Summary page after pagination buttons click
    function displayPaginationPage (e) {
      document.querySelector('.page-item').classList.remove('active')
      this.parentNode.classList.add('active')
      let activePage = site.activePaginationPage = parseInt(e.target.dataset.page)

      // select elements form site.rules to be shown on Summary page
      site.paginationPageRules = site.rules.slice((activePage - 1) * perRow, (activePage - 1) * perRow + perRow)

      // display Summary page with new parameters
      site.display()
      site.showFromTop('container')
      e.preventDefault()
    }

    // Add Event Listeners for pagination buttons
    const btns = document.querySelectorAll('.page-link');
    [...btns].forEach(btn => btn.addEventListener('click', displayPaginationPage))
  }

  // Displays Weather Data in #weather div (homeTpl and ruleTpl)
  displayWeather (data) {
    const output = `
      <div id="weather" class="col-s12 p-5">
        <div class="card bg-light mb-3">
          <h3 class="card-header text-center">${data.display_location.city}</h3>
            <div class="card-body">
              <h4 class="card-title text-center">${data.weather} </h4>
              <p class="card-text text-center"><img id="weather-icon" src="${data.icon_url}" ></p>
              <p class="card-text text-center align-middle">Temperature: <span class="value-info align-middle">${data.temp_c}&#8451;<span></p>
              <p class="card-text text-center align-middle">Feels like: <span class="value-info align-middle">${data.feelslike_c}&#8451;<span></p>
              <p class="card-text text-center align-middle">Humidity: <span class="value-info align-middle">${data.relative_humidity}<span></p>
            </div>
        </div>
      </div>
      `
    return output
  }

  // Helper - Loop for generating html code for each card with rule
  createCards () {
    let html = ''
    html = site.paginationPageRules.map((rule, index) => {
      return `
            <div class="col-md-4">
              <div class="card bg-light mb-3 animation-delay${index}">
                <div class="card-header">Rule #${rule.id - 1}</div>
                <div class="card-body">
                  <h4 class="card-title">${rule.rule}</h4>
                  <p class="card-text">${rule.intro}</p>
                </div>
              </div>
            </div>
          `
    }).join('')
    html = `<div class="cards row mt-5 m-4">${html}</div>`
    return html
  }
  // Event handler for buttons in #content div
  btnActions (e) {
    if (e.target.id === 'main-btn') {
      site.active = site.pages[1]
    } else if (e.target.id === 'back-btn') {
      site.active = site.pages[site.active.id - 1]
    } else if (e.target.id === 'next-btn') {
      site.active = (site.active.id < 13) ? site.pages[site.active.id + 1] : site.pages[0]
    }
    site.setActiveContent()
    site.display()
    e.preventDefault()
  }
}
