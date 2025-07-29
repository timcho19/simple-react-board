import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BoardList from './components/BoardList';
import Write from './components/Write';
import View from './components/View';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [boardId, setBoardId] = useState(0);
  const [redirectWrite, setRedirectWrite] = useState(false);

  const setmodify = (id)=>{
    setIsModifyMode(true);
    setBoardId(id);
    setRedirectWrite(true);//페이지 이동하겠다, 변수 true 변경
  }
  const setReset = ()=>{
    setIsModifyMode(false);
  }
  useEffect(()=>{
    if(redirectWrite) setRedirectWrite(false);
    //글쓰기 페이지 이동후, 글쓰기 페이지 이동 변수의 false 변경
  },[redirectWrite]);

  return (
    <div className="container">
      <h1>React Board</h1>   
      {
        redirectWrite && <Navigate to="/write" />
      } 
      <Routes>
        <Route path="/" element={<BoardList setmodify={setmodify}/>} />
        <Route path="/write" element={<Write isModifyMode={isModifyMode} boardId={boardId} setReset={setReset}/>} />
        <Route path="/view/:id" element={<View/>} />
      </Routes>     
    </div>
  );
}

export default App;
