import React, {useEffect, useRef } from "react";
import Link from "next/link";
import abouthomeStyles from "../styles/AboutHomepage.module.css";
import Timeline from "./Timeline";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const aboutTitleRef = useRef(null);
  
  useEffect(() => {
    if (aboutTitleRef.current) {
      gsap.to(aboutTitleRef.current, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: aboutTitleRef.current,
          start: "top 70%",
          end: "top 60%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, [aboutTitleRef]);

  return (
    <section className={abouthomeStyles.aboutsection}>
      <h2
        ref={aboutTitleRef}
        className={abouthomeStyles.aboutTitle}
        style={{ opacity: 0 }}
      >
        About
      </h2>
      <Timeline />
      <div className={abouthomeStyles.link}>
      <Link href="/about">More about me here...</Link>
      </div>
    </section>
  );
};

export default About;
