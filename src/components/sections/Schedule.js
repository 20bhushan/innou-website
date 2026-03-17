"use client";

import "./schedule.css";
import { eventConfig } from "@/config/eventConfig";
import { useEffect, useRef } from "react";


import {
LuActivity,
LuBug,
LuCalendar,
LuGamepad2,
LuKeyboard,
LuLaptop,
LuLightbulb,
LuMapPin,
LuMic,
LuSparkles,
LuTrophy,
} from "react-icons/lu";


export default function Schedule() {


const days = eventConfig.schedule || [];


/* Duplicate cards for infinite scroll */
const allDays = [...days, ...days];


const trackRef = useRef(null);


useEffect(()=>{


const track = trackRef.current;


let position = 0;
let speed = 0.35;
let paused = false;


const pause = () => paused = true;
const play = () => paused = false;


track.addEventListener("mouseenter", pause);
track.addEventListener("mouseleave", play);


function animate(){


if(!paused){
position -= speed;
}


if(Math.abs(position) >= track.scrollWidth / 2){
position = 0;
}


track.style.transform = `translateX(${position}px)`;


requestAnimationFrame(animate);
}


animate();


return ()=>{


track.removeEventListener("mouseenter", pause);
track.removeEventListener("mouseleave", play);


};


},[]);




const iconMap = {
keyboard: LuKeyboard,
bug: LuBug,
laptop: LuLaptop,
activity: LuActivity,
mic: LuMic,
trophy: LuTrophy,
lightbulb: LuLightbulb,
gamepad: LuGamepad2,
sparkles: LuSparkles
};


return (


<section id="schedule" className="timeline-section reveal section-shell">


<h2 className="section-title">Schedule</h2>


<div className="schedule-scroll">


<div className="schedule-track" ref={trackRef}>


{allDays.map((d,i)=>{


return(


<article key={i} className="track-card">


<h3>{d.day}</h3>


<p className="date">
<LuCalendar size={16}/>
{d.date}
</p>


<ul>


{d.events.map((e,index)=>{


const Icon = iconMap[e.type];


return(


<li key={index}>


{Icon && <Icon size={16} color="var(--neon-cyan)" />}


{e.text}


</li>


);


})}


</ul>


<p className="venue">


<LuMapPin size={16}/>


{d.venue}


</p>


</article>


);


})}


</div>


</div>


</section>


);


}
