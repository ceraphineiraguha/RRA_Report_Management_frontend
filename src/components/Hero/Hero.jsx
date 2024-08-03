/* eslint-disable no-unused-vars */
import React from "react";
import hero from "../../assets/police_image/peopleImage.jpeg";

const Hero = () => {
  return (

    <div className="dark:bg-gray-950 dark:text-white duration-300 " id="home">
      <div className="container min-h-[620px] flex mt-10 sm:mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
          {/* Image section */}
          <div data-aos="zoom-in" className="order-1 sm:order-2 relative">
            <img
              src={hero}
              alt=""
              className="w-full sm:max-w-[280px] md:max-w-[430px]"
            />
            <div
              data-aos="slide-right"
              className="absolute -bottom-5 -right-8 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 dark:text-white shadow-md"
            >
            </div>
          </div>

          {/* Text section */}
          <div className="space-y-5 order-2 sm:order-1 xl:pr-40 ">
            <h1
              data-aos="fade-up"
              className="text-4xl sm:text-5xl font-semibold"
              style={{ lineHeight: 1.2 }}
            >
              {/* Get in tourch with updated police{" "} */}
              <span className="text-amber-400">RRA Report Management System</span>
            </h1>
            <p data-aos="fade-up" data-aos-delay="300">
            The Rwanda Revenue Authority was established under Law No 15/97 of 8 November 1997 as a quasi-autonomous body charged with the task of assessing, collecting, and accounting for tax, customs and other specified revenues. This is achieved through effective administration and enforcement of the laws relating to those revenues. In addition, it is mandated to collect non-tax revenues.

                <br /> <br />

                <br /><br /> 
            </p>
            {/* <button
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-offset="0"
              className="primary-btn"
            >
              Learn More
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
