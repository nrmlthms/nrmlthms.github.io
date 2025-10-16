"use client"
import {CiLocationOn, CiTwitter} from "react-icons/ci";
import {FaGithub, FaLinkedinIn, FaSchool, FaTwitterSquare} from "react-icons/fa";
import {AiFillInstagram} from "react-icons/ai";
import Link from "next/link";



export default function Home() {
  return <Layout>
                <section>
                    <section>
                        <h1 className={'heading'}>Nirmal Thomas Tyagi / NLP Scientist</h1>
                        <p className={'text'}>I am an assistant professor at <a href={"#"}>MBZUAI</a> and adjunct faculty at Monash Indonesia. I obtained my Ph.D. from the University of Edinburgh’s Institute for Language, Cognition, and Computation, where I focused on enhancing the training and inference speed of machine translation. My studies were supervised by Dr. Kenneth Heafield and Dr. Rico Sennrich.</p>

                        <p className={'text'}>Presently, my research centers around multilingual, low-resource, and low-compute NLP. I have been developing various multilingual large language models, as well as building multilingual NLP resources for underrepresented languages, especially Indonesian. In the past, I have gained industry experience at companies such as Amazon, Google, and Apple. I work closely with multilingual research communities, especially the grassroots Southeast Asia NLP community, <a href={"#"}>SEACrowd</a>. I am currently on the Advisory Board of the ACL Special Interest Group <a href={"#"}>SIGSEA</a>.</p>



                        <p className={'text'}>I am into competitive programming; previously an <a href={"#"}>IOI 2010 Silver Medalist</a> and an ICPC 2014 World Finalist. Nowadays, I write problems for various contests and contribute to IA-TOKI (Indonesia’s national team for the Informatics Olympiad). Recently, I have also been interested in the International Olympiad in AI (IOAI).

                        </p>
                    </section>

                    <br/>
                    <br/>
                    <br/>
                    <section className={'experience-education'}>
                        <div>
                            <h4 className={'headingSimple'}>Experience</h4>
                            <Card title={"MBZUAI"} description={"Monash University, Melbourne, Australia"} timeline={"2022 - Present"}/>
                            <Card title={"MBZUAI"} description={"Monash University, Melbourne, Australia"} timeline={"2022 - Present"}/>
                            <Card title={"MBZUAI"} description={"Monash University, Melbourne, Australia"} timeline={"2022 - Present"}/>
                            <Card title={"MBZUAI"} description={"Monash University, Melbourne, Australia"} timeline={"2022 - Present"}/>

                        </div>
                        <div>
                            <h4 className={'headingSimple'}>Education</h4>

                            <div>
                                <Card title={"MBZUAI"} description={"Monash University, Melbourne, Australia"} timeline={"2022 - Present"}/>
                                <Card title={"MBZUAI"} description={"Monash University, Melbourne, Australia"} timeline={"2022 - Present"}/>
                                <Card title={"MBZUAI"} description={"Monash University, Melbourne, Australia"} timeline={"2022 - Present"}/>
                                <Card title={"MBZUAI"} description={"Monash University, Melbourne, Australia"} timeline={"2022 - Present"}/>
                            </div>

                        </div>
                    </section>

                    <br/>
                    <br/>
                    <br/>

                    <section>
                        <h4 className={'headingSimple'}>Research</h4>
                        <p className={'text'}>An accurate representation of my publication output can be found on my Google Scholar profiles.</p>
                        <p className={'text'}>My <a href={"#"}>research group</a> at MBZUAI focuses on multilinguality, low-resource NLP, efficiency, and other exciting directions in NLP research. I also co-advise external students from Indonesia, currently collaborating mainly with ITB, Monash, and Universitas Indonesia.</p>
                        <p className={'text'}>If you&#39;re interested in joining as a student, please apply through the standard <a href={"#"}>MBZUAI admissions process</a> for a fully-funded PhD and MSc program with generous stipend. After acceptance, a supervisor-student matching process will take place, and I’d be happy to discuss potential collaboration at that stage.</p>
                        <p className={'text'}>Please note that I am not currently hiring research assistants or postdoctoral researchers.</p>
                    </section>
                </section>
          </Layout>;
}


function Card({title, description,timeline}) {
    return (
        <div className={'card-container'}>
            <div className={'card-dot'}>

            </div>
            <div className={'card'}>
                <div>
                    <p className={'card-title'}>{title}</p>
                    <div className={'card-location'}>
                        <CiLocationOn className={'card-icon'} />
                        <p className={'card-desc'}>{description}</p>
                    </div>
                </div>
                <p className={'card-timeline'}>{timeline}</p>
            </div>
        </div>
    );
}


function Header(){
    return (
        <div className={'header_div'}>
            <div className={' container header'}>
                <h1 className={'header-logo'}>Nirmal Thomas Tyagi</h1>
                <div className={'nav-links-tab'}>
                    <a className={'nav-link'}>Publications</a>
                    <a className={'nav-link'}>Teams</a>
                    <Link target={'_blank'} className={'nav-link'} href={'/cv'}>CV</Link>
                </div>
            </div>
        </div>
    )
}


function Sidebar(){
    return (
        <div className={'sidebar'}>
            <div className={'sidebar-img-div'}>
                <img className={'sidebar-img'} src={"https://media.licdn.com/dms/image/v2/D4D03AQFRkz0LMF_l2g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1684418148863?e=2147483647&v=beta&t=MXfCPb3MlBlGPNouRWygOpzfu5XT0CGyZZ8qmTyeYxY"} alt={"profile"}/>
            </div>
            <h3 className={'sidebar-title'}>Nirmal Thomas Tyagi</h3>
            <p className={'sidebar-position'}>Assistant Professor MBZUAI,</p>
            <p className={'sidebar-position'}>Monash Indonesia</p>
            <div className={'sidebar-links'}>
                <div className={'sidebar-link-item'}>
                    <CiTwitter/>
                    <p>Twitter</p>
                </div>

                <div className={'sidebar-link-item'}>
                    <FaLinkedinIn/>
                    <p>LinkedIn</p>
                </div>

                <div className={'sidebar-link-item'}>
                    <FaGithub/>
                    <p>Github</p>
                </div>

                <div className={'sidebar-link-item'}>
                    <FaSchool/>
                    <p>Aaft</p>
                </div>
            </div>
        </div>
    )

}


function Layout({children}){
    return (
        <div className={'layout light-color'}>
            <Header/>
            <div className={'container content'}>
                <div className={'content-left'}>
                    <Sidebar/>
                </div>
                <div className={'content-right'}>
                    {children}
                </div>
            </div>

            <Footer/>
        </div>
    )
}


function Footer(){
    return (
        <div className={'footer'}>
            <p className={'footer-title'}>Sitemap</p>
            <div>
                <div className={'social-tab-link'}>
                    <p>Follow:</p>
                    <div className={'social-links-tab'}>
                        <div className={'social-link'}>
                            <FaTwitterSquare/>
                            <p>Twitter</p>
                        </div>
                        <div className={'social-link'}>
                            <FaLinkedinIn/>
                            <p>LinkedIn</p>
                        </div>
                        <div className={'social-link'}>
                            <AiFillInstagram/>
                            <p>Instagram</p>
                        </div>

                    </div>
                </div>
            </div>
            <p className={'footer-copy'}>© 2025 Nirmal Thomas. Powered by Jekyll & AcademicPages, a fork of Minimal Mistakes.</p>
        </div>
    )
}

