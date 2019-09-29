# :tree: The generative Forest :snow:

<img src='./src/assets/pres.gif'>

This generative WebGl experiment was done for education purposes at Gobelins' School in paris.
The Generative Forest was made during an html canvas and WebAudioAPI workshop.
The Goal was to achieve an interactive/immersive scene and interact with object to generate sound.

## Creative process
The main core of this experiment was built with Three.js a Javascript 3d library based on WebGL.
Their are Two main model categories in this scene. The trees and the mushrooms. 3 different versions of those were conceptualized in Cinema 4d, then exported in fbx. 

The floor is a basic plane with three.js' Phong shader to accept the trees and mushroom shadows.
The snow was made with a plane but slitely lower than the first one, with homemade vertex and fragment shaders. A noise was aplied to displace the white plane to give that piled snow effect.

The hat of the shrooms were assigned to a Basic THREE shader and their "Whitness" was attached to the distance between the camera and the shroom itself. That is at =the 

## <a href="https://www.mariusballot.com/lab/generativeForest/"> Link To Experiment</a>