import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const Write = ({isModifyMode, boardId, setReset})=>{
  let navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    return () => {
      // 이 페이지에서 떠날 때만 실행됨 (뒤로가기, 앞으로가기 포함)
      setClear();
    };
  }, [location.pathname]); // location.pathname이 바뀔 때 실행됨
  

  const [inputs, setInputs] = useState({
    title:'',
    content:'',
    image:null
  });

  const inputHandler = (e)=>{ //title
    const {name, value} = e.target
    setInputs(prev=>({
      ...prev,
      [name]:value
    }))
  }
  const inputImageHandler = (e)=>{ //title
    const file = e.target.files[0]
    console.log(file);
    setInputs(prev=>({
      ...prev,
      image:file
    }))
  }
  const setClear = ()=>{
    setInputs({  title:'', content:''});
    setReset();
    navigate('/');
  } 

  const write = ()=>{  
    const formData = new FormData();

    formData.append('title',inputs.title);
    formData.append('content',inputs.content);
    if(inputs.image){
      formData.append('image',inputs.image);
    }
    axios.post('http://localhost:8000/insert',formData,{
      header:{'Content-Type':'multipart/form-data'}
    })
    .then( (res)=> {
      // 성공 핸들링
      alert('등록 완료');      
      setClear();
    })
    .catch((error)=> {
      // 에러 핸들링
      console.log(error);
    });
  };
  const modify = ()=>{
    axios.post('http://localhost:8000/modify',{
      id:boardId, 
      title:inputs.title,
      content:inputs.content
    })
    .then( (res)=> {
      // 성공 핸들링
      alert('수정완료');
      setClear();
      //setInputs({id:null, title:'', content:''});
    })
    .catch((error)=> {
      // 에러 핸들링
      console.log(error);
    });
  };
  const details = ()=>{
    axios.get(`http://localhost:8000/detail?id=${boardId}`)
    .then( (res)=> {
      // 성공 핸들링
      console.log(res.data);
      setInputs(prev=>({
        ...prev,
        title:res.data[0].BOARD_TITLE,
        content:res.data[0].BOARD_CONTENT
      }))
    })
    .catch((error)=> {
      // 에러 핸들링
      console.log(error);
    });
  }

  useEffect(()=>{
    if(isModifyMode && boardId){
      details();
    }
  },[isModifyMode, boardId]);

  return(
    <Form>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>제목</Form.Label>
        <Form.Control type="text" value={inputs.title} name="title" onChange={inputHandler} placeholder="제목을 입력하세요" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="content">
        <Form.Label>내용</Form.Label>
        <Form.Control as="textarea" value={inputs.content} name="content" onChange={inputHandler} rows={3} />
      </Form.Group>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>이미지 첨부</Form.Label>
        <Form.Control type="file" onChange={inputImageHandler} />
      </Form.Group>      
      <div className='d-flex justify-content-end gap-1'>
        <Button variant="primary" size="sm" onClick={isModifyMode? modify:write}>
          {isModifyMode? '수정':'입력'}
        </Button>
        <Button variant="secondary" size="sm" onClick={setClear}>
        취소
        </Button>      
      </div>       
    </Form>
  )
}
export default Write;