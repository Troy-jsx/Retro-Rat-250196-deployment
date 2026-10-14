import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./RetroToast.css";
// import retroIcon from "../assets/retroIcon.svg";
// import retroIcon from "../assets/bootRatWhite.svg"; 



// MOVED OUTSIDE SO IT'S NOT RECREATED ON EVERY RENDER (saves memory and prevents react from recreating the array and function every single time this is called)

// Extracted  the X/Y coordinates from the "original" (ErrorToast) path string
const pixelMap = [
    { y: 0, xVals: [18, 19, 20, 21, 22, 23, 24, 25, 27, 29, 31, 33, 35, 38, 41, 45, 49, 54] },
    { y: 1, xVals: [18, 19, 20, 21, 22, 23, 24, 26, 28, 30, 32, 34, 36, 39, 43, 47, 51, 56] },
    { y: 2, xVals: [18, 19, 20, 21, 22, 23, 24, 25, 27, 29, 31, 33, 35, 38, 41, 45, 49, 54] },
    { y: 3, xVals: [18, 19, 20, 21, 22, 23, 24, 26, 28, 30, 32, 34, 36, 39, 43, 47, 51, 56] }
];

// Helper function to generate completely random colors >:D
const getRainbow = (x) => {
    const rainbow = ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"];
    const index = Math.min(Math.floor(((x - 18) / (60 - 18)) * rainbow.length), rainbow.length - 1);
    return rainbow[index];
}


// const getRandomColor = () => {
//     const randomIndex = Math.floor(Math.random() * rainbowArray.length);

//     return rainbowArray[randomIndex];
// };

// react shouldnt do this every render O_O
const flatPixels = pixelMap.flatMap((row) =>
    row.xVals.map((xVal) => ({
        key: `${xVal}-${row.y}`,
        x: xVal,
        y: row.y,
    }))
);

