"use client";
import "./sponsors-page.css";

const sponsors = [
{
title: "Title Sponsor",
size: "large",
items: [
{ name: "Coming Soon", logo: "/sponsors/placeholder.png" }
]
},

{
title: "Platinum Sponsors",
size: "medium",
items: []
},

{
title: "Diamond Sponsors",
size: "medium",
items: []
},

{
title: "Gold Sponsors",
size: "small",
items: []
},

{
title: "Silver Sponsors",
size: "small",
items: []
}
];

export default function SponsorsPage(){

return (

<section id="sponsors-page">

<h1 className="sponsor-hero">
Our Sponsors
</h1>

{sponsors.map((group,index)=>(
<section key={index} className="sponsor-section">

<h2 className="sponsor-title">
{group.title}
</h2>

<div className={`sponsor-grid ${group.size}`}>

{group.items.length === 0 ? (

<div className="coming-soon">
Sponsor Slot Available
</div>

) : (

group.items.map((s,i)=>(
<div key={i} className="sponsor-card">

<img src={s.logo} alt={s.name} />

<p>{s.name}</p>

</div>
))

)}

</div>

</section>
))}

</section>

);
}
