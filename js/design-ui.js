/**
 * swiper 공통 적용 함수
 * @param {Object} arg {target : 슬라이더 랩, option: 슬라이더 옵션}
 * @returns swiper
 */
const slider = arg => {
  const wrap = (typeof arg.target === 'string') ? document.querySelector(arg.target) : arg.target;
  const itemLeng = wrap.querySelectorAll('.swiper-slide').length;
  const paging = (wrap.querySelector('.swiper-pagination')) ? wrap.querySelector('.swiper-pagination') : null;
  const btnNav = (wrap.querySelector('.swiper-button')) ? wrap.querySelector('.swiper-button') : null;
  const pagingNumber = (wrap.querySelector('.swiper-number')) ? wrap.querySelector('.swiper-number') : null;
  let pagingNumberItems = null
  const opt = (wrap.dataset.option) ? JSON.parse(wrap.dataset.option) : null;
  let result = {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    loop: true,
    speed: 1000,
  }
  if(opt && opt.auto) {
    const auto = {
      autoplay : {
        delay: opt.auto,
        disableOnInteraction: false,
      }
    }
    result = {...result, ...auto}
  }
  let swiper = null;
  if(paging) {
    const page = {
      pagination : {
        el : paging,
        clickable : true,
      }
    }
    result = {...result, ...page}
  }
  if(btnNav) {
    const nav = {
      navigation: {
        nextEl: btnNav.querySelector('.swiper-button-next'),
        prevEl: btnNav.querySelector('.swiper-button-prev'),
      }
    }
    result = {...result, ...nav}
  }
  if(pagingNumber) {
    for(let idx = 0; idx < itemLeng; idx++) {
      pagingNumber.insertAdjacentHTML('beforeend',`<span>${idx + 1}</span>`);
    }
    pagingNumberItems = pagingNumber.querySelectorAll('span');
    pagingNumberItems[0].classList.add('current')
    const optNum = {
      on : {
        slideChange() {
          pagingNumberItems.forEach(_this => {
            _this.classList.remove('current');
          });
          pagingNumberItems[this.realIndex].classList.add('current')
        }
      }
    }
    result = {...result, ...optNum}
  }
  if(arg.option) {
    result = {...result, ...arg.option}
  }
  if(itemLeng > 1) {
    return swiper = new Swiper(wrap, result);
  } else {
    if(btnNav) btnNav.remove();
    if(paging) paging.remove();
    if(pagingNumber) pagingNumber.remove();
    return false;
  }
}

/**
 * 로딩 활성/비활성 
 * @param {String} state start 로딩 시작, end 로딩 끝
 */
const funLoading = (state, type, str) => {
  const loadingEl = document.createElement('div');
  loadingEl.classList.add('ly-loading');
   if(type === 'type2') {
     loadingEl.classList.add('card-flip-wrap');
      if(str) {
      loadingEl.innerHTML = `
        <div class="card-flip"></div>
        <p class="txt">${str}</p>
      `;
    } else {
      loadingEl.innerHTML = `<div class="card-flip"></div>`
      ;
    }
  } else {
    loadingEl.innerHTML = '<div class="loading-circle"></div>';
  }
  if(state == 'start') {
    document.body.classList.add('isLoading');
    document.body.insertAdjacentElement('beforeend', loadingEl);
  } else if(state == 'end' && document.querySelector('.ly-loading')) {
    document.body.classList.remove('isLoading');
    document.querySelector('.ly-loading').remove();
  }
}


/**
 * 메시지 팝업
 * @param {Object} params {
 *  msg: 줄바꿈 == <br>,
 *  msg2: 줄바꿈 == <br>,
 *  type: 'confirm', //confirm 일 경우
 *  btn: {confirm: '선택', cancel: '삭제'}, // 기본 값은 확인, 취소
 *  onConfirm: 확인 버튼 누름
 *  onCancel: 취소 버튼 누름,
 *  customBtn: [
      {
        "name" : "버튼명",
        "type" : "btn-action",
        "func" : ()=>{
          alert('동물 등록 번호 조회');
        }
      },
      {
        "name" : "직접 정보 조회",
        "type" : "btn-action",
        "func" : ()=>{
          alert('직접 정보 조회');
        }
      }
    ]
 * }
 */
const layerMsg = (params) => {
  let btn = {
    confirm: "확인",
    cancel: "취소"
  }
  if(params.btn) btn = {...btn, ...params.btn};
  const createBtn = (obj) => {
    let btns = '';
    obj.forEach((_this, idx)=>{
      btns += `<button class="${_this.type+' '}base-btn" data-ref="btnFunc${idx}">${_this.name}</button>`;
    });
    return btns;
  }
  let layer = document.createElement('div');
  layer.classList.add("ly-pop", "ly-alert");
  layer.innerHTML = `
      <div class="wrap">
        ${
          (params.btnClose && params.btnClose === true) 
          ? `<button class="btn-close" data-ref="btnClose">닫기</button>`
          : ''
        }
        <div class="ly-content">
          <p class="ly-tit">${params.msg}</p>
          ${
            (params.msg2)
            ? `<p class="ly-con-txt">${params.msg2}</p>`
            : ''
          }
        </div>
        ${
          (params.customBtn) 
          ? `<div class="btn-wrap full">
              ${createBtn(params.customBtn)}
            </div>`
          : `<div class="btn-wrap">
              ${(params.type && params.type == 'confirm') ? `<button class="btn-basic" data-ref="btnCancel">${btn.cancel}</button>` : ''}
              <button class="btn-action" data-ref="btnConfirm">${btn.confirm}</button>
            </div>`
        }
      </div>
  `;
  const funcHide = () => {
    layer.classList.remove('show');
    layer.remove();
  }
  document.body.insertAdjacentElement('beforeend', layer);
  layer.style.display = 'block';
  layer.classList.add('show');
  if(params.customBtn) {
    const btns = layer.querySelectorAll('.base-btn');
    params.customBtn.forEach((obj, idx)=>{
      if(btns[idx].dataset.ref === `btnFunc${idx}`) {
        btns[idx].addEventListener('click', ()=>{
          obj.func();
          funcHide();
        });
      }
    })
  } else {
    layer.querySelector('[data-ref="btnConfirm"]').addEventListener('click',()=>{
      funcHide()
      if(params.onConfirm) params.onConfirm();
    });
    if(params.type && params.type == 'confirm') {
      layer.querySelector('[data-ref="btnCancel"]').addEventListener('click',()=>{
        funcHide();
        if(params.onCancel) params.onCancel();
      });
    }
  }
  if(params.btnClose && params.btnClose === true) layer.querySelector('[data-ref="btnClose"]').addEventListener('click',()=>funcHide());
}

const createObserver =(el, callback, option) => {
  const target = el;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if(callback) callback(entry)
      }
    });
  }, option);
  target.forEach( _this => {
    observer.observe(_this);
  })
}