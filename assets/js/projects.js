(function(){
  const DISCIPLINE_TAGS = {
    robotics:   ['robotics','ros2','slam','uwb','navigation','tbm','vfd','automation','competition','ev3','robotc','award-winning'],
    mechanical: ['solidworks','sheet-metal','mechanical-design','manufacturing','inventor','safety','3d-printing','onshape','machining']
  }

  function getDiscipline(project){
    const tags = project.tags || []
    if(tags.some(t => DISCIPLINE_TAGS.robotics.includes(t)))   return 'robotics'
    if(tags.some(t => DISCIPLINE_TAGS.mechanical.includes(t))) return 'mechanical'
    return 'software'
  }

  const state = { items: [], filtered: [], activeDiscipline: 'all', query: '' }

  const elResults    = document.getElementById('project-results')
  const elSearch     = document.getElementById('search')
  const elDisc       = document.getElementById('discipline-filters')
  const modal        = document.getElementById('project-modal')
  const modalBody    = document.getElementById('modal-body')

  function compute(){
    const q = state.query.toLowerCase()
    let list = state.items.filter(p => {
      const matchesQuery = !q || [p.name, p.description, (p.stack||[]).join(' '), (p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
      const matchesDiscipline = state.activeDiscipline === 'all' || getDiscipline(p) === state.activeDiscipline
      return matchesQuery && matchesDiscipline
    })
    list.sort((a, b) => (new Date(b.added || 0)) - (new Date(a.added || 0)))
    state.filtered = list
    renderResults()
  }

  function renderResults(){
    if(!elResults) return
    if(!state.filtered.length){ elResults.innerHTML = '<p class="muted">No projects match.</p>'; return }
    elResults.innerHTML = state.filtered.map(p => {
      const discipline = getDiscipline(p)
      const outcome = p.outcome || p.description.split('.')[0]
      const chips = (p.stack || []).slice(0, 4).map(s => `<span class="tag">${s}</span>`).join('')
      return `<article class="project-card project-card--${discipline} reveal" data-id="${p.id}">
        <span class="project-org-label">${p.organization || ''}</span>
        <h3 class="project-name">${p.name}</h3>
        <p class="project-outcome">${outcome}</p>
        <div class="meta">${chips}</div>
        <div class="card-footer">
          <span class="muted" style="font-size:13px">${p.dateRange || ''}</span>
          <button class="btn btn-outline btn-sm" data-open="${p.id}">Details</button>
        </div>
      </article>`
    }).join('')
    requestAnimationFrame(() => {
      elResults.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
    })
  }

  function openModal(project){
    if(!modal) return
    const imagesHtml = project.images && project.images.length > 1
      ? `<div class="carousel">
          <div class="carousel-container">
            ${project.images.map((src, i) => `<img src="${src}" alt="${project.name} image ${i+1}" class="carousel-slide ${i === 0 ? 'active' : ''}">`).join('')}
          </div>
          <div class="carousel-controls">
            <button class="carousel-btn prev" aria-label="Previous image">‹</button>
            <div class="carousel-dots">
              ${project.images.map((_, i) => `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Go to image ${i+1}"></button>`).join('')}
            </div>
            <button class="carousel-btn next" aria-label="Next image">›</button>
          </div>
        </div>`
      : project.images && project.images.length === 1
        ? `<div class="project-image"><img src="${project.images[0]}" alt="${project.name}"></div>`
        : ''

    let descriptionHtml = project.description
    if(project.longDescription){
      const bullets = project.longDescription.split('\n').filter(line => line.trim().startsWith('•'))
      if(bullets.length > 0){
        descriptionHtml = `<ul class="project-description">${bullets.map(b => `<li>${b.replace('•','').trim()}</li>`).join('')}</ul>`
      } else {
        descriptionHtml = project.longDescription
      }
    }

    modalBody.innerHTML = `
      <h2>${project.name}</h2>
      ${project.organization ? `<h3 class="modal-organization">${project.organization}</h3>` : ''}
      <p class="muted">${(project.stack||[]).join(' · ')}</p>
      ${descriptionHtml}
      ${imagesHtml}
      <div class="card-actions">
        ${project.repo ? `<a class="btn btn-outline" href="${project.repo}" target="_blank" rel="noopener">Repository</a>` : ''}
        ${project.demo ? `<a class="btn btn-primary" href="${project.demo}" target="_blank" rel="noopener">Live Demo</a>` : ''}
      </div>`
    modal.setAttribute('aria-hidden', 'false')
    trapFocus(modal)
    initCarousel()
  }

  function closeModal(){ if(modal) modal.setAttribute('aria-hidden', 'true') }

  function trapFocus(dialog){
    const focusable = dialog.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    function handle(e){
      if(e.key === 'Escape'){ closeModal() }
      if(e.key === 'Tab' && focusable.length){
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus() }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus() }
      }
    }
    dialog.addEventListener('keydown', handle, { once: false })
    setTimeout(() => { const close = dialog.querySelector('.modal-close'); (close || first)?.focus() }, 0)
  }

  function initCarousel(){
    const carousel = modal?.querySelector('.carousel')
    if(!carousel) return
    const slides  = carousel.querySelectorAll('.carousel-slide')
    const dots    = carousel.querySelectorAll('.carousel-dot')
    const prevBtn = carousel.querySelector('.prev')
    const nextBtn = carousel.querySelector('.next')
    let current = 0
    function showSlide(i){ slides.forEach((s,j)=>s.classList.toggle('active',j===i)); dots.forEach((d,j)=>d.classList.toggle('active',j===i)); current=i }
    prevBtn?.addEventListener('click', () => showSlide((current - 1 + slides.length) % slides.length))
    nextBtn?.addEventListener('click', () => showSlide((current + 1) % slides.length))
    dots.forEach((d, i) => d.addEventListener('click', () => showSlide(i)))
    carousel.addEventListener('keydown', e => { if(e.key==='ArrowLeft') prevBtn?.click(); if(e.key==='ArrowRight') nextBtn?.click() })
  }

  function initEvents(){
    if(elResults){
      elResults.addEventListener('click', e => {
        const btn = e.target.closest('[data-open]')
        if(!btn) return
        const project = state.items.find(p => String(p.id) === btn.getAttribute('data-open'))
        if(project) openModal(project)
      })
    }
    if(elSearch){
      elSearch.addEventListener('input', e => { state.query = e.target.value; compute() })
    }
    if(elDisc){
      elDisc.addEventListener('click', e => {
        const btn = e.target.closest('.disc-btn')
        if(!btn) return
        elDisc.querySelectorAll('.disc-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        state.activeDiscipline = btn.dataset.discipline
        compute()
      })
    }
    if(modal){
      modal.addEventListener('click', e => { if(e.target.hasAttribute('data-close')) closeModal() })
      modal.querySelector('.modal-close')?.addEventListener('click', closeModal)
      document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal() })
    }
  }

  function init(){
    if(!elResults) return
    fetch('./assets/data/projects.json').then(r => {
      if(!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    }).then(items => {
      state.items = items
      initEvents()
      compute()
    }).catch(err => {
      console.error('Failed to load projects:', err)
    })
  }

  init()
})();
