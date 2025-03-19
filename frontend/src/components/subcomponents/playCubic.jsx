import { OrbitControls } from "@react-three/drei"
import CubicRob from "./CubicRob"
import { Canvas } from "@react-three/fiber"

const PlayCubic = () => {
    return (
        <>
            <Canvas className="bg-transparent h-[500px] w-[500px]"
                camera={{ position: [0, 2, 5], fov: 50 }}>
                <ambientLight />
                <CubicRob />
            </Canvas>
        </>
    )
}

export default PlayCubic
