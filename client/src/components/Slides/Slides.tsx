import * as React from 'react';
import { Memory, Category } from '../../interfaces';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

import './Slides.css';

import {
    useMemoryValue
} from '../../contexts';

export const Slides: React.FC = () => {
    // const elements = React.useRef<Element[]>([]);
    const [interval, setInterval] = React.useState<number>(5000);
    const { memories } = useMemoryValue();

    const handleInterval = (i: number) => {
        if (i !== interval) {
            setInterval(i);
        }
    };

    const loadElement = (index: number, withInterval: boolean = false) => {
        const el = document.querySelector(`#item_${index}`) as HTMLElement;
        if (el) {
            const { src, type } = el.dataset;
            if (src && type) {
                if (type === Category.video) {
                    const video = document.createElement('video');
                    video.setAttribute('src', src);
                    video.dataset.type = type;
                    video.autoplay = true;
                    video.preload = "metadata";
                    video.loop = false;
                    video.muted = true;
                    video.classList.add(`loaded_slide_${index}`);
                    video.setAttribute("muted", "");
                    video.setAttribute("playsinline", '');
                    video.onloadedmetadata = () => {
                        const duration = (video.duration) * 1000;
                        try {
                            video.pause();
                            video.currentTime = 0;
                            video.play();
                            const duration = (video.duration) * 1000;

                            if (withInterval) handleInterval(duration);
                        }
                        catch (error) {
                            console.log(error);
                            if (withInterval) handleInterval(5000);
                        }
                    }

                    const container = document.querySelector(`#container_${index}`)!;
                    container.appendChild(video);
                }
                else {
                    const image = document.createElement('img');
                    image.setAttribute('src', src);
                    image.dataset.type = type;
                    image.classList.add(`loaded_slide_${index}`);
                    const container = document.querySelector(`#container_${index}`)!;
                    container.appendChild(image);

                    if (withInterval) handleInterval(5000);
                }
            }
        }
    }

    const loadIfNeeded = (index: number) => {
        const el = document.querySelector(`.loaded_slide_${index}`);
        if (el === null) {
            loadElement(index);
        }
    };
    
    const clearLoadedComponents = () => {
        const nodes = document.querySelectorAll(`[class^='loaded_slide_']`)
        nodes.forEach((node) => node.remove());
    }

    React.useEffect(() => {
        if (memories.length > 0) {
            clearLoadedComponents();

            loadIfNeeded(0);
            if (memories.length > 0) loadIfNeeded(1);
        }
    }, [memories]);

    const handleOnSlide = (eventKey: number, direction: "left" | "right") => {
        const el = document.querySelector(`.loaded_slide_${eventKey}`) as HTMLElement;
        if (el) {
            const { type } = el.dataset;
            if (type === Category.video) {
                try {
                    const video = el as HTMLVideoElement;
                    video.pause();
                    video.currentTime = 0;
                    video.play();
                    const duration = (video.duration) * 1000;
                    handleInterval(duration);
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                handleInterval(5000);
            }
        }
        else {
            loadElement(eventKey);
        }

        const nextIndex: number = eventKey + 1;
        const prevIndex: number = memories.length - 1 - eventKey;
        if (nextIndex < memories.length) {
            const nextEl = document.querySelector(`.loaded_slide_${nextIndex}`) as HTMLElement;
            if(!nextEl) loadElement(nextIndex);
        }
        // Maybe a bad decision
        if (prevIndex > 0) {
            const prevEl = document.querySelector(`.loaded_slide_${prevIndex}`) as HTMLElement;
            if(!prevEl) loadElement(prevIndex);
        }
}

    return (
        <div className='slideContainer'>
            <Carousel
                indicators={false}
                interval={interval}
                onSlide={handleOnSlide}
                fade={true}
                pause={false}
            >
                {
                    memories
                    .map((memory: Memory, index) => {
                        return (
                            <Carousel.Item key={index} id={`container_${index}`} className='slide_container'>
                                <div className='slide_item' id={`item_${index}`} data-src={memory.url} data-type={memory.category}></div>
                                <Carousel.Caption className='slideCaption'>
                                    <p><b>{memory.title}</b></p>
                                    <p className='subtext'>{memory.takenDate.toDate().toUTCString()}</p>
                                    {
                                        memory.latitude ? (
                                            <p className='subtext'>
                                                {`
                                                    ${memory.neighbourhood} 
                                                    ${memory.streetName}, 
                                                    ${memory.city}
                                                    ${memory.state}
                                                `}
                                            </p>
                                            ) : ""
                                        // }
                                    }

                                </Carousel.Caption>
                            </Carousel.Item> 
                        );
                    })
                }
            </Carousel>
        </div>
    )
};