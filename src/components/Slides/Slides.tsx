import * as React from 'react';
import { Memory, Category } from '../../interfaces';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import './Slides.css';

import {
    useMemoryValue
} from '../../contexts';

export const Slides: React.FC = () => {
    const elements = React.useRef<Element[]>([]);
    const [interval, setInterval] = React.useState<number>(5000);
    const { memories } = useMemoryValue();

    React.useEffect(() => {
        if (memories.length > 0) {
            let els = Array.from(document.querySelectorAll('.carousel-item > img,video'));
            console.log('els', els);
            if (els.length !== elements.current.length ) {
                elements.current = els;
            }
        }
    }, [memories]);

    const handleOnSlide = (eventKey: number, direction: "left" | "right") => {
        if (elements.current.length > 0) {
            const element = elements.current[eventKey];
            if (element.nodeName === 'VIDEO') {
                const video: HTMLVideoElement = element as HTMLVideoElement;
                try {
                    video.pause();
                    video.currentTime = 0;
                    video.play();
                    const duration = (video.duration) * 1000;
                    setInterval(duration);
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                setInterval(5000);
            }
        }
    }

    return (
        <div className='slideContainer'>
            <Carousel
                indicators={false}
                interval={interval}
                onSlide={handleOnSlide}
                fade={true}
            >
                {
                    memories
                    .map((memory: Memory, index) => {
                        if (memory.category === 'video') {
                            return (
                                <Carousel.Item key={index}>
                                    <video
                                        // controls
                                        src={memory.url}
                                        muted
                                        autoPlay
                                        playsInline
                                        preload="metadata"
                                    />
                                    <Carousel.Caption>
                                        <p className='slideCaption'>{memory.title}</p>
                                    </Carousel.Caption>
                                </Carousel.Item> 
                            );
                        }
                        return (
                            <Carousel.Item key={index}>
                                <img src={memory.url} />
                                <Carousel.Caption>
                                    <p className='slideCaption'>{memory.title}</p>
                                </Carousel.Caption>
                            </Carousel.Item> 
                        );
                    })
                }
            </Carousel>
        </div>
    )
};