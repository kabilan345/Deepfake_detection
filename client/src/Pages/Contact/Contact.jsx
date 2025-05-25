import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaLinkedin, FaGithub, FaPhoneAlt, FaEnvelope,
  FaInstagram
} from 'react-icons/fa';
import './Contact.css';
import kabilan from '../../assets/kabilan.jpg';
import vasanth from '../../assets/vasanthkumar.jpg';
import vicky from '../../assets/vicky.jpg';
import yuvaraj from '../../assets/yuvaraj.jpg'

const teamMembers = [
  {
    name: "Kabilan B",
    degree: "B.E CSE",
    college: "Adhiparasakthi College Of Engineering",
    contribution: "Handled AI model development including dataset preprocessing, training, testing, and performance optimization.",
    linkedin: "https://www.linkedin.com/in/kabilan-b-engineer2003/",
    github: "https://github.com/kabilan345",
    insta: "https://www.instagram.com/mr__kabi__chan/",
    mail: "kabilan.b2003@gmail.com",
    image: kabilan
  },
  {
    name: "Vasanthkumar M",
    degree: "B.E CSE",
    college: "Adhiparasakthi College Of Engineering",
    contribution: "Developed the frontend UI for the Deepfake Detection system with real-time results and visual feedback.",
    linkedin: "https://www.linkedin.com/in/vasanthkumar-m-403135318/",
    github: "https://github.com/Vasanthkumar63",
    insta: "https://www.instagram.com/drugs_to_ktm_vasanth15/",
    mail: "vasanthmoorthy15@gmail.com",
    image: vasanth 
  },
  {
    name: "Vignesh E",
    degree: "B.E CSE",
    college: "Adhiparasakthi College Of Engineering",
    contribution: "Built and integrated backend APIs using Flask to process media and serve AI model predictions.",
    linkedin: "https://www.linkedin.com/in/vignesh-e-cse-874332301/",
    github: "https://github.com/Vigneshelumala",
    insta: "https://www.instagram.com/rossi__vs__vicky/",
    mail: "vvignesh25540@gmail.com",
    image: vicky 
  },
  {
    name: "Yuvaraj S",
    degree: "B.E CSE",
    college: "Adhiparasakthi College Of Engineering",
    contribution: "Designed and managed the database system to store user data, detection logs, and media records.",
    linkedin: "https://www.linkedin.com/in/yuvaraj-s-20ba87324/",
    github: "https://github.com/yuvarajselvam2003",
    insta: "https://www.instagram.com/so_mitta_sotta/",
    mail: "yuvarajpulunthai@gmail.com",
    image: yuvaraj 
  }
];


const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const contactRef = collection(db, 'contacts');
      await addDoc(contactRef, {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: Timestamp.now(),
      });

      toast.success("Submitted successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      setForm({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="contact-container">
      {/* Team Section */}
      <div className="team-section">
        <h2 className="team-title">Meet Our Team</h2>
        <div className="team-cards">
          {teamMembers.map((member, idx) => (
            <div className="team-card" key={idx}>
              <img src={member.image} alt={member.name} className="team-photo" />
              <h3>{member.name}</h3>
              <p>{member.degree}</p>
              <p className="contribution">{member.college}</p>
              <p>{member.contribution}</p>
              <div className="team-icons">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                <a href={member.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                <a href={member.insta} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href={`mailto:${member.mail}`}><FaEnvelope /></a> 
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <h1 className="contact-title">Get in Touch</h1>
      <p className="contact-subtitle">
        We’d love to hear from you — whether it's feedback, questions, or collaborations.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        ></textarea>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner" /> Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Contact;
