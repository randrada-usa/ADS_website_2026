import Image, { type StaticImageData } from "next/image";
import partner01 from "../../assets/partners/TechConnect Presentation.png";
import partner02 from "../../assets/partners/TechConnect Presentation(1).png";
import partner03 from "../../assets/partners/TechConnect Presentation(2).png";
import partner04 from "../../assets/partners/TechConnect Presentation(3).png";
import partner05 from "../../assets/partners/TechConnect Presentation(4).png";
import partner06 from "../../assets/partners/TechConnect Presentation(5).png";
import partner07 from "../../assets/partners/TechConnect Presentation(6).png";
import partner08 from "../../assets/partners/TechConnect Presentation(7).png";
import partner09 from "../../assets/partners/TechConnect Presentation(8).png";
import partner10 from "../../assets/partners/TechConnect Presentation(9).png";
import partner11 from "../../assets/partners/TechConnect Presentation(10).png";
import partner12 from "../../assets/partners/TechConnect Presentation(11).png";
import partner13 from "../../assets/partners/TechConnect Presentation(12).png";
import partner14 from "../../assets/partners/TechConnect Presentation(13).png";
import partner15 from "../../assets/partners/TechConnect Presentation(14).png";
import partner16 from "../../assets/partners/TechConnect Presentation(15).png";
import partner17 from "../../assets/partners/TechConnect Presentation(16).png";
import partner18 from "../../assets/partners/TechConnect Presentation(17).png";
import partner19 from "../../assets/partners/TechConnect Presentation(18).png";
import partner20 from "../../assets/partners/TechConnect Presentation(19).png";
import partner21 from "../../assets/partners/TechConnect Presentation(20).png";
import partner22 from "../../assets/partners/TechConnect Presentation(21).png";
import partner23 from "../../assets/partners/TechConnect Presentation(22).png";
import partner24 from "../../assets/partners/TechConnect Presentation(23).png";
import partner25 from "../../assets/partners/TechConnect Presentation(24).png";
import { Eyebrow } from "./ui";

const partners: { name: string; logo: StaticImageData }[] = [
  { name: "PH Startup Online", logo: partner01 },
  { name: "NVIDIA AI Academy Philippines", logo: partner02 },
  { name: "Tech 4 Tomorrow", logo: partner03 },
  { name: "ESET", logo: partner04 },
  { name: "DEVCON Iloilo", logo: partner05 },
  { name: "Google Developer Student Clubs UNO-R", logo: partner06 },
  { name: "University of San Agustin partner", logo: partner07 },
  { name: "UAPSA USA", logo: partner08 },
  { name: "ITB", logo: partner09 },
  { name: "Google Developer Student Clubs UP Manila", logo: partner10 },
  { name: "Computer Engineering Society USA", logo: partner11 },
  { name: "Gather", logo: partner12 },
  { name: "Akubo", logo: partner13 },
  { name: "Google Developer Group Bacolod", logo: partner14 },
  { name: "Google Developer Student Clubs PUP Sto. Tomas", logo: partner15 },
  { name: "LZ Cybersecurity", logo: partner16 },
  { name: "Technology partner", logo: partner17 },
  { name: "JRB", logo: partner18 },
  {
    name: "Google Developer Student Clubs National University Manila",
    logo: partner19,
  },
  { name: "KodeGo", logo: partner20 },
  { name: "Zuitt", logo: partner21 },
  {
    name: "Institute of Computer Engineers of the Philippines",
    logo: partner22,
  },
  { name: "Community partner", logo: partner23 },
  { name: "Tech for All", logo: partner24 },
  { name: "Technology community partner", logo: partner25 },
];

export function ValuesMarquee() {
  return (
    <section
      className="values-strip partner-strip"
      aria-label="Previous partners"
    >
      <div className="partner-strip-label section-boundary-label">
        <Eyebrow>Previous Partners</Eyebrow>
      </div>
      <div className="partner-wall">
        <div className="partner-logo-row">
          <div className="partner-wall-track">
            {[0, 1].map((copy) => (
              <div
                className="partner-logo-sequence"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {partners.map((partner, index) => (
                  <span
                    className="partner-logo"
                    key={`${copy}-${partner.name}-${index}`}
                    aria-label={copy === 0 ? partner.name : undefined}
                    role={copy === 0 ? "img" : undefined}
                  >
                    <Image
                      src={partner.logo}
                      alt=""
                      sizes="(max-width: 650px) 96px, 128px"
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
