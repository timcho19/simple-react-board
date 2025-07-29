import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

const Board = ({id, title, registerid, date, onCheckboxChange})=>{
  return(
    <tr>
      <td>
        <Form.Check // prettier-ignore
          type="checkbox"
          id={`default-${id}`}
          onChange={(e)=>{
            onCheckboxChange(id, e.target.checked)
          }}
        />
      </td>
      <td>{id}</td>
      <td><Link to={`/view/${id}`}>{title}</Link></td>
      <td>{registerid}</td>
      <td>{date}</td>
    </tr>
  )
}

const BoardList = ({setmodify})=>{
  const [boardList, setBoardList]= useState([]);
  const [checkList, setChecklist] = useState([]);

  const getList = useCallback(()=>{
    axios.get('http://localhost:8000/list')
    .then( (res)=> {
      // 성공 핸들링
      console.log(res.data);
      setBoardList(res.data);
    })
    .catch((error)=> {
      // 에러 핸들링
      console.log(error);
    });
  },[]);

  useEffect(()=>{
    getList();
  },[getList]) //최초 한번, getList 변동시 함수 재실행

  const onCheckboxChange = (id, checked)=>{
    console.log(id, checked);
    setChecklist(prev=>checked? [...prev,id] : prev.filter(p=>p !== id));
  }
  console.log(checkList);

  const handleModify = ()=>{
    if(checkList.length === 0){
      alert('최소 하나의 게시글을 선택해주세요');
    }else if(checkList.length > 1){
      alert('수정할 하나의 게시글만 선택해주세요');
    } else{
      setmodify(checkList[0]);
    }
  }
  const handleDelete = ()=>{
    if(checkList.length === 0){
      alert('삭제할 게시글을 선택해주세요');
      return;
    }
    let boardIDList = checkList.join(); //[1,2,3]->1,2,3

    axios.post('http://localhost:8000/delete',{boardIDList})
    .then( (res)=> {
      // 성공 핸들링
      alert('삭제 완료');
      getList();
    })
    .catch((error)=> {
      // 에러 핸들링
      console.log(error);
    });
  }

  return(
    <>
      <Table bordered hover>
        <thead>
          <tr>
            <th>선택</th>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {
            boardList.map((item)=> <Board 
              key={item.BOARD_ID}  
              id={item.BOARD_ID} 
              title={item.BOARD_TITLE} 
              registerid={item.REGISTER_ID} 
              date={item.REGISTER_DATE} 
              onCheckboxChange={onCheckboxChange}
            />)
          }          
        </tbody>
      </Table>
      <div className='d-flex justify-content-end gap-1'>
        <Link to="/write" className='btn btn-primary'>글쓰기</Link>
        <Button variant="secondary" size="sm" onClick={handleModify}>수정</Button>
        <Button variant="danger" size="sm" onClick={handleDelete}>삭제</Button>
      </div>
    </>
  )
}
export default BoardList;