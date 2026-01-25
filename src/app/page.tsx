import { BentoGrid, BentoGridItem } from "@/components/BentoGrid"
import content from "../../content.json"
import { Github, Linkedin, Mail, ExternalLink, GraduationCap, Code2, Briefcase, Award, User, Twitter } from "lucide-react"

export default function Home() {
    const { personal, education, projects, skills, achievements } = content

    const googleDoc = projects.find(p => p.title.includes("Google"))
    const urlShortener = projects.find(p => p.title.includes("URL"))
    const wanderlust = projects.find(p => p.title.includes("Wanderlust"))

    return (
        <main className="min-h-screen bg-background p-8 md:p-16 font-base">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Top Section: Soham (Left, Thinner), About & Education (Right, Wide, Stacked) */}
                <BentoGrid className="md:grid-cols-3">
                    {/* Thinner Left Box: Personal Info (Soham Shirke) */}
                    <BentoGridItem
                        title={personal.name}
                        description={
                            <div className="flex flex-wrap gap-2 mt-2">
                                <a href={personal.resumeUrl} target="_blank" className="px-3 py-1.5 border-2 border-black bg-main font-heading text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
                                    RESUME
                                </a>
                                <div className="flex gap-2">
                                    <a href={personal.github} target="_blank" className="p-1.5 border-2 border-black bg-white hover:bg-main transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                                        <Github className="w-4 h-4" />
                                    </a>
                                    <a href={personal.linkedin} target="_blank" className="p-1.5 border-2 border-black bg-white hover:bg-main transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                    {personal.x && (
                                        <a href={personal.x} target="_blank" className="p-1.5 border-2 border-black bg-white hover:bg-main transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                                            <Twitter className="w-4 h-4" />
                                        </a>
                                    )}
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
                        description={
                            <p className="text-base md:text-lg leading-relaxed text-black/80 font-medium">
                                {personal.about}
                            </p>
                        }
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
                                    <div key={edu.institution} className="border-l-4 border-black pl-3 py-1">
                                        <p className="font-heading text-base leading-tight">{edu.institution}</p>
                                        <p className="text-sm font-medium">{edu.degree}</p>
                                        <p className="text-xs text-black/60">{edu.duration} | {edu.grade}</p>
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

                <h2 className="text-5xl font-heading uppercase py-4 border-b-4 border-black">Projects</h2>

                {/* Projects Section: Reverted to Wide Top Box Mixed with Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Row: Google Doc Clone (Wide) */}
                    <div className="md:col-span-2 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row gap-8 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition duration-200">
                        <div className="flex-1 border-2 border-black bg-main min-h-[16rem] flex items-center justify-center overflow-hidden relative group">
                            {googleDoc?.image ? (
                                <img
                                    src={googleDoc.image}
                                    alt={googleDoc.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            ) : (
                                <>
                                    <Code2 className="w-24 h-24 text-black" />
                                    <span className="absolute text-xs font-black uppercase tracking-widest opacity-20 rotate-45 scale-150">Full Stack Project</span>
                                </>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center space-y-4">
                            <h3 className="text-4xl font-heading mb-2">{googleDoc?.title}</h3>
                            <p className="text-xl leading-relaxed text-black/80">{googleDoc?.description}</p>
                            <div className="flex gap-4">
                                {googleDoc?.githubUrl && <a href={googleDoc.githubUrl} target="_blank" className="p-2 border-2 border-black bg-white hover:bg-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"><Github className="w-6 h-6" /></a>}
                                {googleDoc?.liveUrl && <a href={googleDoc.liveUrl} target="_blank" className="p-2 border-2 border-black bg-white hover:bg-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"><ExternalLink className="w-6 h-6" /></a>}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: URL Shortener & Wanderlust */}
                    <BentoGridItem
                        title={urlShortener?.title}
                        description={
                            <div className="space-y-2">
                                <p className="text-sm leading-relaxed">{urlShortener?.description}</p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {urlShortener?.technologies.slice(0, 4).map(tech => (
                                        <span key={tech} className="text-[10px] px-2 py-0.5 border border-black bg-white font-black">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        }
                        header={
                            <div className="flex-1 w-full h-full min-h-[8rem] rounded-none bg-chart-4 border-2 border-black flex items-center justify-center overflow-hidden">
                                {urlShortener?.image ? (
                                    <img src={urlShortener.image} alt={urlShortener.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Code2 className="w-16 h-16 text-black" />
                                )}
                            </div>
                        }
                        icon={
                            <div className="flex gap-4">
                                {urlShortener?.githubUrl && <a href={urlShortener.githubUrl} target="_blank" className="p-2 border-2 border-black bg-white hover:bg-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"><Github className="w-5 h-5" /></a>}
                                {urlShortener?.liveUrl && <a href={urlShortener.liveUrl} target="_blank" className="p-2 border-2 border-black bg-white hover:bg-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"><ExternalLink className="w-5 h-5" /></a>}
                            </div>
                        }
                    />

                    <BentoGridItem
                        title={wanderlust?.title}
                        description={wanderlust?.description}
                        header={
                            <div className="flex-1 w-full h-full min-h-[8rem] rounded-none bg-chart-2 border-2 border-black flex items-center justify-center overflow-hidden">
                                {wanderlust?.image ? (
                                    <img src={wanderlust.image} alt={wanderlust.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Code2 className="w-16 h-16 text-black" />
                                )}
                            </div>
                        }
                        icon={
                            <div className="flex gap-4">
                                {wanderlust?.githubUrl && <a href={wanderlust.githubUrl} target="_blank" className="p-2 border-2 border-black bg-white hover:bg-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"><Github className="w-5 h-5" /></a>}
                                {wanderlust?.liveUrl && <a href={wanderlust.liveUrl} target="_blank" className="p-2 border-2 border-black bg-white hover:bg-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"><ExternalLink className="w-5 h-5" /></a>}
                            </div>
                        }
                    />
                </div>

                <h2 className="text-5xl font-heading uppercase py-4 border-b-4 border-black">Skills & More</h2>

                <BentoGrid className="lg:grid-cols-3">
                    <BentoGridItem
                        title={<span className="text-3xl font-heading">Expertise & Tools</span>}
                        description={
                            <div className="flex flex-wrap gap-2 mt-4">
                                {[...skills.programmingLanguages, ...skills.frameworks, ...skills.databases, ...skills.tools].map((skill) => (
                                    <span key={skill} className="px-3 py-1 border-2 border-black bg-chart-5 text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        }
                        header={
                            <div className="flex-1 w-full h-full min-h-[6rem] rounded-none bg-chart-2 border-2 border-black flex items-center justify-center">
                                <Briefcase className="w-12 h-12 text-black" />
                            </div>
                        }
                        className="md:col-span-2"
                    />

                    <BentoGridItem
                        title={<span className="text-2xl font-heading">Achievements</span>}
                        description={
                            <ul className="space-y-4">
                                {achievements.map((ach) => (
                                    <li key={ach.title} className="border-l-4 border-black pl-4 py-2">
                                        <p className="font-heading text-base leading-tight mb-1">{ach.title}</p>
                                        <p className="text-sm font-medium leading-relaxed">{ach.description}</p>
                                    </li>
                                ))}
                            </ul>
                        }
                        header={
                            <div className="flex-1 w-full h-full min-h-[6rem] rounded-none bg-chart-4 border-2 border-black flex items-center justify-center">
                                <Award className="w-12 h-12 text-black" />
                            </div>
                        }
                        className="md:col-span-1"
                    />

                    <BentoGridItem
                        title={<span className="text-2xl font-heading">Let's Connect</span>}
                        description={<p className="text-lg">Open for projects and collaborations.</p>}
                        header={
                            <div className="flex-1 w-full h-full min-h-[6rem] rounded-none bg-chart-3 border-2 border-black flex items-center justify-center overflow-hidden">
                                <div className="animate-bounce">
                                    <Mail className="w-12 h-12 text-black" />
                                </div>
                            </div>
                        }
                        className="md:col-span-3 lg:col-span-3"
                    />
                </BentoGrid>

                <footer className="text-center py-16 border-t-4 border-black">
                    <p className="font-heading text-xl">&copy; {new Date().getFullYear()} {personal.name}</p>
                </footer>
            </div>
        </main>
    )
}