import { useState, useRef, useEffect } from 'react';
import '@kitware/vtk.js/favicon';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import '@kitware/vtk.js/Rendering/Profiles/Volume';
import '@kitware/vtk.js/Rendering/Profiles/Glyph';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';
import SurfaceRendering from './SurfaceRendering';
import RayCasting from './RayCasting';
import VolumeCropping from './VolumeCropping';

const head = 'https://kitware.github.io/vtk-js/data/volume/headsq.vti';
const trunk = 'https://kitware.github.io/vtk-js/data/volume/LIDC2.vti';

function App() {

    const [page,setPage] = useState(0)
    const [pageLink,setPageLink]= useState('')
  
    return(
      <>
      {page==1?<SurfaceRendering link= {pageLink} />:null}
      {page==2?<RayCasting link={pageLink} />:null}
      {page==3?<VolumeCropping link={pageLink} />:null}
      <div class="main-btns">
        <div class="func">
          <button onClick= {e=>{setPage(1)}}>volume rendering</button>
          <button onClick= {e=>{setPage(3)}}>volume cropping</button>
          <button onClick= {e=>{setPage(2)}}>ray casting</button>
        </div>
        <div class="reader">
          <button onClick= {e=>{setPageLink(head)}}>head</button>
          <button onClick= {e=>{setPageLink(trunk)}}>trunk</button>
        </div>
      </div>
      </>
    )
  }
  export default App