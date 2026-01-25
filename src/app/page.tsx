import {
  Award,
  Briefcase,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Github,
  GraduationCap,
  LayoutTemplate,
  Linkedin,
  Mail,
  Terminal,
  Twitter,
  User,
  MapPin,
} from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/BentoGrid";
import GithubHeatmap from "@/components/GithubHeatmap";
import content from "../../content.json";

export default function Home() {
  const { personal, education, projects, skills, achievements } = content;

  const googleDoc = projects.find((p) => p.title.includes("Google"));
  const urlShortener = projects.find((p) => p.title.includes("URL"));
  const wanderlust = projects.find((p) => p.title.includes("Wanderlust"));

  return (
    <main className="min-h-screen bg-background p-8 md:p-16 font-base animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Section: Soham (Left, Thinner), About & Education (Right, Wide, Stacked) */}
        <BentoGrid className="md:grid-cols-3">
          {/* Thinner Left Box: Personal Info (Soham Shirke) */}
          <BentoGridItem
            title={personal.name}
            description={
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2 text-sm font-bold opacity-70">
                  <MapPin className="w-4 h-4" />
                  {personal.location}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={personal.resumeUrl}
                    target="_blank"
                    className="px-3 py-1.5 border-2 border-black bg-main font-heading text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    RESUME
                  </a>
                  <div className="flex gap-2">
                    <a
                      href={personal.github}
                      target="_blank"
                      className="p-1 border-2 border-black bg-white hover:bg-main transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={personal.linkedin}
                      target="_blank"
                      className="p-1 border-2 border-black bg-white hover:bg-main transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    {personal.x && (
                      <a
                        href={personal.x}
                        target="_blank"
                        className="p-1 border-2 border-black bg-white hover:bg-main transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            }
            header={
              <div className="flex-1 w-full h-full min-h-[8rem] rounded-none bg-white border-2 border-black flex items-center justify-center relative overflow-hidden group">
                {personal.profileImage ? (
                  <img
                    src={personal.profileImage}
                    alt={personal.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            }
            className="md:col-span-1 md:row-span-2"
          />

          {/* Wider Top Right Box: About Me */}
          <BentoGridItem
            title="About Me"
            description={personal.about}
            header={
              <div className="flex-1 w-full h-full min-h-[4rem] rounded-none bg-chart-5 border-2 border-black flex items-center justify-center">
                <User className="w-10 h-10 text-black" />
              </div>
            }
            className="md:col-span-2 md:row-span-1"
          />

          {/* Wider Bottom Right Box: Education */}
          <BentoGridItem
            title="Education"
            description={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[12rem] overflow-y-auto pr-2 custom-scrollbar">
                {education.map((edu) => (
                  <div
                    key={edu.institution}
                    className="border-l-4 border-black pl-3 py-1"
                  >
                    <p className="font-heading text-base leading-tight uppercase">
                      {edu.institution}
                    </p>
                    <p className="text-sm font-medium text-black/80">
                      {edu.degree}
                    </p>
                    <p className="text-xs text-black/60 font-bold">
                      {edu.duration} | {edu.grade}
                    </p>
                  </div>
                ))}
              </div>
            }
            header={
              <div className="flex-1 w-full h-full min-h-[3rem] rounded-none bg-chart-1 border-2 border-black flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-black" />
              </div>
            }
            className="md:col-span-2 md:row-span-1"
          />
        </BentoGrid>

        <h2 className="text-5xl font-heading uppercase py-4 border-b-4 border-black">
          Projects
        </h2>

        {/* Projects Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) =>
            idx === 0 ? (
              /* Featured Project (First Item) */
              <div
                key={project.title}
                className="md:col-span-2 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row gap-8 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition duration-200 overflow-hidden group"
              >
                <div className="flex-1 border-2 border-black bg-main min-h-[16rem] flex items-center justify-center overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <>
                      <Code2 className="w-24 h-24 text-black" />
                      <span className="absolute text-xs font-black uppercase tracking-widest opacity-20 rotate-45 scale-150">
                        Full Stack Project
                      </span>
                    </>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  <h3 className="text-4xl font-heading uppercase">
                    {project.title}
                  </h3>
                  <p className="text-xl leading-relaxed text-black/80 font-medium">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-bold border-2 border-black bg-chart-1 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        className="p-3 border-2 border-black bg-white hover:bg-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        className="p-3 border-2 border-black bg-white hover:bg-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Projects */
              <BentoGridItem
                key={project.title}
                title={project.title}
                description={
                  <div className="flex flex-col gap-4">
                    <span className="line-clamp-3">{project.description}</span>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-[10px] font-bold border-2 border-black bg-chart-2 uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                }
                header={
                  <div className="flex-1 w-full h-full min-h-[10rem] rounded-none bg-chart-4 border-2 border-black flex items-center justify-center overflow-hidden group">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <Code2 className="w-16 h-16 text-black/20 group-hover:text-black transition-colors" />
                    )}
                  </div>
                }
                icon={
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        className="p-2 border-2 border-black bg-white hover:bg-main transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        className="p-2 border-2 border-black bg-white hover:bg-main transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                }
              />
            ),
          )}
        </div>

        <h2 className="text-5xl font-heading uppercase py-4 border-b-4 border-black">
          Skills & More
        </h2>

        <BentoGrid className="lg:grid-cols-3">
          {/* Dynamic Skills Categories */}
          {Object.entries(skills).map(([category, items], idx) => {
            const icons = {
              programmingLanguages: <Code2 className="w-10 h-10 text-black" />,
              frameworks: <LayoutTemplate className="w-10 h-10 text-black" />,
              databases: <Database className="w-10 h-10 text-black" />,
              tools: <Terminal className="w-10 h-10 text-black" />,
            };
            const colors = [
              "bg-chart-1",
              "bg-chart-2",
              "bg-chart-3",
              "bg-chart-5",
            ];
            const titles = {
              programmingLanguages: "Languages",
              frameworks: "Frameworks",
              databases: "Databases",
              tools: "Tools",
            };

            return (
              <BentoGridItem
                key={category}
                title={titles[category as keyof typeof titles] || category}
                description={
                  <div className="flex flex-wrap gap-2 mt-4">
                    {items.map((skill: string) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 border-2 border-black ${colors[idx % colors.length]} text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-default`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                }
                header={
                  <div
                    className={`flex-1 w-full h-full min-h-[6rem] rounded-none ${colors[(idx + 2) % colors.length]} border-2 border-black flex items-center justify-center`}
                  >
                    {icons[category as keyof typeof icons] || (
                      <Cpu className="w-10 h-10 text-black" />
                    )}
                  </div>
                }
                className={idx === 0 ? "md:col-span-1" : "md:col-span-1"}
              />
            );
          })}

          <BentoGridItem
            title="Achievements"
            description={
              <ul className="space-y-4">
                {achievements.map((ach) => (
                  <li
                    key={ach.title}
                    className="border-l-4 border-black pl-4 py-2 hover:bg-black/5 transition-colors"
                  >
                    <p className="font-heading text-lg leading-tight mb-1 uppercase">
                      {ach.title}
                    </p>
                    <p className="text-base font-medium leading-relaxed text-black/80">
                      {ach.description}
                    </p>
                  </li>
                ))}
              </ul>
            }
            header={
              <div className="flex-1 w-full h-full min-h-[6rem] rounded-none bg-chart-4 border-2 border-black flex items-center justify-center">
                <Award className="w-12 h-12 text-black" />
              </div>
            }
            className="md:col-span-1" // Adjusted to fit grid
          />

          <BentoGridItem
            title="Let's Connect"
            description="Open for projects and collaborations. Feel free to reach out via email or socials!"
            header={
              <div className="flex-1 w-full h-full min-h-[6rem] rounded-none bg-chart-3 border-2 border-black flex items-center justify-center overflow-hidden">
                <div className="animate-bounce">
                  <Mail className="w-12 h-12 text-black" />
                </div>
              </div>
            }
            className="md:col-span-1" // Adjusted to fit grid flow
            href={`mailto:${personal.email}`}
          />

          {/* GitHub Heatmap */}
          <div className="md:col-span-3 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden group">
            <GithubHeatmap username={personal.github.split("/").pop() || "SohamShirke473"} />
          </div>
        </BentoGrid>

        <footer className="text-center py-16 border-t-4 border-black">
          <p className="font-heading text-xl uppercase font-black">
            &copy; {new Date().getFullYear()} {personal.name}
          </p>
        </footer>
      </div>
    </main>
  );
}
