import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import carouselStyles from "../styles/ProjectCarousel.module.css";
import RecursiveTimeout from "./recursiveTimeout";

const AUTOPLAY_INTERVAL = 4000;

const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 3.0, delay: 2.5 } }, // Adjust the duration as needed
};

const ProjectCarousel = ({ images }) => {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openLightbox = (imageUrl) => {
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedImage("");
    setLightboxOpen(false);
  };

  const autoplay = useCallback(() => {
    if (!embla) return;

    if (embla.canScrollNext()) {
      embla.scrollNext();
    } else {
      embla.scrollTo(0);
    }
  }, [embla]);

  const { play, stop } = RecursiveTimeout(autoplay, AUTOPLAY_INTERVAL);

  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  useEffect(() => {
    play();
  }, [play]);

  const scrollPrev = () => {
    if (embla) {
      embla.scrollPrev();
      stop();
    }
  };

  const scrollNext = () => {
    if (embla) {
      embla.scrollNext();
      stop();
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariant}
      className={carouselStyles.mainpage}
    >
      <div className={carouselStyles.bodycontainer}>
        <div className={carouselStyles.carousel}>
          <div className={carouselStyles.embla} ref={emblaRef}>
            <div className={carouselStyles.embla__container}>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className={carouselStyles.slide}
                  onClick={() => openLightbox(image)}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariant}
                >
                  <div className={carouselStyles.slideContent}>
                    <motion.img
                      className={carouselStyles.image}
                      src={image}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInVariant}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className={carouselStyles.dotcontainer}>
              <button className={carouselStyles.arrowLeft} onClick={scrollPrev}>
                &lt;
              </button>
              <button className={carouselStyles.arrowRight} onClick={scrollNext}>
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className={carouselStyles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className={carouselStyles.closeButton} onClick={closeLightbox}>
              &times;
            </button>
            <motion.img
              className={carouselStyles.lightboxImage}
              src={selectedImage}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCarousel;
