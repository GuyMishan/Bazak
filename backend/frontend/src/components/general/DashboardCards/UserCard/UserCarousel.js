import React, { useState } from "react";

import {
  Carousel,
  CarouselIndicators,
  CarouselItem,
  CarouselCaption,
  CarouselControl,
  UncontrolledCarousel
} from "reactstrap";

import tenepic1 from "assets/img/tenepic1.jpg";
import tenepic2 from "assets/img/tenepic2.jpg";
import tenepic3 from "assets/img/tenepic3.jpg";
import tenepic4 from "assets/img/tenepic4.JPG";
import tenepic5 from "assets/img/tenepic5.JPG";
import tenepic6 from "assets/img/tenepic6.JPG";
import tenepic7 from "assets/img/tenepic7.JPG";
import tenepic8 from "assets/img/tenepic8.JPG";

const UserCarousel = (props) => {
  return (
    <UncontrolledCarousel
    interval='10000'
    items={[
      {
        altText: 'Slide 1',
        key: 1,
        src: tenepic1
      },
      {
        altText: 'Slide 2',
        key: 2,
        src: tenepic2
      },
      {
        altText: 'Slide 3',
        key: 3,
        src: tenepic3
      },
      {
        altText: 'Slide 4',
        key: 4,
        src: tenepic4
      },
      {
        altText: 'Slide 5',
        key: 5,
        src: tenepic5
      },
      {
        altText: 'Slide 6',
        key: 6,
        src: tenepic6
      },
      {
        altText: 'Slide 7',
        key: 7,
        src: tenepic7
      },
      {
        altText: 'Slide 8',
        key: 8,
        src: tenepic8
      }
    ]}
   />
  );
};

export default UserCarousel;