import { Spark } from "./icons";

const values = [
  "Curiosity meets community.",
  "Ideas become impact.",
  "Augustinian at heart.",
];

export function ValuesMarquee() {
  return (
    <section className="values-strip" aria-label="Our values">
      <div className="values-window">
        <div className="values-track">
          {[0, 1].map((copy) => (
            <div
              className="values-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {values.map((value) => (
                <span className="values-item" key={value}>
                  {value}
                  <Spark />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
