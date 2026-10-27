"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useJourneys } from "@/components/JourneyProvider";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import {
  budgets,
  occasions,
  paces,
  travellerCounts,
  tripLengths,
} from "@/data/options";
import { whatsappLink } from "@/data/site";
import type { Tour } from "@/data/tours";
import {
  durationText,
  enquiryMessage,
  journeyEnquiryMessage,
  journeyMessage,
} from "@/lib/journeys";
import { cx, journeyUrl, scrollToSection } from "@/lib/utils";
import styles from "./EnquiryForm.module.css";

type EnquiryFormProps = {
  /** On a journey's page: the journey being planned. Without it, the general trip planner. */
  journey?: Tour;
  className?: string;
};

/** Today as YYYY-MM-DD in the visitor's time zone, for the date input's min. */
function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Enquiry form. Builds a WhatsApp message for the visitor to review and send; nothing is stored.
 * On a journey's page the journey sets the destination, length and style, so those are not asked.
 */
export function EnquiryForm({ journey, className }: EnquiryFormProps) {
  const { tripRequest, notify } = useJourneys();
  const destinationInput = useRef<HTMLInputElement>(null);
  const [destination, setDestination] = useState("Kerala");
  // The first option of each list is its default.
  const [choices, setChoices] = useState({
    tripLength: tripLengths[0],
    travellers: travellerCounts[0],
    occasion: occasions[0],
    budget: budgets[0],
    pace: paces[0],
  });
  const [minDate, setMinDate] = useState<string>();
  const [messageUrl, setMessageUrl] = useState<string>();
  const id = journey ? "journey-enquiry" : "trip";

  // Set on the client so a build-time date never goes stale.
  useEffect(() => setMinDate(today()), []);

  // "Plan a custom trip" (empty journey results) fills in the destination and brings the form up.
  useEffect(() => {
    if (!tripRequest || journey) return;
    setDestination(tripRequest.destination);
    scrollToSection("plan");
    destinationInput.current?.focus({ preventScroll: true });
  }, [tripRequest, journey]);

  function choose(key: keyof typeof choices) {
    return (value: string) => setChoices((c) => ({ ...c, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const name = value("name");
    if (!name || (!journey && !destination.trim())) {
      notify("Please add your name and a destination idea.");
      return;
    }
    const details = {
      name,
      date: value("date"),
      notes: value("notes"),
      ...choices,
    };
    const message = journey
      ? journeyEnquiryMessage(journey, details, journeyUrl(journey.id))
      : enquiryMessage({ ...details, destination: destination.trim() });
    const url = whatsappLink(message);
    window.open(url, "_blank", "noopener,noreferrer");
    setMessageUrl(url);
  }

  const Heading = journey ? "h2" : "h3";

  return (
    <form
      id={journey ? "enquire" : "trip-form"}
      // No scroll reveal for the journey card: it stays in view while the route scrolls.
      className={cx(styles.form, !journey && "reveal", className)}
      onSubmit={handleSubmit}
      aria-labelledby={`${id}-title`}
    >
      <Heading id={`${id}-title`}>
        {journey ? "Plan this journey" : "Let’s make it yours."}
      </Heading>
      {journey ? (
        <p className={styles.journey}>
          {durationText(journey)} · Price on request
        </p>
      ) : (
        <p>Share a few details to start the conversation.</p>
      )}
      <div className={cx(styles.grid, journey && styles.compact)}>
        <Field label="Your name" full={Boolean(journey)}>
          <input
            name="name"
            autoComplete="given-name"
            placeholder="What should we call you?"
            maxLength={80}
            required
          />
        </Field>
        {!journey && (
          <Field label="Where would you like to go?">
            <input
              ref={destinationInput}
              name="destination"
              id="plan-destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Kerala, or anywhere in India"
              maxLength={160}
              required
            />
          </Field>
        )}
        <Field label="When are you thinking?">
          <input name="date" type="date" min={minDate} />
        </Field>
        {!journey && (
          <Dropdown
            id={`${id}-length`}
            label="How long can you stay?"
            options={tripLengths}
            value={choices.tripLength}
            onChange={choose("tripLength")}
            boxed
          />
        )}
        <Dropdown
          id={`${id}-travellers`}
          label="Who’s coming?"
          options={travellerCounts}
          value={choices.travellers}
          onChange={choose("travellers")}
          boxed
        />
        <Dropdown
          id={`${id}-occasion`}
          label="What’s the occasion?"
          options={occasions}
          value={choices.occasion}
          onChange={choose("occasion")}
          boxed
        />
        <Dropdown
          id={`${id}-budget`}
          label="Budget per person"
          options={budgets}
          value={choices.budget}
          onChange={choose("budget")}
          boxed
        />
        {!journey && (
          <Dropdown
            id={`${id}-pace`}
            label="Your travel style"
            options={paces}
            value={choices.pace}
            onChange={choose("pace")}
            boxed
          />
        )}
        <Field label="Anything else?" full>
          <textarea
            name="notes"
            rows={2}
            maxLength={1000}
            placeholder={
              journey
                ? "Arrival city, stays you like, places to add or skip…"
                : "Departure city, houseboat or resort, must-see places, preferred stays…"
            }
          />
        </Field>
      </div>
      <Button
        type="submit"
        variant="orange"
        raised
        arrow
        className={styles.submit}
      >
        Send on WhatsApp
      </Button>
      <p className={styles.privacy}>
        Opens WhatsApp with your message ready to review and send. This site
        doesn’t store your details or make a booking.
      </p>
      {journey && (
        <p className={styles.quick}>
          Just have a question?{" "}
          <a
            href={whatsappLink(journeyMessage(journey, ""))}
            target="_blank"
            rel="noopener"
          >
            Ask about this journey <Icon name="arrow" />
          </a>
        </p>
      )}
      <p role="status" className={styles.status}>
        {messageUrl && (
          <>
            Your message is ready. If WhatsApp didn’t open,{" "}
            <a href={messageUrl} target="_blank" rel="noopener noreferrer">
              open your prepared message here <Icon name="arrow" />
            </a>
          </>
        )}
      </p>
    </form>
  );
}
