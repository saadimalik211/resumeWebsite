export interface ResumeLink {
  label: string;
  url: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  tools?: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  location: string;
  gpa?: string;
}

export interface Resume {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  links: ResumeLink[];
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
}

export const resume: Resume = {
  name: "Saad Malik",
  title: "Software Engineer",
  location: "San Leandro, CA",
  phone: "607-542-6874",
  email: "saadmali@gensosekai.com",
  links: [
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/saad-ismail-malik",
    },
    {
      label: "GitHub",
      url: "https://github.com/saadimalik211",
    },
    {
      label: "ByteVision Repos",
      url: "https://tinyurl.com/4c8c7ybd",
    },
  ],
  skills: [
    {
      category: "Cloud Services",
      items: [
        "AWS (EC2, S3, R53, Lambda, API, DynamoDB, RDS, CloudFront, IAM, CloudFormation, SAM)",
        "GCS (Storage, Logging, CloudSQL)",
        "CI/CD (GitHub Actions, Jenkins, Cloudflare Workers)",
      ],
    },
    {
      category: "Programming",
      items: [
        "Python",
        "JavaScript",
        "C++",
        "Bash",
        "Django",
        "REST API",
        "HTML & CSS",
      ],
    },
    {
      category: "System Administration",
      items: [
        "Linux, MacOS & Windows",
        "Proxmox",
        "Docker",
      ],
    },
    {
      category: "Machine Learning",
      items: [
        "Vision AI",
        "OpenCV", 
        "TensorFlow",
        "YOLO",
        "Ultralytics",
      ],
    },
    {
      category: "Databases",
      items: [
        "SQL",
        "MariaDB",
        "NoSQL",
        "GCS CloudSQL",
        "AWS DynamoDB",
        "Cloudflare KV",
      ],
    },
    {
      category: "CI/CD & IaC",
      items: ["Docker", "Jenkins", "Terraform", "Git", "GitHub Actions"],
    },
    {
      category: "Other Tools",
      items: ["Jira", "Microsoft Dynamics 365"],
    },
    {
      category: "AWS Badges",
      items: [
        "CloudQuest Solutions Architect",
        "CloudQuest Cloud Practitioner",
      ],
    },
  ],
  experience: [
    {
      title: "Software Engineer | Startup Founder",
      company: "ByteVision",
      location: "Remote",
      period: "March 2023 – 2025",
      tools: [
        "YOLOv8",
        "Tensor",
        "CUDA",
        "Django",
        "Python",
        "C++",
        "JavaScript",
        "HTML",
        "SQL",
        "Docker",
        "Git",
      ],
      highlights: [
        "Reviewed pain points with local restaurant owners and developed technology and software-oriented solutions ranging from web apps to embedded systems integration.",
        "Built all infrastructure and set up git resources to collaborate with other software engineers on the project.",
        "Developed a framework for building training datasets and training vision AI models.",
        "Developed functionality to deploy models and run inference against images or video at various resolutions.",
        "Built multi-architecture CI/CD to automate the build and deployment of Django WebApp + DB.",
      ],
    },
    {
      title: "Implementation Engineer",
      company: "CognitOps",
      location: "Remote",
      period: "Feb 2022 – Feb 2023",
      tools: ["SQL", "YAML", "JSON", "Scala", "Git", "Jira"],
      highlights: [
        "Conducted in-depth reviews of enterprise warehouse Oracle SQL databases to identify key data points for software integration.",
        "Created highly complex SQL queries to extract and format client data for development and data science teams.",
        "Increased customer satisfaction by collaborating with clients to develop customized warehouse labor workflows.",
        "Deployed software on hybrid architectures for SQL query execution and delivery of data to Google Cloud Services.",
        "Streamlined implementation time frames from 12+ months to 45 days through close collaboration with development teams.",
        "Decreased software bugs by tracking progress with GitHub integration for code maintenance and review.",
      ],
    },
    {
      title: "Technical Analyst | Implementation & Support",
      company: "Rochester Software Associates",
      location: "Remote",
      period: "Sep 2016 – Feb 2022",
      tools: ["Linux", "Shibboleth", "Bash", "Windows Server"],
      highlights: [
        "Managed multiple new customer implementation projects, prioritizing complex and high-need customers.",
        "Took ownership of high-visibility, high-complexity customers for many years.",
        "Improved customer relations by resolving help desk issues and documenting feature requests and bug reports.",
        "Installed and configured RSA software per customer specifications for cloud and on-premise environments.",
        "Increased team efficiency by documenting processes in MediaWiki and improving new hire training.",
      ],
    },
    {
      title: "Control Systems Engineer / Intern",
      company: "Corning, Inc",
      location: "Corning, NY",
      period: "2012 – 2018",
      tools: ["C#", "Bash", "Fusion360", "Linux", "Windows IoT"],
      highlights: [
        "Designed and implemented monitoring systems for emissions systems to collect catalytic converter test data.",
        "Enabled real-time catalytic converter performance data collection via exhaust gas measurements on semi-trucks.",
        "Built a portable container lab routing truck exhaust through instruments for in-depth data collection.",
        "Advocated for transitioning from Windows PCs to embedded Linux and Windows IoT in lab and production environments.",
        "Built sensor monitoring and logging devices using Raspberry Pi, Arch Linux, Bash, C#, and 3D printing.",
      ],
    },
    {
      title: "Datacenter Engineer",
      company: "ColoCrossing, Inc",
      location: "Buffalo, NY",
      period: "2014 – 2015",
      tools: ["C++", "Python", "MySQL", "Bash"],
      highlights: [
        "Provided break-fix support for servers in data centers, diagnosing and replacing faulty PSUs, RAM, and other hardware.",
        "Assembled and racked server cabinets, running and fitting ethernet and fiber cables.",
        "Maintained customer satisfaction by responding to tickets within SLA guidelines.",
        "Improved team efficiency by working on the in-house CRM built with CentOS, Python, MySQL, and C++.",
      ],
    },
  ],
  education: [
    {
      degree: "Associate of Science: Computer Science",
      school: "Corning Community College",
      location: "Corning, NY",
      gpa: "3.97 GPA",
    },
  ],
};
