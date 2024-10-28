import { useRef } from "react";

import { SERVICES_ELEMID } from "utils/elementsIds";

import "./style.css";

const id =
"AKfycbx9i0IZ7KlSh9_Gkq6s10W-XUsH6tkKcj7eLtV20lL2-0R7e39ddt3KVJS6UXjRmDA0";

function Contact() {
  const ref = useRef<HTMLFormElement | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = 'https://script.google.com/macros/s/AKfycbwcoJpG9P1q2KA6ZThtjvDT9_v8ALzW8GpBNVAM3Zd6hBeze5OYvHsHf2OrDvyKgXpT/exec';
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData as any).toString();

    // Construct the URL with with data as query parameters
    const fullUrl = `${url}?${queryString}`;

    try {
       await fetch(fullUrl, {
        method: "GET",
        mode: "no-cors",
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

