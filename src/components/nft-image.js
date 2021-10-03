import {useEffect, useRef, useState} from "react";

const resizeCanvasToDisplaySize = canvas => {

    const { width, height } = canvas.getBoundingClientRect()

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        return true
    }

    return false
}

const NftImage = ({contractAddress, tokenId, ...props}) => {
    const canvasRef = useRef()
    const [image] = useState(new Image())

    useEffect(() => {
        image.src = `https://www.larvalabs.com/public/images/cryptopunks/punk${tokenId}.png`
        image.onload = () => {
            const canvas = canvasRef.current

            const { width: canvasX, height: canvasY } = canvas.getBoundingClientRect()
            console.log('canvas size:', canvasX, canvasY)


            const context = canvas.getContext('2d')

            const {width: imageX, height: imageY} = image

            console.log('image size:', imageX, imageY)

            console.log('scales:', canvasX / imageX, canvasY /imageY)

            const scale = Math.min(canvasX / imageX, canvasY / imageY)
            const targetX = scale * imageX
            const targetY = scale * imageY

            console.log('target size:', targetX, targetY)

            context.mozImageSmoothingEnabled = false
            context.webkitImageSmoothingEnabled = false
            context.msImageSmoothingEnabled = false
            context.imageSmoothingEnabled = false

            context.drawImage(image, 0, 0, targetX, targetY)
        }
    }, [contractAddress, tokenId])

    return <canvas ref={canvasRef} {...props}></canvas>
}

export default NftImage