import { useEffect, useRef } from "react";
import "./GolfGulf.css";
import { Engine, Render, Bodies, World } from "matter-js";
import { GolfGulfCoords } from "../constants/GolfGulfCoords";

function GolfGulf(props) {
  const scene = useRef();
  const engine = useRef(Engine.create());
  const currentCourse = GolfGulfCoords[props.roomInfo.gameInfo.course];

  useEffect(() => {
    // mount
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;

    var select = function (root, selector) {
      return Array.prototype.slice.call(root.querySelectorAll(selector));
    };

    var loadSvg = function (url) {
      console.log(fetch("./course0.svg"))
      return fetch(url)
        .then(function (response) {
          return response.text();
        })
        .then(function (raw) {
          return new window.DOMParser().parseFromString(raw, "image/svg+xml");
        });
    };

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
      },
    });

    // boundaries
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
    ]);

    loadSvg("./course0.svg").then(function (root) {
      console.log(root);
      var paths = select(root, "path");

      var vertexSets = paths.map(function (path) {
        return Svg.pathToVertices(path, 30);
      });

      var terrain = Bodies.fromVertices(
        400,
        350,
        vertexSets,
        {
          isStatic: true,
          render: {
            fillStyle: "#060a19",
            strokeStyle: "#060a19",
            lineWidth: 1,
          },
        },
        true
      );

      Composite.add(world, terrain);

      var bodyOptions = {
        frictionAir: 0,
        friction: 0.0001,
        restitution: 0.6,
      };

      Composite.add(
        world,
        Composites.stack(80, 100, 20, 20, 10, 10, function (x, y) {
          if (Query.point([terrain], { x: x, y: y }).length === 0) {
            return Bodies.polygon(x, y, 5, 12, bodyOptions);
          }
        })
      );
    });

    const generatedBodies = [];

    // create player bodies
    for (let i = 0; i < 0; i++) {}

    //create hole and flag
    generatedBodies.push(
      Bodies.rectangle(currentCourse.hole.x, currentCourse.hole.y, 50, 50, {
        isStatic: true,
      })
    );

    // add the generatedBodies
    World.add(engine.current.world, generatedBodies);

    // run the engine
    // Render.run(engine.current)
    Render.run(render);

    // unmount
    return () => {
      // destroy Matter
      Render.stop(render);
      World.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  const isPressed = useRef(false);

  const handleMouseDown = () => {
    isPressed.current = true;
  };

  const handleMouseUp = () => {
    isPressed.current = false;
  };

  const handleMouseMove = (e) => {};

  return (
    <div
      style={{ backgroundColor: "#00622D" }}
      className="inner-game-container"
    >
      <div
        style={{ width: "1600px", height: "800px" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div
          ref={scene}
          style={{ width: "100%", height: "100%", backgroundColor: "#87CEEB" }}
        ></div>
      </div>
    </div>
  );
}

export default GolfGulf;
