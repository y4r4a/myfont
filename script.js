const source = document.getElementById('text-source');
const stage = document.getElementById('stage');
const text = source.textContent;

const letters = [];

text.split('').forEach((char) => {
    const el = document.createElement('span');
    el.textContent = char === ' ' ? '\u00A0' : char;
    el.className = 'letter';
    stage.appendChild(el);

    letters.push({
        el,
        homeX: 0,
        homeY: 0,
        x: 0,
        y:0,
        phase: Math.random() * Math.PI *2,
        speed: 0.6 + Math.random() * 0.6,
        wanderAmount: 10 + Math.random() * 10,
        fleeX: 0,
        fleeY: 0
    });
});

function layoutHomePositions(){
    const stageRect = stage.getBoundingClientRect();
    let totalWidth = 0;
    const widths = letters.map(l => {
        const w = l.el.getBoundingClientRect().width;
        totalWidth += w;
        return w;
    });
    let cursor = (stageRect.width - totalWidth) / 2;
    const centerY = stageRect.height / 2 - letters[0].el.getBoundingClientRect().height / 2;
 
    letters.forEach((l, i) => {
        l.homeX = cursor;
        l.homeY = centerY;
        cursor += widths[i];
        if (l.x === 0 && l.y === 0) {
            l.x = l.homeX;
            l.y = l.homeY;
        }
    });
}

window.addEventListener('load', layoutHomePositions);
window.addEventListener('resize',layoutHomePositions);

const mouse = {x: -999, y: -999};
window.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY
});
window.addEventListener('mouseleave', ()=> {
    mouse.x = -999;
    mouse.y = -999; 
});

const FLEE_RADIUS = 130;
const FLEE_STRENGTH = 140;
const EASE = 0.12;

let t = 0;

function animate(){
    t+=0.02

    letters.forEach((l) => {
        const wanderX = Math.sin(t * l.speed + l.phase) * l.wanderAmount;
        const wanderY = Math.cos(t * l.speed * 1.3 + l.phase) * l.wanderAmount;

        const rect = l.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
         const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
 
        let fleeTargetX = 0;
        let fleeTargetY = 0;
 
        if (dist < FLEE_RADIUS) {
            const strength = (1 - dist / FLEE_RADIUS) * FLEE_STRENGTH;
            const angle = Math.atan2(dy, dx);
            fleeTargetX = Math.cos(angle) * strength;
            fleeTargetY = Math.sin(angle) * strength;
         }
 
        l.fleeX += (fleeTargetX - l.fleeX) * EASE;
        l.fleeY += (fleeTargetY - l.fleeY) * EASE;
 
        const finalX = l.homeX + wanderX + l.fleeX;
        const finalY = l.homeY + wanderY + l.fleeY;
 
        l.el.style.transform = `translate(${finalX}px, ${finalY}px)`;
    });
 
    requestAnimationFrame(animate);
}
 
requestAnimationFrame(animate);