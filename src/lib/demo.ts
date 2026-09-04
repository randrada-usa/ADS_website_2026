import type { Department, SiteContent } from "./types";

export const departments: Department[] = [
  {
    slug: "communications",
    name: "Communications",
    color: "#3C6597",
    purpose:
      "The storytellers behind the society. We turn ideas and experiences into stories that connect.",
    responsibilities: [
      "Creative direction and content",
      "Social media and community updates",
      "Documenting our shared experiences",
    ],
  },
  {
    slug: "technology",
    name: "Technology",
    color: "#61AD9E",
    purpose:
      "Where curiosity becomes something you can build. We explore technology and help one another grow.",
    responsibilities: [
      "Technical projects and experiments",
      "Workshops and knowledge sharing",
      "Supporting our digital spaces",
    ],
  },
  {
    slug: "finance",
    name: "Finance",
    color: "#F2BA5E",
    purpose:
      "Making great ideas possible through thoughtful planning and responsible resource management.",
    responsibilities: [
      "Budget planning",
      "Financial documentation",
      "Resource and sponsorship coordination",
    ],
  },
  {
    slug: "legal",
    name: "Legal",
    color: "#E2815A",
    purpose:
      "Helping the society move forward with clarity, accountability, and care.",
    responsibilities: [
      "Organizational documentation",
      "Policy and compliance support",
      "Supporting responsible operations",
    ],
  },
  {
    slug: "operations",
    name: "Operations",
    color: "#DF5B5B",
    purpose:
      "The people who bring the moving pieces together and turn a shared plan into a shared experience.",
    responsibilities: [
      "Activity planning and logistics",
      "Internal coordination",
      "On-the-ground event support",
    ],
  },
];

const executiveOfficers = [
  { name: "Glaiza Mae Salvaloza", position: "Chief Executive Officer" },
  { name: "Rizza Mia Abogadil", position: "Co-Chief Executive Officer" },
  { name: "Val Ryan Flores", position: "Executive Secretary" },
  { name: "KC Labergue", position: "Assistant Executive Secretary" },
  { name: "Juana Suzy A. Lobaton", position: "Adviser" },
];

const departmentHeads: Record<Department["slug"], { name: string; position: string }> = {
  communications: {
    name: "Gabriel Ferrera",
    position: "Chief Communications Officer",
  },
  technology: {
    name: "Justine Rendaje",
    position: "Chief Technology Officer",
  },
  finance: {
    name: "Arlyn Joy Aurelio",
    position: "Chief Finance Officer",
  },
  legal: {
    name: "Mary Tifanny Sumalde",
    position: "Chief Legal Officer",
  },
  operations: {
    name: "Centauri Alpha",
    position: "Chief Operation Officer",
  },
};

