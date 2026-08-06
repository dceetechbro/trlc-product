const testimonials = [

    {
        quote:
        "TRLC 2025 was a life-changing experience for me. It marked a pivotal turning point in my life and launched me into uncharted waters with God. My faith was strengthened, my capacity blossomed, my understanding deepened, my convictions grew stronger, joy found full expression, and my soul was truly refreshed.TRLC 2026 feels like a second dose of strenght impartation for the incredible journey ahead. My soul is in need of refreshing and I can't wait to drink from this well again.",

        name:
        "Ige Oluwatobiloba Emmanuel",

        role:
        "TRLC 2025 Attendee",
    },

    {
        quote:
        "Attending the Divine Life Conference was a life-defining experience for me. I remember being completely blown during the conference by the depth of the Word and hearing the Scriptures taught with such clarity and insight.Every session brought fresh revelation that reshaped my understanding of my reality as a believer. The quality of life God has been helping me live from that experience has been nothing short of beautiful",

        name:
        "Eriifeoluwanimi",

        role:
        "TRLC 2025 Attendee",
    },

    {
        quote:
        "TRLC 2025 was everything I prayed for and much more. It was a solid reminder of the life that I carry. The life I carry is the very life of God; and this life makes me extraordinary in all I do. I also learnt more about my authority as a believer over sickness, limitation, and demonic setback. The conference gave me solid assurance of my status in Christ and how it should be expressed in how I show up in life. I can't wait to receive all God has for me in TRLC 2026.",

        name:
        "Gideon Aleji",

        role:
        "TRLC 2025 Attendee",
    },

    {
        quote:
        "TRLC 2025 changed my life and transformed my perspective of God. I knew I stepped into a new season through that conference. If you've ever experienced the damage of wrong teaching, you'll understand why I'm so grateful for the sound, life-giving teachings from The Resurrected Church. Every session brought clarity, strengthened my faith, and deepened my understanding of my identity in Christ.",
        
        name:
        "Ifeyinwa Opara",

        role:
        "TRLC 2025 Attendee",
    },

];
    
let current = 0;

const slider = document.getElementById("testimonialSlider");

function renderTestimonial(){

    const item = testimonials[current];

    slider.innerHTML = `

        <article class="testimonial-card">

            <p class="testimonial-quote">

                "${item.quote}"

            </p>

            <h3 class="testimonial-name">

                ${item.name}

            </h3>

            <p class="testimonial-role">

                ${item.role}

            </p>

        </article>

    `;

}

document
.getElementById("testimonialNext")
.addEventListener("click",()=>{

    current++;

    if(current>=testimonials.length){

        current=0;

    }

    renderTestimonial();

});

document
.getElementById("testimonialPrev")
.addEventListener("click",()=>{

    current--;

    if(current<0){

        current=testimonials.length-1;

    }

    renderTestimonial();

});

setInterval(()=>{

    current++;

    if(current>=testimonials.length){

        current=0;

    }

    renderTestimonial();

},10000);

renderTestimonial();