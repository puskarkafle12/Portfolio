import { featuredProjects } from '@/data/portfolioContent.js'

export function ProjectsSection() {
  return (
    <section id="projects" className="section reveal">
      <div className="section-head">
        <p className="section-label">Portfolio</p>
        <h2>Featured Projects & Research Work</h2>
      </div>
      <div className="grid">
        {featuredProjects.map((project) => (
          <article className={project.featured ? 'card project-card-featured' : 'card'} key={project.title}>
            <p className="meta">Project</p>
            <h3>{project.title}</h3>
            <p className="project-summary">{project.summary}</p>
            <p className="project-tech">{project.tech}</p>
            {project.link ? (
              <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
