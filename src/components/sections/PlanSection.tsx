import { phone, whatsappLink } from "@/data/site";
import { cx } from "@/lib/utils";
import { EnquiryForm } from "./EnquiryForm";
import { Icon } from "@/components/ui/Icon";
import styles from "./PlanSection.module.css";

export function PlanSection() {
  return (
    <section id="plan" className={styles.section}>
      <div className={cx("wrap", styles.grid)}>
        <div className={cx(styles.copy, "reveal")}>
          <p className={cx("eyebrow light", styles.eyebrow)}>
            FROM “LET’S GO” TO YOUR OWN ITINERARY
          </p>
          <h2>
            Your Kerala
            <br />
            story starts
            <br />
            <em>with a hello.</em>
          </h2>
          <p>
            Tea hills, a houseboat, a few days by the sea?
            <br />
            Tell us what you have in mind. We’ll take it from there.
          </p>
          <p className={styles.other}>
            Planning somewhere else in India? You’re in the right place, too.
          </p>
          <a className={styles.phone} href={`tel:${phone.tel}`}>
            {`${phone.display} `}
            <Icon name="arrow" />
          </a>
          <p className={styles.note}>
            Prefer to keep it simple?
            <br />
            <a
              id="direct-whatsapp"
              target="_blank"
              rel="noopener"
              href={whatsappLink(
                "Hi Canty Tours, I'd like to plan a Kerala holiday.",
              )}
            >
              Say hello on WhatsApp <Icon name="arrow" />
            </a>
          </p>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}
