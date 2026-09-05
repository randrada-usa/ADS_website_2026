import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { PageEntrance } from "@/components/page-entrance";
import {
  Eyebrow,
  PageIntro,
  ButtonLink,
} from "@/components/ui";
import { Spark } from "@/components/icons";
import addyWave from "../../../../assets/addy/addy_wave.png";
export const metadata: Metadata = { title: "About" };
export default async function AboutPage() {
  const content = await getContent();
  return (
    <>
      <PageEntrance />
      <PageIntro
        label="Hello, we’re ADS"
        title={
          <>
            Curious minds.
            <br />
            <span className="gradient-text">Shared purpose.</span>
          </>
        }
        description={content.settings.intro}
      >
        <Image
          className="about-intro-addy"
          src={addyWave}
          alt="Addy, the ADS mascot, waving"
          sizes="(max-width: 850px) 78vw, 36vw"
          loading="eager"
        />
      </PageIntro>
      <section className="container section about-story">
        <div className="story-art" aria-hidden="true">
          <span>&lt;</span>
          <Spark />
          <span>/&gt;</span>
          <p>Made of different minds.</p>
        </div>
        <div>
          <Eyebrow>Our story</Eyebrow>
          <h2>
            Rooted in community.
            <br />
            Looking forward.
          </h2>
          <p className="large-copy">
            {content.settings.about || "Our story will be shared here soon."}
          </p>
          <ButtonLink href="/team" secondary>
            Meet the people
          </ButtonLink>
        </div>
      </section>
      <section
        className="container values-cards statement-cards about-statement-cards"
        aria-label="Purpose, vision, and mission"
      >
        <article className="purpose-statement">
          <div className="statement-tab">
            <h2>Our purpose</h2>
          </div>
          <div className="statement-copy">
            <p>
              The Augustinian Developers Society – University of San Agustin
              (ADS USA) is an inclusive community open to students from all
              undergraduate academic backgrounds, unified by their interest and
              passion for technology. Our primary aim is to build and expand our
              members’ professional and personal networks, with a specific focus
              on software development, application design, and software
              engineering. We foster a collaborative, peer-to-peer learning
              environment where members work together to design, develop, and
              implement technological solutions that address real-world
              challenges and local community problems.
            </p>
          </div>
        </article>
        <article className="vision-statement">
          <div className="statement-tab">
            <h2>Our vision</h2>
          </div>
          <div className="statement-copy">
            <p>
              We envision ourselves as a dynamic and distinguished community of
              young developers, technologists, and innovators driven by
              excellence and deeply committed to uplifting lives, empowering
              communities, and contributing to societal progress through
              responsible, accessible, and impactful technology and innovation.
            </p>
          </div>
        </article>
        <article className="mission-statement">
          <div className="statement-tab">
            <h2>Our mission</h2>
          </div>
          <div className="statement-copy">
            <div>
              <p>
                Guided by the Augustinian values of Caritas, Unitas, and
                Veritas, our mission is to:
              </p>
              <ol>
                <li>
                  Empower students and community members by providing accessible
                  education, training, and skills development in technology,
                  programming, and digital literacy.
                </li>
                <li>
                  Enlighten minds by cultivating a culture of creativity,
                  critical thinking, and innovation, demonstrating how
                  technology can be a powerful tool for problem-solving and
                  social good.
                </li>
              </ol>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
