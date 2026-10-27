import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";
import { cx } from "@/lib/utils";
import styles from "./Testimonials.module.css";

/** Travellers' own words, from src/data/testimonials.ts. Renders nothing until there are some. */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="stories"
      className={cx("section", styles.section)}
      aria-labelledby="stories-title"
    >
      <div className="wrap">
        <SectionHeading
          eyebrow="IN OUR TRAVELLERS’ WORDS"
          title="Trips that felt like their own."
          titleId="stories-title"
          intro="A few words from people who travelled with Canty Tours."
        />
        <ul className={cx(styles.list, "reveal")}>
          {testimonials.map((t) => (
            <li key={t.name + t.trip}>
              <figure>
                <blockquote>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  {t.trip}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