export const demoContent: SiteContent = {
  demo: true,
  settings: {
    heroDescription:
      "A community of curious minds, creative thinkers, and builders. Together, we turn a passion for technology into a positive impact.",
    intro:
      "We’re students, creators, and collaborators brought together by one thing: the belief that technology can do good.",
    introSupporting:
      "Different perspectives. Shared ambition. A community built around learning from one another and making things that matter.",
    about:
      "The Augustinian Developer Society is a student organization at the University of San Agustin. This space will tell the story of our community, the ideas we explore, and the work we do together.",
    mission:
      "Guided by the Augustinian values of Caritas, Unitas, and Veritas, our mission is to: (1) Empower students and community members by providing accessible education, training, and skills development in technology, programming, and digital literacy; (2) Enlighten minds by cultivating a culture of creativity, critical thinking, and innovation, demonstrating how technology can be a powerful tool for problem-solving and social good.",
    vision:
      "We envision ourselves as a dynamic and distinguished community of young developers, technologists, and innovators driven by excellence and deeply committed to uplifting lives, empowering communities, and contributing to societal progress through responsible, accessible, and impactful technology and innovation.",
    socials: [],
  },
  departments,
  members: [
    ...executiveOfficers.map((member, i) => ({
      _id: `board-${i}`,
      ...member,
      isLeadership: true,
      order: i,
    })),
    ...departments.flatMap((dept, i) => [
      {
        _id: `${dept.slug}-head`,
        ...departmentHeads[dept.slug],
        department: dept.slug,
        isHead: true,
        isLeadership: true,
        order: i + executiveOfficers.length,
      },
      ...Array.from({ length: 8 }, (_, j) => ({
        _id: `${dept.slug}-${j}`,
        name: "Name to be announced",
        position: "Department Member",
        department: dept.slug,
        order: j + 10,
      })),
    ]),
  ],
  activities: [
    {
      _id: "initiative-community",
      kind: "initiative",
      slug: "technology-for-the-community",
      title: "Technology for the community",
      summary:
        "Bringing digital skills closer to the people who can put them to use.",
      category: "Community outreach",
      image: "/images/community.jpg",
      imageAlt:
        "Temporary stock photograph of a gathering, not an ADS activity",
      role: "Community outreach",
      demo: true,
    },
    {
      _id: "initiative-build",
      kind: "initiative",
      slug: "big-ideas-built-together",
      title: "Big ideas. Built together.",
      summary:
        "Creating a space where student curiosity turns into collaborative solutions.",
      category: "Hackathons",
      image: "/images/teamwork.jpg",
      imageAlt:
        "Temporary stock photograph of a collaborative workspace, not an ADS activity",
      role: "Activity organizer",
      demo: true,
    },
    {
      _id: "initiative-beyond",
      kind: "initiative",
      slug: "learning-beyond-campus",
      title: "Learning beyond campus",
      summary:
        "Taking our curiosity outside the classroom and connecting with the wider tech community.",
      category: "External participation",
      image: "/images/workshop.jpg",
      imageAlt:
        "Temporary stock photograph of a learning session, not an ADS activity",
      role: "Participating organization",
      demo: true,
    },
    {
      _id: "event-workshop",
      kind: "event",
      slug: "a-place-to-start-building",
      title: "A place to start building",
      summary:
        "A hands-on introduction to turning an idea into something real, together.",
      category: "Workshop",
      date: "2026-10-10T05:00:00Z",
      location: "Venue to be confirmed",
      image: "/images/workshop.jpg",
      imageAlt: "Temporary stock workshop photograph, not an ADS event",
      related: ["initiative-build"],
      demo: true,
    },
    {
      _id: "event-community",
      kind: "event",
      slug: "connecting-curious-minds",
      title: "Connecting curious minds",
      summary:
        "Conversations, fresh perspectives, and a shared curiosity about what comes next.",
      category: "Tech talk",
      date: "2026-08-20T05:00:00Z",
      location: "Venue to be confirmed",
      image: "/images/community.jpg",
      imageAlt: "Temporary stock gathering photograph, not an ADS event",
      related: ["initiative-beyond"],
      demo: true,
    },
    {
      _id: "event-hackathon",
      kind: "event",
      slug: "an-idea-worth-building",
      title: "An idea worth building",
      summary:
        "A collaborative challenge to explore how technology can help our communities.",
      category: "Hackathon",
      date: "2026-08-05T01:00:00Z",
      location: "Venue to be confirmed",
      image: "/images/teamwork.jpg",
      imageAlt: "Temporary stock workspace photograph, not an ADS event",
      related: ["initiative-build"],
      demo: true,
    },
  ],
  faqs: [
    {
      _id: "faq-1",
      question: "What is the Augustinian Developer Society?",
      answer:
        "ADS is a student organization at the University of San Agustin, bringing together a community interested in technology, collaboration, and meaningful impact.",
    },
    {
      _id: "faq-2",
      question: "What does ADS do?",
      answer:
        "Our activities include learning experiences, collaborative initiatives, outreach, and participation in the wider technology community.",
    },
    {
      _id: "faq-3",
      question: "What are the five departments?",
      answer:
        "Communications, Technology, Finance, Legal, and Operations. Explore the department pages to see their responsibilities and the people behind them.",
    },
    {
      _id: "faq-4",
      question: "Where can I learn about your activities?",
      answer:
        "Explore Initiatives for the stories behind our collective work, and Events for upcoming activities and recaps.",
    },
    {
      _id: "faq-5",
      question: "How can I contact ADS?",
      answer:
        "Our official email and social links will appear in the contact section once they have been verified.",
    },
  ],
  featuredInitiatives: [
    "initiative-community",
    "initiative-build",
    "initiative-beyond",
  ],
  featuredEvents: ["event-workshop", "event-community", "event-hackathon"],
};
