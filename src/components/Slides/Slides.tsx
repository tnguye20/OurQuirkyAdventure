import * as React from 'react';
import { Memory, Category } from '../../interfaces';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

import './Slides.css';

import {
    useMemoryValue
} from '../../contexts';

export const Slides: React.FC = () => {
    const elements = React.useRef<Element[]>([]);
    const [interval, setInterval] = React.useState<number>(5000);
    const { memories } = useMemoryValue();

    React.useEffect(() => {
        let els = Array.from(document.querySelectorAll('.carousel-item > img,video'));
        elements.current = els;
        console.log(elements.current);
    });

    const handleOnSlide = (eventKey: number, direction: "left" | "right") => {
        if (elements.current.length > 0) {
            const element = elements.current[eventKey];
            if (element.nodeName === 'VIDEO') {
                const video: HTMLVideoElement = element as HTMLVideoElement;
                video.pause();
                video.currentTime = 0;
                video.play();
                const duration = (video.duration) * 1000;
                setInterval(duration);
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