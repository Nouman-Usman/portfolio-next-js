import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Muhammad",
  lastName: "Nouman",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Generative AI Engineer",
  avatar: "/images/avatar.jpg",
  location: "Asia/Pakistan", // IANA time zone identifier if necessary
  languages: ["English", "Urdu"],
  headline: "Generative AI Engineer",
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about generative AI, technology, and my experiences in the tech industry.
    </>
  ),
};

const social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/your-github-link", // Replace with your GitHub profile URL
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/muhammad-nouman/",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:2022cs49@student.uet.edu.pk",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>{person.headline}</>,
  subline: (
    <>
      I'm {person.firstName}, a Generative AI Engineer with a passion for building innovative solutions.
      I have experience developing AI-driven applications, teaching, and designing intuitive user experiences.
    </>
  ),
};

const about = {
  label: "About",
  title: "About Me",
  description: `Meet ${person.name}, a ${person.role} from ${person.location}.`,
  avatar: {
    display: true,
  },
  tableOfContent: {
    display: true,
    subItems: false,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I hold a B.Sc. in Computer Science from the University of Engineering and Technology (UET), Lahore and have
        a strong background in developing generative AI solutions. My professional journey includes internships and roles
        where I have excelled in design engineering, AI development, and teaching.
      </>
    ),
  },
  work: {
    display: true,
    title: "Experience",
    experiences: [
      {
        company: "Xavor Corporation",
        timeframe: "Jun 2024 – Sep 2024",
        role: "Generative AI Intern",
        achievements: [
          <>Achieved 9/10 proficiency in Open Source LLMs and ranked 3rd in my batch.</>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Xavor Corporation",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "University of California, Irvine",
        timeframe: "Aug 2024 – Sep 2024",
        role: "Generative AI Developer",
        achievements: [
          <>Developed a healthcare AI application that outperformed 20+ competing projects.</>,
          <>Enhanced medical education by integrating generative AI technologies.</>,
        ],
        images: [],
      },
      {
        company: "UET Lahore",
        timeframe: "Sep 2023 – Present",
        role: "Teaching Assistant",
        achievements: [
          <>Provided technical guidance leading to a 25% improvement in test scores.</>,
          <>Designed and implemented effective teaching strategies.</>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "University of Engineering and Technology (UET), Lahore, PK",
        description: <>B.Sc. in Computer Science (Dec 2022 - Present) | CGPA: 3.32</>,
      },
      {
        name: "Cantt Public Boys College, Lahore Cantt, PK",
        description: <>Intermediate in Pre-Engineering (Mar 2020 - May 2022) | Percentage: 88.6%</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Python",
        description: <>Proficient in Python for AI and backend development.</>,
        images: [],
      },
      {
        title: "C++",
        description: <>Solid foundation in C++ development.</>,
        images: [],
      },
      {
        title: "C#",
        description: <>Experienced in building applications with C# and .NET (including Windows Forms).</>,
        images: [],
      },
      {
        title: "JavaScript & Next.js",
        description: <>Skilled in modern web development with JavaScript and Next.js.</>,
        images: [],
      },
      {
        title: "HTML/CSS & Bootstrap",
        description: <>Expert in crafting responsive and accessible web interfaces.</>,
        images: [],
      },
      {
        title: "Flask",
        description: <>Developed backend solutions using the Flask framework.</>,
        images: [],
      },
      {
        title: "ASP.NET",
        description: <>Built web applications using ASP.NET framework.</>,
        images: [],
      },
      {
        title: "MongoDB & MSSQL",
        description: <>Experienced with both NoSQL and SQL database systems.</>,
        images: [],
      },
      {
        title: "OpenCV",
        description: <>Applied computer vision techniques using OpenCV.</>,
        images: [],
      },
      {
        title: "Selenium",
        description: <>Automated browser testing using Selenium.</>,
        images: [],
      },
    ],
  },
  certifications: {
    display: true,
    title: "Certifications",
    list: [
      "GitHub Foundations",
      "Classify Images With Tensorflow on Google Cloud",
      "AZ-900 (Microsoft Azure Fundamentals)",
      "Oracle Generative AI Professional",
      "SQL (Basics)",
      "Game Development with Unity",
    ],
  },
  honors: {
    display: true,
    title: "Honors",
    list: [
      "HEC Scholarship (2023-26)",
      "3rd Position in Startup Competition at ICOSS",
      "Cricket Team Captain (SSC Level)",
      "Highest Achiever in Matriculation",
    ],
  },
  activities: {
    display: true,
    title: "Activities",
    list: [
      "Founder, Cipher Craft",
      "Co-Founder, MLSA Punjab",
      "Lead Public Relations, Software Square",
      "Executive Member, UET X-NEWS",
      "Hult Prize Campus Director",
      "Microsoft Learn Student Ambassador",
      "Hacker Earth Campus Ambassador",
    ],
  },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently.`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
};

const work = {
  label: "Work",
  title: "My Projects",
  description: `Design and development projects by ${person.name}.`,
  // Create new project pages by adding a new .mdx file to app/work/projects
};

const gallery = {
  label: "Gallery",
  title: "My Photo Gallery",
  description: `A photo collection by ${person.name}.`,
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-03.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };