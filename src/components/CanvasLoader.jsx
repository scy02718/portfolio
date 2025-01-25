import { Html, useProgress } from '@react-three/drei'

const CanvasLoader = () => {
    // useProgress is a hook that returns the progress of the loading process of the 3D model
    // It returns the progress, total and loaded
    const { progress } = useProgress()

    // This is inside a <Canvas> tag, meaning you cannot write JSX here
    // You can only write HTML tags
    // as='div' = The HTML tag is a div
    // center = The content is centered
    // flexbox is used to center the content
    // The content is a span with a class of canvas-loader
    // The content is a paragraph with a font size of 14, color of #F1F1F1, font weight of 800 and margin top of 40
    // The content is the progress percentage if the progress is not 0, else it shows 'Loading...'
    return (
        <Html 
            as='div'
            center
            style= {{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                <span className='canvas-loader'/>
                <p style={{ fontSize: 14, color: "#F1F1F1", fontWeight: 800, marginTop: 40 }}>
                    {progress !==0 ? `${progress.toFixed(2)}%` : 'Loading...'}
                </p>
        </Html>
    )
}

export default CanvasLoader