export default function RetroToast({ isOpen, onClose, message }) { //dont really plan on adding any action buttons so no action prop for now o7

    // const navigate = useNavigate(); //not used here cause no buttons o7

    // useMemo freezes the set of colopus for as long as the toast is rendered to avoid disco-seizures while the user is looking at it :P (UNLESS WE WANT CONTINUOUS STROBBING SEIZUE GLITCHY EFFECT)
    // const coloredPixels = useMemo(() => {
    //     return pixelMap.flatMap((row) =>
    //         row.xVals.map((xVal) => ({
    //             key: `${xVal}-${row.y}`,
    //             x: xVal,
    //             y: row.y,
    //             color: getRandomColor()
    //         }))
    //     );
    // }, []); // Empty dependency array - only runs once per mount

    // If the toast isn't open, render absolute nothingness
    if (!isOpen) return null; //(mounting)

    // const handleLoginClick = () => {
    //     onClose(); // Nuke the toast first
    //     if (action && action.route) {
    //         navigate(action.route); // Beam them to the provided route
    //     }
    // };







    // return (
    //     <div className="retro-toast-overlay">
    //         <div className="retro-toast-window">

    //             {/* THE PIXELATED DITHER HEADER */}
    //             <div className="retro-title-bar">
    //                 {/* may the css gods forgive me for what i'm about to do */}
    //                 <svg className="retro-title-dither" viewBox="0 0 60 4" preserveAspectRatio="none" shapeRendering="crispEdges">

    //                     {/* Base White Canvas Layer */}
    //                 <rect width="60" height="4" fill="#ffffff" />

    //                     {/* RAINBOWWW */}
    //                     <rect width="60" height="4" className="animated-rainbow-pixel" 
    //                     /* Negative delay so it flows into the pixels */
    //                     style={{ animationDelay: `0s` }} />

    //                     {/* Solid Starting block */}
    //                     {/* <rect width="18" height="4" 
    //                     // fill={coloredPixels[0]?.color} //solid colour
    //                     fill={getRandomColor()} //the siezure edition
    //                     /> */}

    //                     {/* ✨ Animated 8-Bit Pixel Map ✨ */}
    //                 {flatPixels.map((pixel) => (
    //                     <rect
    //                         key={pixel.key}
    //                         x={pixel.x}
    //                         y={pixel.y}
    //                         width="1"
    //                         height="1"
    //                         className="animated-rainbow-pixel"
    //                         /* magically stagger the animation based on the X coordinates
    //                            - negative value ensures the animation is already running 
    //                            when the component mounts, preventing the weird jumpy thing. */
    //                         style={{ animationDelay: `${pixel.x * -0.08}s` }}
    //                     />
    //                 ))}


    //                     {/* ✨8-Bit Pixel Map✨ */}
    //                     {/* Loops through the coordinates and renders 1x1 blocks :D*/}

    //                     {/* VERSION 1: STROBBING DRISCO SIEZURE */}
    //                     {/* callin random colour function in jsx means when parent component updates rerender the svg, generating colours */}
    //                     {/* {pixelMap.map((row) =>
    //                         row.xVals.map((xVal) => (
    //                             <rect
    //                                 key={`${xVal}-${row.y}`} //Unique React key for each block
    //                                 x={xVal}
    //                                 y={row.y}
    //                                 width="1"
    //                                 height="1"
    //                                 fill={getRandomColor()}
    //                             />
    //                         ))
    //                     )} */}

    //                     {/* VERSION 2: NORMAL */}
    //                     {/* 8-Bit Pixel Map rendered from useMemo locked array :D
    //                     React remembers the exact colors until the component unmounts, unique every time it opens, but stable while you read it o7 */}
    //                 {/* {coloredPixels.map((pixel) => (
    //                     <rect
    //                         key={pixel.key}
    //                         x={pixel.x}
    //                         y={pixel.y}
    //                         width="1"
    //                         height="1"
    //                         fill={pixel.color}
    //                     />
    //                 ))} */}

    //                 </svg>

    //                 <div className="retro-title-text">Retro-Rat OS</div>
    //                 <button className="retro-close-x" onClick={onClose}>

    //                     <div className="x-mark">✖</div>
    //                 </button>
    //             </div>

    //             {/* THE MEAT OF THE TOAST (NOW WITH FLASHING CSS*/}

    //             <div className="retro-window-body" 
    //             // style={{backgroundColor: getRandomColor()}}
    //             >
    //                 <div className="retro-content">


    //                     <div className="retro-icon">
    //                         <img src={retroIcon} alt="retro icon" />
    //                     </div>

    //                     <div className="retro-message-text">
    //                         {message || "Task Successful"}
    //                     </div>
    //                 </div>

    //                 {/* THE WIN95 CHUNKY BUTTONS */}
    //                 <div className="retro-actions">
    //                     {/* only render estra button is an 'action' is passed in o7 */}
    //                     {/* {action && (
    //                         <button className="win95-btn" onClick={handleLoginClick}>
    //                             Login
    //                         </button>
    //                     )} */}

    //                     {/* DEFAULT OK BUTTON IS ALWAYS HERE o7 */}
    //                     <button className="win95-btn" onClick={onClose}>
    //                         OK
    //                     </button>
    //                 </div>
    //             </div>

    //         </div>
    //     </div>
    // );

    return (
        <div className="retro-toast-overlay">
            <div className="retro-toast-window">

                {/* THE PIXELATED DITHER HEADER */}
                <div className="retro-title-bar">
                    <svg className="retro-title-dither" viewBox="0 0 60 4" preserveAspectRatio="none" shapeRendering="crispEdges">
                        {/* Base White Canvas Layer */}
                        <rect width="60" height="4" fill="#ffffff" />


                        <rect width="18" height="4" fill="#ff0000" />

                        {/* ✨ Cascading 8-Bit Pixel Map ✨ */}
                        {flatPixels.map((pixel) => (
                            <rect
                                key={pixel.key}
                                x={pixel.x}
                                y={pixel.y}
                                width="1"
                                height="1"
                                className="cascade-pixel"
                                fill={getRainbow(pixel.x)}

                            
                                style={{ animationDelay: `${pixel.y * 0.15 + (pixel.x - 18) * 0.02}s` }}
                            />
                        ))}
                    </svg>

                    <div className="retro-title-text">Retro-Rat OS</div>
                    <button className="retro-close-x" onClick={onClose}>
                        <div className="x-mark">✖</div>
                    </button>
                </div>

                {/* THE MEAT OF THE TOAST (Flashing animation  now) */}
                <div className="retro-window-body">
                    <div className="retro-content">

                        <div className="retro-icon">
                            {/* Inlined SVG og the bootRatWhite so i can control the colours of the blocks! */}
                            <svg width="100%" height="100%" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g className="flashing-rat-pixels">
                                    <rect x="26" y="42.25" width="3.25" height="3.25" />
                                    <rect x="39" y="16.25" width="3.25" height="3.25" />
                                    <rect x="13" y="16.25" width="3.25" height="3.25" />
                                    <rect x="26" y="48.75" width="3.25" height="3.25" />
                                    <rect y="9.75" width="3.25" height="3.25" />
                                    <rect x="39" y="48.75" width="3.25" height="3.25" />
                                    <rect x="39" y="9.75" width="3.25" height="3.25" />
                                    <rect x="13" y="35.75" width="3.25" height="3.25" />
                                    <rect x="13" y="9.75" width="3.25" height="3.25" />
                                    <rect x="32.5" y="42.25" width="3.25" height="3.25" />
                                    <rect x="6.5" y="29.25" width="3.25" height="3.25" />
                                    <rect x="45.5" y="16.25" width="3.25" height="3.25" />
                                    <rect x="45.5" y="3.25" width="3.25" height="3.25" />
                                    <rect x="19.5" y="3.25" width="3.25" height="3.25" />
                                    <rect x="32.5" y="22.75" width="3.25" height="3.25" />
                                    <rect x="32.5" y="9.75" width="3.25" height="3.25" />
                                    <rect x="6.5" y="9.75" width="3.25" height="3.25" />
                                    <rect x="45.5" y="22.75" width="3.25" height="3.25" />
                                    <rect x="19.5" y="9.75" width="3.25" height="3.25" />
                                    <rect x="26" y="6.5" width="3.25" height="3.25" />
                                    <rect y="6.5" width="3.25" height="3.25" />
                                    <rect x="13" y="45.5" width="3.25" height="3.25" />
                                    <rect x="39" y="32.5" width="3.25" height="3.25" />
                                    <rect x="39" y="6.5" width="3.25" height="3.25" />
                                    <rect x="13" y="6.5" width="3.25" height="3.25" />
                                    <rect x="26" y="39" width="3.25" height="3.25" />
                                    <rect y="13" width="3.25" height="3.25" />
                                    <rect x="39" width="3.25" height="3.25" />
                                    <rect x="13" width="3.25" height="3.25" />
                                    <rect x="39" y="39" width="3.25" height="3.25" />
                                    <rect x="39" y="13" width="3.25" height="3.25" />
                                    <rect x="13" y="39" width="3.25" height="3.25" />
                                    <rect x="13" y="13" width="3.25" height="3.25" />
                                    <rect x="6.5" y="19.5" width="3.25" height="3.25" />
                                    <rect x="32.5" y="6.5" width="3.25" height="3.25" />
                                    <rect x="6.5" y="6.5" width="3.25" height="3.25" />
                                    <rect x="19.5" y="45.5" width="3.25" height="3.25" />
                                    <rect x="32.5" y="26" width="3.25" height="3.25" />
                                    <rect x="32.5" width="3.25" height="3.25" />
                                    <rect x="6.5" width="3.25" height="3.25" />
                                    <rect x="32.5" y="13" width="3.25" height="3.25" />
                                    <rect x="6.5" y="39" width="3.25" height="3.25" />
                                    <rect x="6.5" y="13" width="3.25" height="3.25" />
                                    <rect x="45.5" y="26" width="3.25" height="3.25" />
                                    <rect x="3.25" y="16.25" width="3.25" height="3.25" />
                                    <rect x="29.25" y="3.25" width="3.25" height="3.25" />
                                    <rect x="16.25" y="42.25" width="3.25" height="3.25" />
                                    <rect x="42.25" y="29.25" width="3.25" height="3.25" />
                                    <rect x="3.25" y="22.75" width="3.25" height="3.25" />
                                    <rect x="29.25" y="9.75" width="3.25" height="3.25" />
                                    <rect x="16.25" y="22.75" width="3.25" height="3.25" />
                                    <rect x="42.25" y="9.75" width="3.25" height="3.25" />
                                    <rect x="16.25" y="9.75" width="3.25" height="3.25" />
                                    <rect x="35.75" y="16.25" width="3.25" height="3.25" />
                                    <rect x="9.75" y="16.25" width="3.25" height="3.25" />
                                    <rect x="22.75" y="42.25" width="3.25" height="3.25" />
                                    <rect x="9.75" y="48.75" width="3.25" height="3.25" />
                                    <rect x="35.75" y="35.75" width="3.25" height="3.25" />
                                    <rect x="35.75" y="9.75" width="3.25" height="3.25" />
                                    <rect x="9.75" y="9.75" width="3.25" height="3.25" />
                                    <rect x="22.75" y="48.75" width="3.25" height="3.25" />
                                    <rect x="48.75" y="9.75" width="3.25" height="3.25" />
                                    <rect x="29.25" y="45.5" width="3.25" height="3.25" />
                                    <rect x="42.25" y="19.5" width="3.25" height="3.25" />
                                    <rect x="42.25" y="6.5" width="3.25" height="3.25" />
                                    <rect x="16.25" y="6.5" width="3.25" height="3.25" />
                                    <rect x="3.25" y="26" width="3.25" height="3.25" />
                                    <rect x="42.25" width="3.25" height="3.25" />
                                    <rect x="16.25" y="26" width="3.25" height="3.25" />
                                    <rect x="16.25" width="3.25" height="3.25" />
                                    <rect x="42.25" y="39" width="3.25" height="3.25" />
                                    <rect x="42.25" y="13" width="3.25" height="3.25" />
                                    <rect x="16.25" y="13" width="3.25" height="3.25" />
                                    <rect x="35.75" y="45.5" width="3.25" height="3.25" />
                                    <rect x="35.75" y="6.5" width="3.25" height="3.25" />
                                    <rect x="9.75" y="32.5" width="3.25" height="3.25" />
                                    <rect x="9.75" y="6.5" width="3.25" height="3.25" />
                                    <rect x="48.75" y="6.5" width="3.25" height="3.25" />
                                    <rect x="22.75" y="6.5" width="3.25" height="3.25" />
                                    <rect x="35.75" width="3.25" height="3.25" />
                                    <rect x="9.75" width="3.25" height="3.25" />
                                    <rect x="35.75" y="39" width="3.25" height="3.25" />
                                    <rect x="35.75" y="13" width="3.25" height="3.25" />
                                    <rect x="9.75" y="39" width="3.25" height="3.25" />
                                    <rect x="9.75" y="13" width="3.25" height="3.25" />
                                    <rect x="48.75" y="13" width="3.25" height="3.25" />
                                    <rect x="22.75" y="39" width="3.25" height="3.25" />
                                    <rect x="3.25" y="3.25" width="3.25" height="3.25" />
                                </g>
                            </svg>
                        </div>

                        <div className="retro-message-text">
                            {message || "Task Successful"}
                        </div>
                    </div>

                    {/* THE WIN95 CHUNKY BUTTONS */}
                    <div className="retro-actions">
                        <button className="win95-btn" onClick={onClose}>
                            OK
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );

}