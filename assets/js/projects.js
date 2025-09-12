(function(){
  const state = { items: [], filtered: [], tags: new Set(), activeTags: new Set(), query: '', sort: 'recent' }

  const elResults = document.getElementById('project-results')
  const elFilters = document.getElementById('filters')
  const elSearch = document.getElementById('search')
  const elSort = document.getElementById('sort')

  const modal = document.getElementById('project-modal')
  const modalBody = document.getElementById('modal-body')

  function renderChips(){
    if(!elFilters) return
    const list = Array.from(state.tags).sort()
    elFilters.innerHTML = list.map(tag=>`<button class="chip" role="option" aria-selected="${state.activeTags.has(tag)}" data-tag="${tag}">${tag}</button>`).join('')
    elFilters.addEventListener('click', (e)=>{
      const btn = e.target.closest('.chip')
      if(!btn) return
      const tag = btn.getAttribute('data-tag')
      if(state.activeTags.has(tag)) state.activeTags.delete(tag); else state.activeTags.add(tag)
      btn.setAttribute('aria-selected', String(state.activeTags.has(tag)))
      compute()
    })
  }

  function compute(){
    const q = state.query.toLowerCase()
    let list = state.items.filter(p=>{
      const matchesQuery = !q || [p.name, p.description, p.stack.join(' '), (p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
      const matchesTags = state.activeTags.size === 0 || (p.tags||[]).some(t=>state.activeTags.has(t))
      return matchesQuery && matchesTags
    })
    if(state.sort === 'stars') list.sort((a,b)=> (b.stars||0)-(a.stars||0))
    else if(state.sort === 'name') list.sort((a,b)=> a.name.localeCompare(b.name))
    else list.sort((a,b)=> (new Date(b.added||b.updated||0)) - (new Date(a.added||a.updated||0)))
    state.filtered = list
    renderResults()
  }

  function renderResults(){
    if(!elResults) return
    if(!state.filtered.length){ elResults.innerHTML = '<p class="muted">No projects match.</p>'; return }
    elResults.innerHTML = state.filtered.map(p=>`<article class="project-card reveal" data-id="${p.id}">
      <h3>${p.name}</h3>
      ${p.organization ? `<h4 class="project-organization">${p.organization}</h4>` : ''}
      <p>${p.description}</p>
      <div class="meta"><span>★ ${p.stars}</span><span>${(p.tags||[]).map(t=>`<span class='tag'>${t}</span>`).join(' ')}</span></div>
      <div class="project-date"><span class="muted">${p.dateRange || 'Date TBD'}</span></div>
      <div class="card-actions">
        <button class="btn btn-outline" data-open="${p.id}">Details</button>
        ${p.repo ? `<a class="btn btn-outline" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
        ${p.demo ? `<a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener">Live</a>` : ''}
      </div>
    </article>`).join('');
    requestAnimationFrame(() => {
      document
        .querySelectorAll('#project-results .reveal')
        .forEach(el => el.classList.add('visible'));
    });
  }

  function openModal(project){
    if(!modal) return
    const imagesHtml = project.images && project.images.length > 1 ? 
      `<div class="carousel">
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
      </div>` : 
      project.images && project.images.length === 1 ? `<div class="project-image"><img src="${project.images[0]}" alt="${project.name}"></div>` : ''
    
    // Parse longDescription into bullet points
    let descriptionHtml = project.description
    if(project.longDescription) {
      const bullets = project.longDescription.split('\n').filter(line => line.trim().startsWith('•'))
      if(bullets.length > 0) {
        descriptionHtml = `<ul class="project-description">${bullets.map(bullet => `<li>${bullet.replace('•', '').trim()}</li>`).join('')}</ul>`
      } else {
        descriptionHtml = project.longDescription
      }
    }
    
    modalBody.innerHTML = `<h2>${project.name}</h2>
      ${project.organization ? `<h3 class="modal-organization">${project.organization}</h3>` : ''}
      <p class="muted">★ ${project.stars} • ${project.stack.join(', ')}</p>
      ${descriptionHtml}
      ${project.highlights ? `<ul>${project.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>` : ''}
      ${imagesHtml}
      <div class="card-actions">
        ${project.repo ? `<a class="btn btn-outline" href="${project.repo}" target="_blank" rel="noopener">Repository</a>` : ''}
        ${project.demo ? `<a class="btn btn-primary" href="${project.demo}" target="_blank" rel="noopener">Live Demo</a>` : ''}
      </div>`
    modal.setAttribute('aria-hidden','false')
    trapFocus(modal)
    initCarousel()
  }

  function closeModal(){ if(modal) modal.setAttribute('aria-hidden','true') }

  function onResultsClick(e){
    const btn = e.target.closest('[data-open]')
    if(!btn) return
    const id = btn.getAttribute('data-open')
    const project = state.items.find(p=>String(p.id)===String(id))
    if(project) openModal(project)
  }

  function trapFocus(dialog){
    const focusable = dialog.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length-1]
    function handle(e){
      if(e.key === 'Escape'){ closeModal() }
      if(e.key === 'Tab' && focusable.length){
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus() }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus() }
      }
    }
    dialog.addEventListener('keydown', handle, { once:false })
    setTimeout(()=>{ const close = dialog.querySelector('.modal-close'); (close||first)?.focus() }, 0)
  }

  function wireModal(){
    if(!modal) return
    modal.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close')) closeModal() })
    modal.querySelector('.modal-close')?.addEventListener('click', closeModal)
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal() })
  }

  function initEvents(){
    if(elResults){ elResults.addEventListener('click', onResultsClick) }
    if(elSearch){ elSearch.addEventListener('input', (e)=>{ state.query = e.target.value; compute() }) }
    if(elSort){ elSort.addEventListener('change', (e)=>{ state.sort = e.target.value; compute() }) }
    wireModal()
  }

  function initCarousel(){
    const carousel = modal?.querySelector('.carousel')
    if(!carousel) return
    
    const slides = carousel.querySelectorAll('.carousel-slide')
    const dots = carousel.querySelectorAll('.carousel-dot')
    const prevBtn = carousel.querySelector('.prev')
    const nextBtn = carousel.querySelector('.next')
    let currentSlide = 0
    
    function showSlide(index){
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index)
      })
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index)
      })
      currentSlide = index
    }
    
    function nextSlide(){
      showSlide((currentSlide + 1) % slides.length)
    }
    
    function prevSlide(){
      showSlide((currentSlide - 1 + slides.length) % slides.length)
    }
    
    prevBtn?.addEventListener('click', prevSlide)
    nextBtn?.addEventListener('click', nextSlide)
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i))
    })
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft') prevSlide()
      if(e.key === 'ArrowRight') nextSlide()
    })
  }

  function init(){
    if(!elResults) return
    fetch('./assets/data/projects.json').then(r=>{
      if(!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    }).then(items=>{
      console.log('Loaded projects:', items.length)
      state.items = items
      items.forEach(p=> (p.tags||[]).forEach(t=> state.tags.add(t)))
      renderChips()
      initEvents()
      compute()
    }).catch(err=>{
      console.error('Failed to load projects from JSON, using fallback:', err)
      // Fallback projects data (ordered by most recent first)
      const fallbackProjects = [
        {
          "id": 9,
          "name": "11 GA Sheet Metal Part Bending Project",
          "organization": "Sable Metal Manufacturing",
          "description": "Developed a sheet metal bending program using INFORM II programming language, achieving 100 parts in 3 hours (double the target).",
          "longDescription": "• Developed a sheet metal bending program to bend this part 6 times from scratch using the INFORM II programming language.\n• Programs were split into 3 sections, one for picking, one for bending, and one for stacking.\n• Parts could only be bent certain ways so I required an \"adjustment table\" to put the part down and pick it up from another angle to bend it, this adjustment code was included in the bending program.\n• Stacking the part required extreme precision and required the robot to move slower than it normally would to ensure no parts fall off the stack and are damaged.\n• The robot had to move at a speed fast enough so that 50 parts could be bent in 4 hours safely.\n• I was able to guarantee double that in 3 hours.",
          "stars": 4,
          "tags": ["inform-ii","robotics","manufacturing","automation","sheet-metal"],
          "stack": ["INFORM II","Robotics","Manufacturing","Automation"],
          "repo": null,
          "demo": null,
          "images": ["https://picsum.photos/seed/sheet-metal-1/800/420", "https://picsum.photos/seed/sheet-metal-2/800/420"],
          "added": "2025-01-01",
          "dateRange": "Jan 2025 — Apr 2025"
        },
        {
          "id": 10,
          "name": "Parallel Linkage Limit Switch",
          "organization": "Sable Metal Manufacturing",
          "description": "Designed a limit switch using parallel linkage mechanics out of sheet metal, eliminating previous switch model issues.",
          "longDescription": "• Used SolidWorks to design a limit switch using parallel linkage mechanics out of sheet metal.\n• Different thicknesses were used to not waste material while also retaining the strength of the switch.\n• Made completely in-house, low cost.\n• Previous switch models had issues with parts missing the switch and/or parts being too large for the part to even be bendable.\n• This model eliminates both concerns.",
          "stars": 3,
          "tags": ["solidworks","sheet-metal","mechanical-design","manufacturing"],
          "stack": ["SolidWorks","Sheet Metal","Mechanical Design"],
          "repo": null,
          "demo": null,
          "images": ["https://picsum.photos/seed/limit-switch-1/800/420", "https://picsum.photos/seed/limit-switch-2/800/420"],
          "added": "2025-01-01",
          "dateRange": "Mar 2025 — Apr 2025"
        },
        {
          "id": 7,
          "name": "2025 Not-a-Boring Competition",
          "organization": "WatDig",
          "description": "3rd place micro-scale Tunnel Boring Machine (TBM) with VFD control system and dead-reckoning navigation.",
          "longDescription": "• Engineered a micro-scale Tunnel Boring Machine (TBM) for the 2025 Not-A-Boring Competition.\n• Developed a control system to regulate the excavation rate of the TBM by adjusting the powertrain motor through a Variable Frequency Drive (VFD), ensuring optimal propulsion and excavation efficiency.\n• Programmed controls software for the motor's speed, output torque, and current draw through the VFD.\n• Developed a robust dead-reckoning-based navigation algorithm for precise TBM positioning and path control using Python.\n• Designed the motor, gearbox, and associated couplings in Onshape to withstand the 2200 Nm torque requirement.\n• Utilized rapid prototyping to create enclosures and mounts for above and below ground PCB control stations.\n• Developed an advanced muck removal system incorporating a venturi pump to effectively dampen and discharge soil during excavation.\n• Finished 3rd place.",
          "stars": 5,
          "tags": ["tbm","vfd","python","onshape","competition","robotics"],
          "stack": ["Python","Onshape","VFD","Electronics","Rapid Prototyping"],
          "repo": "https://github.com/yashpatel1314/",
          "demo": null,
          "images": ["https://picsum.photos/seed/tbm-2025-1/800/420", "https://picsum.photos/seed/tbm-2025-2/800/420", "https://picsum.photos/seed/tbm-2025-3/800/420", "https://picsum.photos/seed/tbm-2025-4/800/420"],
          "added": "2025-01-01",
          "dateRange": "May 2024 — Apr 2025"
        },
        {
          "id": 8,
          "name": "Custom Programming Language",
          "organization": "Personal",
          "description": "Python interpreter for stack-based programs with compiler for opcode parsing and p-code generation.",
          "longDescription": "• Developed a python interpreter to execute stack-based programs, supporting primarily arithmetic operations.\n• Created a compiler that parses opcodes (PUSH, POP, etc.) and generates p-code for program execution.",
          "stars": 4,
          "tags": ["python","interpreter","compiler","programming-language"],
          "stack": ["Python","Compiler Design","Interpreter"],
          "repo": "https://github.com/yashpatel1314/",
          "demo": null,
          "images": ["https://picsum.photos/seed/custom-lang-1/800/420", "https://picsum.photos/seed/custom-lang-2/800/420"],
          "added": "2025-01-01",
          "dateRange": "Sept 2024 — Oct 2024"
        },
        {
          "id": 1,
          "name": "2024 Not-A-Boring-Competition Navigation Challenge",
          "organization": "WatDig",
          "description": "1st place winning autonomous robot with React GUI, SLAM localization, and probabilistic path planning achieving 94% accuracy.",
          "longDescription": "• Developed a comprehensive autonomous navigation system for the Not-A-Boring-Competition held in Austin, Texas.\n• Built a React-based GUI to subscribe to ROS2 nodes and display real-time data from published sources.\n• Implemented a SLAM-based localization system using Python and Ultra WideBand (UWB) technology.\n• Programmed a probabilistic roadmap (PRM) to generate optimal routes with 94% accuracy.\n• Designed mechanical subsystem with 1/8th inch aluminum plates, machined axles and wheels.\n• Created holders for batteries, UWB, and motor drivers.\n• Integrated electrical subsystem with emergency stop, 4 lithium batteries, and 3 motor drivers.\n• Achieved 1st place victory at the competition.",
          "stars": 5,
          "tags": ["react","ros2","slam","uwb","navigation","competition","award-winning"],
          "stack": ["React","ROS2","Python","UWB","SLAM","PRM"],
          "repo": "https://github.com/yashpatel1314/",
          "demo": null,
          "images": ["https://picsum.photos/seed/not-boring-1/800/420", "https://picsum.photos/seed/not-boring-2/800/420", "https://picsum.photos/seed/not-boring-3/800/420", "https://picsum.photos/seed/not-boring-4/800/420"],
          "added": "2024-10-01",
          "dateRange": "Oct 2024 — Apr 2024"
        },
        {
          "id": 5,
          "name": "Kettle Handle",
          "organization": "Welbilt",
          "description": "Mild steel safety handle for industrial kettles, designed in Inventor and currently in use.",
          "longDescription": "• Created a kettle handle out of mild steel as a safety measure for industrial kettle operations.\n• Designed safety handle to prevent injuries from cart pushing and kettle damage.\n• Used Autodesk Inventor to create detailed assembly drawings.\n• Currently in active use at the manufacturing facility.",
          "stars": 3,
          "tags": ["inventor","safety","manufacturing"],
          "stack": ["Autodesk Inventor","Mild Steel","Manufacturing"],
          "repo": null,
          "demo": null,
          "images": ["https://picsum.photos/seed/kettle-1/800/420", "https://picsum.photos/seed/kettle-2/800/420"],
          "added": "2023-04-01",
          "dateRange": "Jan 2023 — Apr 2023"
        },
        {
          "id": 6,
          "name": "Tool Stand",
          "organization": "Welbilt",
          "description": "Mild steel and sheet metal tool stand for safe measuring tool storage.",
          "longDescription": "• Created a Tool Stand out of mild steel and sheet metal for safe measuring tool storage.\n• Designed stand to eliminate dangerous ground-level tool storage.\n• Prevented back injuries from constant bending to pick up tools.\n• Used mild steel and sheet metal construction for durability.\n• Currently in active use at the manufacturing facility.",
          "stars": 3,
          "tags": ["inventor","safety","sheet-metal"],
          "stack": ["Autodesk Inventor","Mild Steel","Sheet Metal"],
          "repo": null,
          "demo": null,
          "images": ["https://picsum.photos/seed/toolstand-1/800/420", "https://picsum.photos/seed/toolstand-2/800/420"],
          "added": "2023-04-01",
          "dateRange": "Jan 2023 — Apr 2023"
        },
        {
          "id": 2,
          "name": "Automated Forklift Prototype",
          "organization": "University of Waterloo",
          "description": "EV3-based autonomous forklift with RobotC programming and 3D printed components.",
          "longDescription": "• Constructed an autonomous forklift prototype using EV3 robotics and RobotC programming.\n• Created detailed flowcharts to map out robot path planning.\n• Implemented automatic object detection and lifting logic.\n• Programmed autonomous behaviors using RobotC.\n• Used EV3 mechanics and 3D printed parts for stable operation.\n• Designed forklift system to lift, hold, and drop objects at designated checkpoints.",
          "stars": 4,
          "tags": ["robotc","ev3","automation","3d-printing"],
          "stack": ["RobotC","EV3","3D Printing"],
          "repo": "https://github.com/yashpatel1314/",
          "demo": null,
          "images": ["https://picsum.photos/seed/forklift-1/800/420", "https://picsum.photos/seed/forklift-2/800/420"],
          "added": "2022-12-01",
          "dateRange": "Sept 2022 — Dec 2022"
        },
        {
          "id": 3,
          "name": "Traffic Light System",
          "organization": "Westlane Secondary School",
          "description": "Arduino-based 4-way stop traffic system with crosswalk and train functionality.",
          "longDescription": "• Developed an Arduino-based traffic light system that mimics a 4-way stop with crosswalk and train functionality.\n• Built complete 4-way intersection traffic control system.\n• Implemented crosswalk functionality with pedestrian signals.\n• Added train detection and warning system.\n• Used Arduino programming for traffic light sequencing.\n• Constructed with cardboard and scrap materials (except wiring and LEDs).\n• Soldered connections and integrated all electrical components.",
          "stars": 2,
          "tags": ["arduino","electronics","embedded"],
          "stack": ["Arduino","C++","Electronics"],
          "repo": "https://github.com/yashpatel1314/",
          "demo": null,
          "images": ["https://picsum.photos/seed/traffic-1/800/420", "https://picsum.photos/seed/traffic-2/800/420", "https://picsum.photos/seed/traffic-3/800/420"],
          "added": "2022-04-01",
          "dateRange": "Jan 2022 — Apr 2022"
        }
      ]
      state.items = fallbackProjects
      fallbackProjects.forEach(p=> (p.tags||[]).forEach(t=> state.tags.add(t)))
      renderChips()
      initEvents()
      compute()
    })
  }

  init()
})();
