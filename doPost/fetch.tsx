import { useRef } from "react";

import { SERVICES_ELEMID } from "utils/elementsIds";

// CSS prefix: .contact-
import "./style.css";

const id =
"AKfycbyIz_MoluK76c-f9wM6XH1v6Bzz5vcDhI8z6lck80KvWohiWuXHSkRJmSdfyWUQbwvipQ";

function Contact() {
  const ref = useRef<HTMLFormElement | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = `https://script.google.com/macros/s/${id}/exec`;
    // const url = 'https://script.google.com/macros/s/AKfycbyIz_MoluK76c-f9wM6XH1v6Bzz5vcDhI8z6lck80KvWohiWuXHSkRJmSdfyWUQbwvipQ/exec';
    
    const form = e.currentTarget;
    const formData = new FormData(form);
  
    try {
       await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // @ts-expect-error: 33
        body: new URLSearchParams(Object.fromEntries(formData)),
      });

      console.log("Thank you for your feedback!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your data. Please try again.");
    } 
  }

  return (
    <section id={SERVICES_ELEMID} className="contact-sect">
      <h2 className="contact-h2">Contact Us</h2>

      <form ref={ref} className="contact-form" onSubmit={onSubmit}>
        {/* Name */}
        <div className="contact-inp-cont">
          <label className="contact-inp-label">Name</label>
          <input
            name="Name"
            className="contact-inp-inp"
            type="text"
            placeholder="John Smith"
          />
        </div>

        {/* Email */}
        <div className="contact-inp-cont">
          <label className="contact-inp-label">Email</label>
          <input
            name="Email"
            className="contact-inp-inp"
            type="text"
            placeholder="john@gmail.com"
          />
        </div>

        {/* Company */}
        <div className="contact-inp-cont">
          <label className="contact-inp-label">Company</label>
          <input
            name="Company"
            className="contact-inp-inp"
            type="text"
            placeholder="Company name"
          />
        </div>

        {/* Message */}
        <div className="contact-inp-cont">
          <label className="contact-inp-label">Message</label>
          <textarea
            name="Message"
            className="contact-inp-textarea"
            placeholder="Your message..."
          />
        </div>
        <button className="contact-form-btn">Submit</button>
      </form>
    </section>
  );
}

export default Contact;

