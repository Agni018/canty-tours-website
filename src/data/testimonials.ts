/** A traveller's words about a trip they took with Canty Tours. */
export type Testimonial = {
  quote: string;
  /** As the traveller agreed to be named, e.g. "Asha & Ravi, Bengaluru". */
  name: string;
  /** The trip, e.g. "Munnar and Alleppey, December 2025". */
  trip: string;
};

/**
 * Real testimonials only, each with the traveller's permission. Never write or paraphrase one.
 * The section on the home page stays hidden while this list is empty.
 */
export const testimonials: Testimonial[] = [];
