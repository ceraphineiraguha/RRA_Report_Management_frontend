/* eslint-disable no-unused-vars */
import React from 'react'
import AboutImg from '../../assets/police_image/img2.jpeg';

function About() {
    return (
        <section id="about">
            <h2
                data-aos="fade-up"
                className=" text-center text-3xl font-bold underline-offset-4">About us</h2>
            <main className="bg-slate-100 dark:bg-slate-900 dark:text-white">

                <section className="container flex flex-col items-center justify-center py-10 md:h-[500px] ">

                    <div className="grid grid-cols-1 items-center gap-4  md:grid-cols-2">
                        <div
                            data-aos="fade-right"

                        >
                            <img
                                src={AboutImg}
                                alt="No image"
                                className="max-auto w-full hover:drop-shadow-md h-80"
                            />
                        </div>
                        <div

                            data-aos="fade-left"
                            // data-aos-duration="400"
                            // data-aos-once="true"
                            className="flex flex-col items-start gap-4 text-left md:items-start md:p-8 md:text-left "

                        >
                            
                            <h2 className=" text-2xl text-slate-500">Who we are</h2>
                            <p className="text-md  dark:text-slate-400">
                            The Rwanda Revenue Authority was established under Law No 15/97 of 8 November 1997 as a quasi-autonomous body charged with the task of assessing, collecting, and accounting for tax, customs and other specified revenues. This is achieved through effective administration and enforcement of the laws relating to those revenues. In addition, it is mandated to collect non-tax revenues.
                            </p>
                            <div>
                                <h2 className=" text-2xl text-slate-500">Vision</h2>
                                <p className="text-sm  dark:text-slate-400">
                                    Professional Investigative Institution that upholds Rule of Law
                                     and Human Rights towards a Crime-free Nation
                                </p>
                            </div>
                            <div>


                                <h2 className=" text-2xl text-slate-500">Mission</h2>
                                <p className="text-sm  dark:text-slate-400">
                                    To prevent, detect, investigate and respond to current
                                     and emerging crime threats through the use of modern technology
                                      and building partnership in order to uphold the rule of law.
                                </p>
                            </div>
                            
                        </div>

                    </div>
                </section>
            </main>
        </section>
    )
}

export default About
