import { useEffect, useRef } from "react";
import "./RENAME.css";
import { Engine } from 'matter-js';

function RENAME(props) {
  const scene = useRef()
  const engine = useRef(Engine.create())

  useEffect(() => {
    // mount
    const cw = document.body.clientWidth
    const ch = document.body.clientHeight
  
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent'
      }
    })
      
    // boundaries
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
    ])
      
    // run the engine
    Engine.run(engine.current)
    Render.run(render)
  
    // unmount
    return () => {
      // destroy Matter
      Render.stop(render)
      World.clear(engine.current.world)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [])

  const isPressed = useRef(false)

  const handleMouseDown = () => {
    isPressed.current = true;
  }
  
  const handleMouseUp = () => {
    isPressed.current = false;
  }
  
  const handleMouseMove = e => {

  }

  return (
    <div className="inner-game-container">
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
       <div ref={scene} style={{ width: '100%', height: '100%' }}></div> 
      </div>
    </div>
  );
}

export default RENAME;
