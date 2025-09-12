(function(){
  const root = document.documentElement
  const savedTheme = localStorage.getItem('theme')
  if(savedTheme === 'light'){ root.classList.add('light') }

  const themeToggle = document.getElementById('theme-toggle')
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      root.classList.toggle('light')
      const isLight = root.classList.contains('light')
      localStorage.setItem('theme', isLight ? 'light' : 'dark')
    })
  }

  const navToggle = document.querySelector('.nav-toggle')
  const navMenu = document.getElementById('nav-menu')
  if(navToggle && navMenu){
    navToggle.addEventListener('click', ()=>{
      const opened = navMenu.classList.toggle('open')
      navToggle.setAttribute('aria-expanded', String(opened))
    })
    document.addEventListener('click', (e)=>{
      if(!navMenu.contains(e.target) && !navToggle.contains(e.target)){
        navMenu.classList.remove('open')
        navToggle.setAttribute('aria-expanded','false')
      }
    })
  }

  const yearEl = document.getElementById('year')
  if(yearEl){ yearEl.textContent = new Date().getFullYear() }

  const revealEls = document.querySelectorAll('.reveal')
  if(revealEls.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible') } })
    },{threshold: .15})
    revealEls.forEach(el=>io.observe(el))
  }

  const recent = document.getElementById('recent-projects')
  if(recent){
    // Fallback projects data (ordered by most recent first)
    const fallbackProjects = [
      {
        "id": 9,
        "name": "11 GA Sheet Metal Part Bending Project",
        "organization": "Sable Metal Manufacturing",
        "description": "Developed a sheet metal bending program using INFORM II programming language, achieving 100 parts in 3 hours (double the target).",
        "stars": 4,
        "stack": ["INFORM II","Robotics","Manufacturing","Automation"],
        "repo": null,
        "demo": null,
        "dateRange": "Jan 2025 — Apr 2025"
      },
      {
        "id": 10,
        "name": "Parallel Linkage Limit Switch",
        "organization": "Sable Metal Manufacturing",
        "description": "Designed a limit switch using parallel linkage mechanics out of sheet metal, eliminating previous switch model issues.",
        "stars": 3,
        "stack": ["SolidWorks","Sheet Metal","Mechanical Design"],
        "repo": null,
        "demo": null,
        "dateRange": "Mar 2025 — Apr 2025"
      },
      {
        "id": 7,
        "name": "2025 Not-a-Boring Competition",
        "organization": "WatDig",
        "description": "3rd place micro-scale Tunnel Boring Machine (TBM) with VFD control system and dead-reckoning navigation.",
        "stars": 5,
        "stack": ["Python","Onshape","VFD","Electronics","Rapid Prototyping"],
        "repo": "https://github.com/yashpatel1314/",
        "demo": null,
        "dateRange": "May 2024 — Apr 2025"
      },
      {
        "id": 8,
        "name": "Custom Programming Language",
        "organization": "Personal",
        "description": "Python interpreter for stack-based programs with compiler for opcode parsing and p-code generation.",
        "stars": 4,
        "stack": ["Python","Compiler Design","Interpreter"],
        "repo": "https://github.com/yashpatel1314/",
        "demo": null,
        "dateRange": "Sept 2024 — Oct 2024"
      },
      {
        "id": 1,
        "name": "2024 Not-A-Boring-Competition Navigation Challenge",
        "organization": "WatDig",
        "description": "1st place winning autonomous robot with React GUI, SLAM localization, and probabilistic path planning achieving 94% accuracy.",
        "stars": 5,
        "stack": ["React","ROS2","Python","UWB","SLAM","PRM"],
        "repo": "https://github.com/yashpatel1314/",
        "demo": null,
        "dateRange": "Oct 2024 — Apr 2024"
      },
      {
        "id": 5,
        "name": "Kettle Handle",
        "organization": "Welbilt",
        "description": "Mild steel safety handle for industrial kettles, designed in Inventor and currently in use.",
        "stars": 3,
        "stack": ["Autodesk Inventor","Mild Steel","Manufacturing"],
        "repo": null,
        "demo": null,
        "dateRange": "Jan 2023 — Apr 2023"
      },
      {
        "id": 6,
        "name": "Tool Stand",
        "organization": "Welbilt",
        "description": "Mild steel and sheet metal tool stand for safe measuring tool storage.",
        "stars": 3,
        "stack": ["Autodesk Inventor","Mild Steel","Sheet Metal"],
        "repo": null,
        "demo": null,
        "dateRange": "Jan 2023 — Apr 2023"
      }
    ]
    
    fetch('./assets/data/projects.json').then(r=>{
      if(!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    }).then(items=>{
      const top = items.slice(0,3)
      recent.innerHTML = top.map(p=>`<article class="project-card reveal">
        <h3>${p.name}</h3>
        ${p.organization ? `<h4 class="project-organization">${p.organization}</h4>` : ''}
        <p>${p.description}</p>
        <div class="meta"><span>★ ${p.stars}</span><span>${p.stack.join(', ')}</span></div>
        <div class="project-date"><span class="muted">${p.dateRange || 'Date TBD'}</span></div>
        <div class="card-actions">
          ${p.repo ? `<a class="btn btn-outline" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
          ${p.demo ? `<a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener">Live</a>` : ''}
        </div>
      </article>`).join('')
    }).catch(err=>{
      console.error('Failed to load recent projects from JSON, using fallback:', err)
      const top = fallbackProjects.slice(0,3)
      recent.innerHTML = top.map(p=>`<article class="project-card reveal">
        <h3>${p.name}</h3>
        ${p.organization ? `<h4 class="project-organization">${p.organization}</h4>` : ''}
        <p>${p.description}</p>
        <div class="meta"><span>★ ${p.stars}</span><span>${p.stack.join(', ')}</span></div>
        <div class="project-date"><span class="muted">${p.dateRange || 'Date TBD'}</span></div>
        <div class="card-actions">
          ${p.repo ? `<a class="btn btn-outline" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
          ${p.demo ? `<a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener">Live</a>` : ''}
        </div>
      </article>`).join('')
    })
  }
})();
