import React from 'react'
import Lightbox from 'lightbox-react'
import 'lightbox-react/style.css'

const Gallery = ({images, opened, imageIndex, goToImage, onClose}) => images && opened &&
	<Lightbox
        mainSrc={images[imageIndex]}
        nextSrc={images[(imageIndex + 1) % images.length]}
        prevSrc={images[(imageIndex + images.length - 1) % images.length]}
        onCloseRequest={() => onClose()}
        onMovePrevRequest={() => goToImage((imageIndex + images.length - 1) % images.length)}
        onMoveNextRequest={() => goToImage((imageIndex + 1) % images.length)}
        />

export default Gallery
