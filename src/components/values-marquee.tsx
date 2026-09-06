import Image from "next/image";
import { Eyebrow } from "./ui";

const partners = [
  {
    name: "PH Startup Online",
    logo: "/assets/partners/partner-01.webp",
    width: 387,
    height: 122,
  },
  {
    name: "NVIDIA AI Academy Philippines",
    logo: "/assets/partners/partner-02.webp",
    width: 134,
    height: 134,
  },
  {
    name: "Tech 4 Tomorrow",
    logo: "/assets/partners/partner-03.webp",
    width: 282,
    height: 136,
  },
  {
    name: "ESET",
    logo: "/assets/partners/partner-04.webp",
    width: 160,
    height: 134,
  },
  {
    name: "DEVCON Iloilo",
    logo: "/assets/partners/partner-05.webp",
    width: 134,
    height: 134,
  },
  {
    name: "Google Developer Student Clubs UNO-R",
    logo: "/assets/partners/partner-06.webp",
    width: 418,
    height: 134,
  },
  {
    name: "University of San Agustin partner",
    logo: "/assets/partners/partner-07.webp",
    width: 169,
    height: 134,
  },
  {
    name: "UAPSA USA",
    logo: "/assets/partners/partner-08.webp",
    width: 161,
    height: 134,
  },
  {
    name: "ITB",
    logo: "/assets/partners/partner-09.svg",
    width: 134,
    height: 134,
  },
  {
    name: "Google Developer Student Clubs UP Manila",
    logo: "/assets/partners/partner-10.webp",
    width: 268,
    height: 134,
  },
  {
    name: "Computer Engineering Society USA",
    logo: "/assets/partners/partner-11.webp",
    width: 129,
    height: 129,
  },
  {
    name: "Gather",
    logo: "/assets/partners/partner-12.svg",
    width: 339,
    height: 116,
  },
  {
    name: "Akubo",
    logo: "/assets/partners/partner-13.webp",
    width: 372,
    height: 77,
  },
  {
    name: "Google Developer Group Bacolod",
    logo: "/assets/partners/partner-14.webp",
    width: 401,
    height: 107,
  },
  {
    name: "Google Developer Student Clubs PUP Sto. Tomas",
    logo: "/assets/partners/partner-15.webp",
    width: 267,
    height: 134,
  },
  {
    name: "LZ Cybersecurity",
    logo: "/assets/partners/partner-16.webp",
    width: 189,
    height: 134,
  },
  {
    name: "Technology partner",
    logo: "/assets/partners/partner-17.webp",
    width: 122,
    height: 122,
  },
  {
    name: "JRB",
    logo: "/assets/partners/partner-18.webp",
    width: 134,
    height: 134,
  },
  {
    name: "Google Developer Student Clubs National University Manila",
    logo: "/assets/partners/partner-19.webp",
    width: 270,
    height: 100,
  },
  {
    name: "KodeGo",
    logo: "/assets/partners/partner-20.webp",
    width: 201,
    height: 134,
  },
  {
    name: "Zuitt",
    logo: "/assets/partners/partner-21.svg",
    width: 134,
    height: 134,
  },
  {
    name: "Institute of Computer Engineers of the Philippines",
    logo: "/assets/partners/partner-22.webp",
    width: 134,
    height: 134,
  },
  {
    name: "Community partner",
    logo: "/assets/partners/partner-23.webp",
    width: 134,
    height: 134,
  },
  {
    name: "Tech for All",
    logo: "/assets/partners/partner-24.webp",
    width: 134,
    height: 134,
  },
  {
    name: "Technology community partner",
    logo: "/assets/partners/partner-25.svg",
    width: 134,
    height: 134,
  },
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
                      width={partner.width}
                      height={partner.height}
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
