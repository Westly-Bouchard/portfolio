gsap.registerPlugin(ScrollTrigger);

const shoulderStart = 20;
const elbowStart = -10;
const handStart = -10;

const shoulder = document.querySelector("#shoulder-pivot");
const elbow = document.querySelector("#elbow-pivot");
const hand = document.querySelector("#hand-pivot");

const sP = document.querySelector("#path3");
const eP = document.querySelector("#path6");
const hP = document.querySelector("#path11");

gsap.set(shoulder, {
    transformOrigin: `${sP.cx.baseVal.value} ${sP.cy.baseVal.value}`,
    rotation: shoulderStart
});

gsap.set(elbow, {
    transformOrigin: `${eP.cx.baseVal.value} ${eP.cy.baseVal.value}`,
    rotation: elbowStart
});
gsap.set(hand, {
    transformOrigin: `${hP.cx.baseVal.value} ${hP.cy.baseVal.value}`,
    rotation: handStart
});

gsap.to({}, {
    scrollTrigger: {
        trigger: ".intro",
        start: 0,
        end: () => "+=" + window.innerHeight * 0.4,
        scrub: true,
        onUpdate: self => {
            const progress = self.progress;

            const shoulderAngle = shoulderStart - 10 * progress;

            const elbowAngle = elbowStart - 55 * progress;

            const handAngle = -(shoulderAngle + elbowAngle);

            gsap.set(shoulder, {rotation: shoulderAngle});
            gsap.set(elbow, {rotation: elbowAngle});
            gsap.set(hand, {rotation: handAngle});
        }
    }
});