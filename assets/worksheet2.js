const RenderWrap = (data) => {
  
  const changeList = (title) => {
    let reuturnList = null;
    if(title == '전체' || location.hash.split('#')[1] == '전체') {
      reuturnList = [];
      data.props.items.forEach(_this=>{
        reuturnList = reuturnList.concat(_this.list);
      });
    } else {
      data.props.items.forEach(_this=>{
        if(location.hash && _this.title === location.hash.split('#')[1]) {
          reuturnList = _this.list;
        } else if (_this.title === title) {
          reuturnList = _this.list;
        }
      });
    }
    return reuturnList;
  }
  const [itemList, setItemList] = React.useState(changeList('전체'));
  const [currentCate, setCurrentCate] = React.useState('전체');
  const [showUpdate, setShowUpdate] = React.useState({state: false, arry: null});
  const [showIfr, setShowSetIfr] = React.useState({state: false, url: null});
  const [deviceState] = React.useState(
    (navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i))
    ? false
    : true
  );
  const detailsRef = React.useRef([]);
  
  const setList = str => {
    location.hash = str;
    setItemList(changeList(str))
    setCurrentCate(str);
  }
  const funUpdate = React.useCallback(arg => {
    setShowUpdate({state: arg.state, arry: arg.arry});
  },[]);
  const funHideUpdate = () => {
    setShowUpdate({state: false, arry: null});
  }
  const funIfr = React.useCallback(url => {
    if(url) {
      setShowSetIfr({state: true, url: url});
    } else {
      setShowSetIfr({state: false})
    }
  },[]);
  const searchItem = result => {
    if(result.length) {
      setItemList(result);
    } else {
      setItemList(changeList('전체'));
    }
  }
  return (
    <div className={(deviceState == true) ? '' : 'mo'}>
      <header>
        <div className="cont_area">
          <h1>Thessen Publishing</h1>
        </div>
      </header>
      <RenderSearch
        itemList={data}
        currrentCate={currentCate}
        currentList={itemList}
        emitChageList={setList}
        emitInput={searchItem}
        details={detailsRef}
      />
      {itemList.map((items, idx) => (
        <RenderSheet 
          items={items}
          emitUpdate={funUpdate}
          emitIfr={funIfr}
          key={items.title+idx}
          ref={el => detailsRef.current[idx] = el}
        />
      ))}
      {
        (showUpdate.state == true)
        ? <RenderUpdate 
            prop={showUpdate.arry}
            emitUpdate={funHideUpdate}
          />
        : null
      }
      {
        (deviceState == true && showIfr.state == true)
        ? <RenderIfr 
            src={showIfr}
          />
        : null
      }
    </div>
  )
}

