import '@kitware/vtk.js/favicon';
import { useState, useRef, useEffect } from 'react';

import { vec3, quat, mat4 } from 'gl-matrix';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import '@kitware/vtk.js/Rendering/Profiles/Volume';
import '@kitware/vtk.js/Rendering/Profiles/Glyph';

// Force DataAccessHelper to have access to various data source
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkImageMarchingCubes from '@kitware/vtk.js/Filters/General/ImageMarchingCubes';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import vtkImageCroppingWidget from '@kitware/vtk.js/Widgets/Widgets3D/ImageCroppingWidget';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkPiecewiseGaussianWidget from '@kitware/vtk.js/Interaction/Widgets/PiecewiseGaussianWidget';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';

let SurfaceRendering = ({link}) => {
  const vtkContainerRef = useRef(null);
  const [IsoValue , setIso] = useState(140);
  
  useEffect(() => {
    
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      rootContainer: vtkContainerRef.current,
    });
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();
      
      const marchingCube = vtkImageMarchingCubes.newInstance({
        contourValue: 0.0,
        computeNormals: true,
        mergePoints: true,
      });
      const mapper = vtkMapper.newInstance();
      const actor = vtkActor.newInstance();

      actor.setMapper(mapper);
      mapper.setInputConnection(marchingCube.getOutputPort());

      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();
      const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });
      marchingCube.setInputConnection(reader.getOutputPort());
      reader
        .setUrl(link, { loadData: true })
        .then(() => reader.loadData)
        .then(() => {
          const data = reader.getOutputData();
          const dataRange = data.getPointData().getScalars().getRange();
          const firstIsoValue = (dataRange[0] + dataRange[1]) / IsoValue;

          marchingCube.setContourValue(firstIsoValue);
          renderer.addActor(actor);
          renderer.getActiveCamera().set({ position: [1, 1, 0], viewUp: [0, 0, -1] });
          renderer.resetCamera();
          renderWindow.render();
      });
  }, [vtkContainerRef,IsoValue , link]);

  return (
    <div>
      <div ref={vtkContainerRef} />
      <table style={{
          position: 'absolute',
          top: '25px',
          left: '25px',
          background: 'black',
          color: 'white',
          padding: '12px',
          borderRadius: '5px',
      }}>
        <tbody>
          <tr>
            <td>iso-value</td>
            <td>
              <input
                type="range"
                min="0"
                max="8"
                step ="0.1"
                value = {IsoValue}
                onChange={e=>{setIso(Number(e.target.value))}}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>    
  );
}
export default SurfaceRendering
