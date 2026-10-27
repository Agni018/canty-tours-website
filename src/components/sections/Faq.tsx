import type { ReactNode } from "react";
import { whatsappLink } from "@/data/site";
import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./Faq.module.css";

const questions: { question: string; answer: ReactNode }[] = [
  {
    question: "How many days should I spend in Kerala?",
    answer:
      "Choose a short break focused on one area, or a longer journey combining several stops. Open a journey to compare its day-by-day route, then tell us your arrival times and preferred pace so we can personalise it.",
  },
  {
    question: "When is a good time to visit Kerala?",
    answer: (
      <>
        {
          "November to February is a popular window for milder weather. Monsoon months bring greener landscapes and rain, so outdoor activities and road journeys need flexibility. Your best dates depend on the places and experiences you choose. "
        }
        <a
          href="https://www.keralatourism.org/faq/what-should-you-know-before-going-on-vacation-to-kerala"
          target="_blank"
          rel="noopener"
        >
          Kerala Tourism’s planning advice <Icon name="arrow" />
        </a>
      </>
    ),
  },
  {
    question: "Where should I arrive and depart?",
    answer:
      "Kochi is a useful starting point for Munnar and the central Kerala backwaters. A journey ending on the southern coast can finish via Thiruvananthapuram. For Wayanad, discuss Kozhikode or Kannur. Confirm the route and transfer time with us before booking your tickets.",
  },
  {
    question: "Should I choose a houseboat or a backwater resort?",
    answer:
      "A daytime cruise gives you time on the water while keeping a hotel or resort as your base. An overnight houseboat adds a night on board; boats generally moor in the evening. Discuss the cruise route, private or shared use, meals and air-conditioning hours before choosing. Houseboat stays are optional in our sample plans.",
  },
  {
    question: "Can I customise a Kerala itinerary?",
    answer:
      "Yes. Use a sample route as a starting point, then share your dates, group details and interests. Ask about slower transfers, family-friendly stays, honeymoon ideas or more time in one destination. Your quote will confirm the agreed arrangements.",
  },
  {
    question: "How do pricing, inclusions and booking work?",
    answer:
      "Request a personalised quote through the planner or WhatsApp. Prices depend on your dates, stays, transport and activities. Hotels, flights, meals and experiences are included only when listed in your quote. Review inclusions, exclusions, payment and cancellation terms before paying. An enquiry does not confirm a booking.",
  },
  {
    question: "Can you plan holidays elsewhere in India?",
    answer: (
      <>
        {
          "Absolutely. Kerala is our main focus, and you can also explore Rajasthan, Goa, Ladakh, Sikkim and the Golden Triangle here. Tell us about any other Indian destination you have in mind, or "
        }
        <a href="#beyond-kerala">
          explore beyond Kerala <Icon name="arrow" />
        </a>
        .
      </>
    ),
  },
];

export function Faq() {
  return (
    <section className={cx("section wrap", styles.faq)} id="faq">
      <div className="reveal">
        <p className={cx("eyebrow", styles.eyebrow)}>
          A LITTLE KERALA KNOW-HOW
        </p>
        <h2>
          {/* The space keeps the words apart where the line break is hidden on phones. */}
          Before you <br />
          follow the green.
        </h2>
        <p>
          From your first arrival to the last sunset.
          <br />
          <a href={whatsappLink()} target="_blank" rel="noopener">
            Let’s talk through your plans <Icon name="arrow" />
          </a>
        </p>
      </div>
      <div className={cx(styles.list, "reveal")}>
        {questions.map((q) => (
          <details key={q.question}>
            <summary>
              {q.question}
              <span>+</span>
            </summary>
            <p>{q.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
