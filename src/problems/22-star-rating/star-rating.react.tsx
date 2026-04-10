import cx from "@course/cx";
import flex from "@course/styles";
import { type FC, useState } from "react";
import css from "./star-rating.module.css";

/**
 * Expected input:
 * {
 *   value: number,
 *   onChange: (value: number) => void,
 *   readonly?: boolean
 * }
 *
 * Steps to complete:
 * 1. Init constructor - define props type with value, onChange, readonly
 * 2. Provide template - render star buttons with proper attributes
 * 3. Handle click event - delegate click to update value
 * 4. Add ARIA attributes:
 *    Container:
 *    - role="radiogroup" — groups related radio-like controls so screen readers announce "radiogroup" when entering
 *    - aria-label="Star Rating" — provides an accessible name for the group (no visible label exists)
 *    - aria-readonly="true/false" — tells assistive tech whether the rating can be changed
 *    Each star button:
 *    - role="radio" — each star acts as a radio option within the group
 *    - aria-checked="true/false" — indicates which star is currently selected
 *    - aria-label="N Star(s)" — provides a meaningful label (e.g. "3 Stars") instead of just the emoji
 * 5. Add CSS styles for stars
 */

/*
I'm ignoring everything above, because that's going to let you learn anything

Summary of the problem
Our goal is to create a star rating component. The component needs to support
displaying the stars interactively, and also display them strictly as a static
readonly entity

Constraints
- The number of stars should not be configurable from the outside, and should
  strictly be defined by a constant
- When the component is in readonly mode, it should not be interactive
  whatsoever, and should not give any visual indicators of interactivity
- The component should support the controlled and uncontrolled patterns
- Visual indicators for interactivity should be obvious

Edge cases
- If the component should be controlled (receiving both value and callback via
  props), but only the value is provided, we don't necessarily need to throw
  an error, but we should expect the component to become "accidentally frozen"
- If the component shifts from controlled to uncontrolled mid-render (or vice
  versa), we should try to support that edge case and make sure the component
  doesn't blow up
- The component should support receiving an event handler for updating the
  rating state without receiving a controlled value (basically giving it the
  ability to passively listen to state changes)
- If the controlled value from the outside changes while an animation is
  ongoing, we should generally try to abort/bail out of the animation as
  gracefuly as possible

Further optimizations
- If we're going to support readonly and interactive versions of the component,
  there is an argument for trying to duplicate the code a little bit so that
  you can have a stateful version and a stateless version. It doesn't make sense
  to mount a bunch of state for a readonly component that you know for a fact
  that will never be used
  - The best way to do this will be code duplication (because React hooks don't
    compose super well), so we'll save this for last, depending on whether we
    have time
*/

const star = "⭐️";
const maxStars = 5;

function toIndexList(endBoundExclusive: number): readonly number[] {
	const list: number[] = [];
	for (let i = 0; i < endBoundExclusive; i++) {
		list.push(i);
	}
	return list;
}

type StarRatingProps = Readonly<{
	rating?: number;
	defaultRating?: number;
	onRatingChange?: (newRating: number) => void;
	readonly?: boolean;
}>;

export const StarRating: FC<StarRatingProps> = ({
	rating,
	onRatingChange,
	defaultRating = 0,
	readonly = false,
}) => {
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const [internalRating, setInternalRating] = useState(defaultRating);
	const activeRating = rating ?? internalRating;

	if (activeRating > maxStars || activeRating < 0) {
		throw new RangeError(
			`Provided rating ${activeRating} does not fall within range 0-${maxStars}`,
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexFlow: "row nowrap",
				alignItems: "center",
				gap: "4px",
			}}
		>
			{/*This should be screen-reader-only. hidden hides the content from literally everything*/}
			<span hidden>The rating is ${activeRating}</span>

			{toIndexList(maxStars).map((starIndex) => {
				const ratingValue = starIndex + 1;
				const showAsFaded =
					hoveredIndex !== -1
						? hoveredIndex < starIndex
						: ratingValue > activeRating;

				return (
					<button
						key={starIndex}
						type="button"
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							width: "24px",
							height: "24px",
							backgroundColor: "transparent",
							border: "none",
							cursor: readonly ? "default" : "pointer",
							opacity: showAsFaded ? "45%" : "100%",
						}}
						onClick={() => {
							if (!readonly) {
								setInternalRating(ratingValue);
								onRatingChange?.(ratingValue);
							}
						}}
						onPointerEnter={() => {
							if (!readonly) {
								setHoveredIndex(starIndex);
							}
						}}
						onPointerLeave={() => {
							if (!readonly) {
								setHoveredIndex(-1);
							}
						}}
					>
						<span aria-hidden>{star}</span>
					</button>
				);
			})}
		</div>
	);
};
