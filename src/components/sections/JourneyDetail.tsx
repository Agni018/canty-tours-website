import Link from "next/link";
import { TourCard } from "@/components/cards/TourCard";
import { Icon } from "@/components/ui/Icon";
import type { Tour } from "@/data/tours";
import { durationText, highlightList, regionLabel } from "@/lib/journeys";
import { asset, cx } from "@/lib/utils";
import { EnquiryForm } from "./EnquiryForm";
import styles from "./JourneyDetail.module.css";

const DISCLAIMER =
  "This is a suggested route. Stays, activities, permits, transport, operating days and current availability are confirmed in your quote.";

// What happens after an enquiry; it matches the FAQ ("An enquiry does not confirm a booking").
const steps = [
  {
    title: "Send your dates",
    text: "Tell us when you’d like to travel and who’s coming. The form opens WhatsApp with it all written out for you.",
  },
  {
    title: "We shape it with you",
    text: "We talk through stays, transport, pace and any places to add or skip, then send a personalised quote with what’s included.",
  },
  {
    title: "Confirm when it feels right",
    text: "Nothing is booked until you agree the itinerary, price and terms.",
  },
];

type JourneyDetailProps = {
  tour: Tour;
  /** Similar journeys suggested at the end of the page. */
  related: Tour[];
};

/**
 * A journey's page: photo header, overview, highlights, the day-by-day route and how planning
 * works, with the enquiry form beside it (below it on narrow screens) and similar journeys.
 */
export function JourneyDetail({ tour: t, related }: JourneyDetailProps) {
  const styleList = [t.style, ...(t.styles ?? [])];

  return (
    <article>
      <header className={styles.hero}>
        <div className={styles.backdrop}>
          <img src={asset(t.image)} alt={t.alt} fetchPriority="high" />
        </div>
        <div className={cx("wrap", styles.heroContent)}>
          <nav aria-label="Breadcrumb">
            <ol className={styles.crumbs}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/#journeys">Journeys</Link>
              </li>
              <li aria-current="page">{t.name}</li>
            </ol>
          </nav>
          <p className="eyebrow light">
            {`SAMPLE JOURNEY · ${durationText(t)} · ${regionLabel(t)}`}
          </p>
          <h1>{t.name}</h1>
          <p className={styles.route}>{t.route}</p>
          <ul className={styles.tags} aria-label="At a glance">
            <li>{t.style}</li>
            <li>Price on request</li>
          </ul>
        </div>
      </header>

      <div className={cx("wrap", styles.layout)}>
        <div className={styles.main}>
          <section aria-labelledby="overview">
            <h2 id="overview">Overview</h2>
            <p className={styles.lead}>{t.description}</p>
            <dl className={styles.facts}>
              <div>
                <dt>Duration</dt>
                <dd>{durationText(t)}</dd>
              </div>
              <div>
                <dt>Pace</dt>
                <dd>{t.pace}</dd>
              </div>
              <div>
                <dt>A good fit for</dt>
                <dd>{t.ideal}</dd>
              </div>
              <div>
                <dt>Travel style</dt>
                <dd>{styleList.join(" · ")}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="highlights">
            <h2 id="highlights">Highlights</h2>
            <ul className={styles.highlights}>
              {highlightList(t).map((h) => (
                <li key={h}>
                  <Icon name="spark" className={styles.spark} />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="days">
            <h2 id="days">Day by day</h2>
            <ol className={styles.days}>
              {t.itinerary.map((day, i) => (
                <li key={i}>
                  <span className={styles.dayNumber}>Day {i + 1}</span>
                  <p>{day}</p>
                </li>
              ))}
            </ol>
            {t.notes && <p className={styles.note}>{t.notes}</p>}
            <p className={styles.note}>
              {t.planningNote ? `${t.planningNote} ` : ""}
              {DISCLAIMER}
            </p>
          </section>

          <section aria-labelledby="planning">
            <h2 id="planning">How planning works</h2>
            <ol className={styles.steps}>
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className={styles.aside} aria-label="Plan this journey">
          <EnquiryForm journey={t} />
        </aside>
      </div>

      <section
        className={cx("section", styles.more)}
        aria-labelledby="more-title"
      >
        <div className="wrap">
          <h2 id="more-title">More journeys like this</h2>
          <div className={styles.moreGrid}>
            {related.map((r) => (
              <TourCard key={r.id} tour={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Phones and tablets: the form sits below the route, so this keeps it one tap away. */}
      <a href="#enquire" className={styles.mobileBar}>
        <span>
          {durationText(t)}
          <small>Price on request</small>
        </span>
        <span className={styles.mobileCta}>
          Plan this journey <Icon name="arrow" />
        </span>
      </a>
    </article>
  );
}
