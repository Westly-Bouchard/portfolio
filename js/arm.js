gsap.registerPlugin(ScrollTrigger);

const shoulderStart = 20;
const elbowStart = -10;
const handStart = -10;

const shoulder = document.querySelector("#shoulder-pivot");
const elbow = document.querySelector("#elbow-pivot");
const hand = document.querySelector("#hand-pivot");

gsap.set(shoulder, {
    transformOrigin: "937px 89.264px",
    rotation: shoulderStart
});

gsap.set(elbow, {
    transformOrigin: "762.791px 89.264",
    rotation: elbowStart
});
gsap.set(hand, {
    transformOrigin: "647.538 89.264",
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