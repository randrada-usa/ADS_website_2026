import { Spark } from "./icons";

const values = [
  "CARITAS",
  "VERITAS",
  "UNITAS",
];
const loopValues = Array.from({ length: 12 }, () => values).flat();

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
              {loopValues.map((value, index) => (
                <span className="values-item" key={`${value}-${index}`}>
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
