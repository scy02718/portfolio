import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import { myAwards } from '../constants/index.js';

const Awards = () => {
  const [selectedAwardIndex, setSelectedAwardIndex] = useState(0);
  const [direction, setDirection] = useState(0); // Tracks animation direction (-1 or 1)
  const currentAward = myAwards[selectedAwardIndex];
  const numAwards = myAwards.length;

  const handleNavigation = (direction) => {
    setDirection(direction === 'previous' ? -1 : 1); // Set direction
    setSelectedAwardIndex((prevIndex) => {
      if (direction === 'previous') {
        return prevIndex === 0 ? numAwards - 1 : prevIndex - 1;
      } else {
        return prevIndex === numAwards - 1 ? 0 : prevIndex + 1;
      }
    });
  };

  const handleNavigationWithIndex = (index) => {
    setDirection(index > selectedAwardIndex ? 1 : -1); // Determine animation direction
    setSelectedAwardIndex(index);
  };

  return (
    <section id="awards" className="c-space my-20">
      <div className="w-full text-white-600">
        <h3 className="head-text">Awards</h3>
        <div className="p-10 shadow-2xl shadow-black-200 bg-black-200 border-2 border-black-300 rounded-lg mt-10 w-full overflow-hidden">
          {/* Fixed height container to avoid height changes */}
          <div className="relative h-40"> 
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={selectedAwardIndex} // Unique key for each award
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 w-full"
              >
                <div className="flex flex-col gap-2 text-white-600 items-start">
                  <p className="animatedText">{currentAward.provider}</p>
                  <div className='flex items-center gap-3'>
                    <p className="text-2xl font-bold text-white animatedText">{currentAward.title}</p>
                    <div className="px-2 rounded-xl bg-black-300">
                      <p>{currentAward.year}</p>
                    </div>
                  </div>

                  <p className="animatedText">{currentAward.desc}</p>

                  <div className='flex gap-2 mt-3 justify-start items-center'>
                    <p>Received: </p>
                    <p className="text-white-700">{currentAward.reward}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center mt-7 w-full">
            <button
              className="arrow-btn"
              onClick={() => handleNavigation('previous')}
            >
              <img
                src="/assets/left-arrow.png"
                alt="left-arrow"
                className="w-4 h-4"
              />
            </button>

            <div className="flex items-center gap-3">
              {Array.from({ length: numAwards }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigationWithIndex(i)}
                  className="focus:outline-none"
                >
                  {selectedAwardIndex === i ? (
                    <div className="bg-white-500 w-2 h-2 rounded-full"></div>
                  ) : (
                    <div className="bg-white w-2 h-2 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            <button
              className="arrow-btn"
              onClick={() => handleNavigation('next')}
            >
              <img
                src="/assets/right-arrow.png"
                alt="right-arrow"
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