const RenderSearch = React.memo(({itemList, currrentCate, currentList, emitChageList, emitInput, details}) => {
  const inputTxt = React.useRef();
  const selCate = React.useRef();
  const [cate, setCurrentCate] = React.useState(currrentCate);
  
  React.useEffect(()=>{
    setCurrentCate(currrentCate);
  },[currrentCate]);

  const setInputList = e => {
    let resultItem = [];
    currentList.map(el=>{
      let resultObj = {}
      let rArry = [];
      el.list.map(item=>{
        for(let prop in item) {
          if(typeof item[prop] === 'string' && item[prop].match(e.target.value)) {
            rArry.push(item);
          }
        }
      });
      if(e.target.value.length && rArry.length) {
        resultObj["title"] = el.title;
        resultObj["list"] = rArry;
        resultItem.push(resultObj);
      }
    });
    emitInput(resultItem);
  }
  const changeList = (str) => {
    selCate.current.classList.remove('isShow');
    emitChageList(str)
    inputTxt.current.value = '';
  }
  const listShow = () => {
    selCate.current.classList.toggle('isShow');
  }
  const handleOpenAll = () => {
    details.current.forEach(e => e.open = true)
  }
  const handleCloseAll = () => {
    details.current.forEach(e => e.open = false)
  }
  return (
    <nav className="sheet-nav">
      <div className="nav-cate" ref={selCate}>
        <button className="btn" onClick={()=>{listShow()}}>{cate}</button>
        <div className="list">
          <button onClick={()=>changeList('전체')}>전체</button>
          {itemList.props.items.map(item => (
            <button onClick={()=>changeList(item.title)}>
              {(item.title)}
            </button>
          ))}
        </div>
      </div>
      <div className="search">
        <input type="text" placeholder="검색" onKeyUp={setInputList} ref={inputTxt} />
        <button type="button" onClick={()=>{inputTxt.current.value = '';}}>내용 삭제</button>
      </div>
      <button type="button" class="btn-acc open" onClick={handleOpenAll}>모두 펼치기</button>
      <button type="button" class="btn-acc close" onClick={handleCloseAll}>모두 닫기</button>
    </nav>
  )
})
const RenderSheet = React.forwardRef(({items, emitUpdate, emitIfr}, ref) => {
  return (
    <details className="item" ref={ref}>
      <summary className="item-title">{items.title}</summary>
      <div className="cont">
        <table>
          <colgroup>
            <col style={{width:15 + "%"}}/>
            <col style={{width:12 + "%"}}/>
            <col style={{width:12 + "%"}}/>
            <col style={{width:25 + "%"}}/>
            <col style={{width:8 + "%"}}/>
            <col style={{width:8 + "%"}}/>
            <col/>
          </colgroup>
          <thead>
            <tr>
              <th scope="col">1 Dep</th>
              <th scope="col">2 Dep</th>
              <th scope="col">3 Dep</th>
              <th scope="col">URL</th>
              <th scope="col">완료일</th>
              <th scope="col">수정일</th>
              <th scope="col">비고</th>
            </tr>
          </thead>
          <tbody>
            {items.list.map((item,idx) => (
              <RenderList
                title={items.title}
                subList={item}
                emitUpdate={emitUpdate}
                emitIfr={emitIfr}
                key={items.title+idx}
              />
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
})

const RenderList = React.memo(({title, subList, emitUpdate, emitIfr}) => {
  const qrSet = (url) => {
    if(window.location.href.match('minwise.synology.me')) {
      const split = url.split('./');
      let returnUrl;
      if(window.location.href.match('/event/')) {
        if(title === '홈페이지') {
          returnUrl = split[1];
        } else {
          returnUrl = `event/${split[1]}`;
        }
      } else if(window.location.href.match('/homepage/')) {
        if(title !== '홈페이지') {
          returnUrl = split[1];
        } else {
          returnUrl = `homepage/${split[1]}`;
        }
      }
      url = `https://minwise.synology.me:1080/ssen/${returnUrl}`;
    }
    return 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl='+url+'&choe=UTF-8';
  }
  const returnUrl = (url) =>{
    if(window.location.href.match('/homepage/')) {
      if(title !== '홈페이지') {
        return '../event' + url;
      } else {
        return '.' + url;
      }
    } else if(window.location.href.match('/event/')) {
      if(title === '홈페이지') {
        return '../homepage' + url;
      } else {
        return '.' + url;
      }
    } else {
      if(title === '홈페이지') {
        return './homepage' + url;
      } else {
        return './event' + url;
      }
    }
  }
  const returnBr = (str) =>{
    let val;
    if(str) val = str.split('\n').map( line => {
      return (<>{line}<br/></>)
    })
    return val;
  }
  return (
    <tr onMouseEnter={()=>{emitIfr(returnUrl(subList.url))}}>
      <td>{returnBr(subList.dep1)}</td>
      <td>{returnBr(subList.dep2)}</td>
      <td>{returnBr(subList.dep3)}</td>
      <td className="url">
        <a href={returnUrl(subList.url)} target="_blank">{returnUrl(subList.url)}</a>
        <div className="qrBox">
          <img src={qrSet(returnUrl(subList.url))} />
        </div>
      </td>
      <td className="status">{subList.status}</td>
      <td className="modify">
        {
          (subList.update) 
          ? <button
              onClick={()=> emitUpdate({
                state: true,
                arry : {
                  "dep1" : subList.dep1,
                  "dep2" : subList.dep2,
                  "dep3" : subList.dep3,
                  "cont": subList.update
                }
              })}
            >{subList.update[0].date}</button> 
          : null
        }
      </td>
      <td className={"etc"}>{subList.etc}</td>
    </tr>
  )
})

const RenderUpdate = React.memo(({prop, emitUpdate}) => {
  const [hideState, setHideState] = React.useState(false);
  const setUpdate = () => {
    if(hideState) emitUpdate({state: false})
  }
  return (
    <div className={hideState ? "ly-modify modify-out" : "ly-modify"} onAnimationEnd={setUpdate}>
      <div className={"ly-modify-wrap"}>
        <div className={"ly-modify-title"}>
          {prop.dep1 ? <em>{prop.dep1}</em> : ''}
          {prop.dep2 ? <em>{prop.dep2}</em> : ''}
          {prop.dep3 ? <em>{prop.dep3}</em> : ''}
          <button type="button" onClick={()=>{setHideState(true)}}></button>
        </div>
        <dl>
          {prop.cont.map(item => {
            return(
              <>
                <dt>{item.date}</dt>
                <dd>{item.txt}</dd>
              </>
            )
          })}
        </dl>
      </div>
    </div>
  )
})

const RenderIfr = React.memo((prop) => {
  const ifr = React.useRef();
  const ifrShow = () => {
    ifr.current.hidden = false;
    ifr.current.querySelector('iframe').addEventListener('load', ()=>{
      ifr.current.querySelector('iframe').contentWindow.document.body.insertAdjacentHTML('beforeend', '<style>*::-webkit-scrollbar {display: none;}</style>');
    });
  }
  const ifrHide = () => {
    ifr.current.hidden = true;
  }
  React.useEffect(()=>{
    ifrShow();
  },[prop]);
  return (
    <div
      ref={ifr}
      style={{
        position:'fixed',
        top: '67px',
        right: '0',
        bottom: '0',
        width: '360px',
        background: '#fff',
        zIndex: '10'
      }}
      onMouseLeave={()=>{ifrHide()}}
    >
      <div
        className="trigger"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '-8px',
          width: '8px',
          background: '#333',
          cursor: 'col-resize'
        }}
      ></div>
      <iframe
        src={prop.src.url}
        style={{width: '100%', height: '100%', border: 'none'}}
      />
    </div>
  )
})
