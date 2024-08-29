import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import {Level} from './Level.jsx'
import { Physics } from '@react-three/rapier'
import Player from './Player.jsx'
import UseGame from './stores/UseGame.jsx'

export default function Experience()
{

    const blocksCount = UseGame((state) => state.blocksCount)
    const blocksSeed = UseGame((state) => state.blocksSeed)

    return <>
    <color attach="background" args={["#bdedfc"]} />
        <OrbitControls makeDefault />
<Physics debug={false}>

        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />

</Physics>



    </>
}