import { asset, cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./Approach.module.css";

const promises = [
  {
    title: "Your people. Your pace.",
    text: "A family break, your honeymoon, or a few days with friends—tell us who’s coming and how you like to travel.",
  },
  {
    title: "The details, in the open.",
    text: "Discuss stays, a private vehicle, houseboat options and activities. Your personalised quote sets out what’s included.",
  },
  {
    title: "A conversation, not a checkout.",
    text: "Talk through your dates and ideas directly with Canty Tours on WhatsApp.",
  },
];

export function Approach() {
  return (
    <section id="our-approach" className={cx("section wrap", styles.approach)}>
      <div className={cx(styles.photo, "reveal")}>
        <img
          src={asset("wayanad.jpg")}
          alt="Lush green hill country in Wayanad, Kerala"
          loading="lazy"
        />
        <div className={styles.note}>
          A little less rush.
          <br />
          More <em>Kerala.</em>
          <span>THE CANTY WAY</span>
        </div>
      </div>
      <div className={cx(styles.copy, "reveal")}>
        <p className={cx("eyebrow", styles.eyebrow)}>
          MAKE SPACE FOR THE MOMENTS BETWEEN
        </p>
        <h2>
          More than a route.
          <br />
          <em>Your kind of holiday.</em>
        </h2>
        <p>
          A second cup of tea with a view. A long lunch by the water. An
          afternoon with nowhere else to be. Kerala is a place to savour, and
          your itinerary should leave room for it.
        </p>
        <p>
          Pair the hills with the backwaters, linger in Wayanad, or leave a few
          days for the coast.
        </p>
        {promises.map((p, i) => (
          <div className={styles.item} key={p.title}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </div>
        ))}
        <a href="#plan" className={styles.link}>
          Let’s shape your Kerala holiday <Icon name="arrow" />
        </a>
      </div>
    </section>
  );
}
