import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "preact/hooks";
import { cloneElement, type ComponentChildren } from "preact";

import cat1 from "@/assets/images/cats/1.jpg";
import cat2 from "@/assets/images/cats/2.jpg";
import cat3 from "@/assets/images/cats/3.jpg";
import cat4 from "@/assets/images/cats/4.jpg";
import cat5 from "@/assets/images/cats/5.jpg";

import dog1 from "@/assets/images/dogs/1.jpg";
import dog2 from "@/assets/images/dogs/2.jpg";
import dog3 from "@/assets/images/dogs/3.jpg";
import dog4 from "@/assets/images/dogs/4.jpg";
import dog5 from "@/assets/images/dogs/5.jpg";

// register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// images of dogs, and cats for showcase
const images = [cat1, dog1, cat2, dog2, cat3, dog3, cat4, dog4, cat5, dog5];

/**
 * @description scroll animation with image, showcase
 * @param children component to show after animation os complete
 */
export function ScrollAnimation({ children }: { children: ComponentChildren }) {
	const containerRef = useRef(null);
	const imgsRef = useRef<Array<HTMLImageElement | null>>([]);
	const mainContentRef = useRef<HTMLDivElement | null>(null);
	const imgHeight = 136; // maximum size of image

	// Generate random vertical positions
	const getPositions = () => {
		const positions: { y: number }[] = [];
		const vh = window.innerHeight;

		for (let i = 0; i < images.length; i++) {
			const y = Math.random() * (vh - 2 * imgHeight); // -2, coz image don't cross page
			positions.push({ y });
		}
		return positions;
	};

	const positions = getPositions();

	useEffect(() => {
		// set initial positions of the image
		imgsRef.current.forEach((img, i) => {
			gsap.set(img, {
				y: positions[i].y,
				opacity: 1,
			});
		});

		// scroll based animation timeline
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: containerRef.current,
				start: "top top",
				end: "+=1500",
				scrub: true,
				pin: true,
			},
		});

		// update image initial vertical position
		imgsRef.current.forEach((img) => {
			if (img) {
				const centerY = window.innerHeight / 2 - 0.75 * imgHeight;
				tl.to(img, { y: centerY, duration: 1, ease: "power1.out" }, 0);
			}
		});

		// animation logic for images
		imgsRef.current.forEach((img, i) => {
			if (img) {
				const direction = i % 2 === 0 ? 1 : -1;
				tl.to(
					img,
					{
						x: direction * (window.innerWidth + 200),
						opacity: 0,
						duration: 1,
						ease: "power1.in",
					},
					1 + i * 0.1 // stagger
				);
			}
		});

		// animation logic for main component
		if (mainContentRef.current) {
			tl.fromTo(mainContentRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 2 + images.length * 0.1);
		}

		return () => {
			ScrollTrigger.getAll().forEach((st) => st.kill());
			tl.kill();
		};
	}, []);

	const MainContainer = cloneElement(children as any, { ref: mainContentRef });

	return (
		<div ref={containerRef} className="relative w-full min-h-dvh overflow-hidden bg-gray-100 flex flex-col justify-center items-center p-4">
			{/* title */}
			<h1 className="text-lg uppercase text-gray-700 font-anonymous -tracking-wide">cat dog classifier</h1>

			{/* images stack */}
			<div className="relative h-full flex flex-row justify-between min-w-3xl sm:min-w-6xl w-full">
				{images.map((src, i) => (
					<img
						key={`random-${src}-${i}`}
						alt={`random-${i}`}
						src={new URL(src, import.meta.url).href}
						ref={(el: HTMLImageElement | null) => {
							imgsRef.current[i] = el;
						}}
						className="h-24 w-16 sm:h-28 sm:w-20 md:h-34 md:w-24 object-cover rounded-lg shadow-lg"
						style={{ opacity: 0 }}
					/>
				))}
				{MainContainer}
			</div>

			{/* branding */}
			<a href="https://www.linkedin.com/in/oyetanishq" target="_blank" className="text-sm italic text-gray-800 underline underline-offset-3">
				
			</a>
		</div>
	);
}
