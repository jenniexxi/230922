class CreateSheet {
  constructor(arg) {
    this.items = arg.itemList;
    this.ifr = null;
    this.update = null;
    this.titleArry = [];
    this.init();
  }
  init() {
    this.chkDevive();
    this.createTemplate();
    this.setSearch();
    if(this.items.length > 1) this.setNav();
    wrap.addEventListener('mouseenter', ()=>{
      if(this.ifr != null) {
        this.ifr.remove();
        this.ifr = null;
      }
    });
  }
  chkDevive() {
    (navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i))
    ? document.body.classList.add('mo')
    : document.body.classList.remove('mo');
  }
  createTemplate() {
    for(let idx = 0 ; idx < this.items.length ; idx++) {
      const div = document.createElement('div');
      div.classList.add('item');
      const template = `
        <h2 class="item-title">${this.items[idx].title}</h2>
        <div class="cont">
          <table>
            <colgroup>
              <col style="width:15%;">
              <col style="width:12%;">
              <col style="width:12%;">
              <col style="width:25%">
              <col style="width:8%;">
              <col style="width:8%;">
              <col>
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
            </tbody>
          </table>
        </div>
      `;
      div.innerHTML = template;
      this.titleArry.push(div.querySelector('.item-title'));
      this.createSubTemplate(div.querySelector('tbody'), this.items[idx].list);
      wrap.insertAdjacentElement('beforeend', div);
    }
  }
  createSubTemplate(target, item) {
    for(let idx = 0 ; idx < item.length ; idx++) {
      const tr = document.createElement('tr');
      const url = item[idx].url ? item[idx].url : '';
      const template = `
        <td>${item[idx].dep1 ? item[idx].dep1 : ''}</td>
        <td>${item[idx].dep2 ? item[idx].dep2 : ''}</td>
        <td>${item[idx].dep3 ? item[idx].dep3 : ''}</td>
        <td class="url"><a href="${url}" target="_blank">${url}</a></td>
        <td class="status">${item[idx].status ? item[idx].status : ''}</td>
        <td class="modify"></td>
        <td class="left">${item[idx].etc ? item[idx].etc : ''}</td>
      `;
      tr.innerHTML = template;
      if(item[idx].state) {
        if(item[idx].state.split(',').length > 1) {
          for(let stateIdx = 0; stateIdx < item[idx].state.split(',').length ; stateIdx++) {
            tr.classList.add(item[idx].state.split(',')[stateIdx]);
          }
        } else {
          tr.classList.add(item[idx].state);
        }
      }
      this.qrSet(tr.querySelector('.url'), tr.querySelector('.url a').href)
      if(item[idx].update) this.makeUpdate(tr.querySelector('.modify'), item[idx]);
      tr.addEventListener('mouseenter',()=>{
        if(!document.body.classList.contains('mo') && url.indexOf('work_sheet') < 0) {
          this.showTempIfr(url);
        } else if(url.indexOf('work_sheet') > 0 && this.ifr != null) {
          this.ifr.remove();
          this.ifr = null;
        }
      })
      target.insertAdjacentElement('beforeend', tr);
    }
  }
  qrSet(target, url) {
    if(url.match('.me')) {
      const split = url.split('.me');
      url = `${split[0]}.me:1080${split[1]}`;
    }
    const googleQr = 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl='+url+'&choe=UTF-8';
    const qrBox = document.createElement('div');
    qrBox.innerHTML = `<img src="${googleQr}" style="width: 150px; height: 150px;">`
    qrBox.classList.add('qrBox');
    target.insertAdjacentElement('beforeend', qrBox);
  }
  showTempIfr(src) {
    if(this.ifr != null) this.ifr.remove();
    this.ifr = document.createElement('div');
    this.ifr.style.cssText = `position: fixed; top: 67px; right: 0; bottom: 0; background: #fff; z-index: 10;`;
    this.ifr.innerHTML = `<iframe src="${src}" style="width: 100%; height: 100%; border: none;">`
    this.ifr.hidden = true;

    this.ifrReszie(this.ifr);
    
    document.body.insertAdjacentElement('beforeend', this.ifr);
    this.ifr.querySelector('iframe').contentWindow.addEventListener('DOMContentLoaded', e=>{
      e.target.body.insertAdjacentHTML('beforeend', '<style>*::-webkit-scrollbar {display: none;}</style>');
      this.ifr.hidden = false;
    })
  }
  ifrReszie(target) {
    let defaultSize = 360;
    let deltaSize = 360;
    let deltaX = 0;
    let maskEl = null;
    let numEl = null;

    const trigger = document.createElement('div');
    trigger.style.cssText = `position: absolute; top: 0; bottom: 0; left: -8px; width: 8px; background: #333; cursor: col-resize;`
    this.ifr.insertAdjacentElement('beforeend', trigger);

    const resizeState = {
      get val() {
        return this._state;
      },
      set val(bool) {
        this._state = bool;
        if(bool) {
          makeMaskEl();
        } else {
          maskEl.remove();
          maskEl = null;
        }
      }
    }

    const makeMaskEl = ()=>{
      maskEl = document.createElement('div');
      maskEl.style.cssText = `position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 100; cursor: col-resize;`;
      maskEl.addEventListener('mousemove', funcResize);
      maskEl.addEventListener('mouseup', ()=>{
        resizeState.val = false;
        defaultSize = deltaSize;
        numEl.remove();
      });
      document.body.insertAdjacentElement('beforeend', maskEl);
    }

    target.style.width = `${defaultSize}px`;

    const funcResize = e=>{
      deltaSize = deltaX - e.clientX + defaultSize;
      target.style.width = `${deltaSize}px`;
      numEl.innerText = deltaSize;
    }
    
    trigger.addEventListener('mousedown', e=>{
      numEl = document.createElement('span');
      numEl.style.cssText = `position: absolute; top: 10px; left: 50%; padding: 0 5px; transform: translateX(-50%); background: #666; color: #fff;`;
      numEl.innerText = deltaSize;
      this.ifr.insertAdjacentElement('beforeend', numEl);
      deltaX = e.clientX;
      resizeState.val = true;
    });

  }
  makeUpdate(target, item) {
    const dl = document.createElement('dl');
    const btn = document.createElement('button');
    dl.innerHTML = item.update;
    if(dl.querySelectorAll('dt').length) {
      btn.innerText = dl.querySelectorAll('dt')[0].innerText;
      btn.addEventListener('click', ()=>{
        this.showUpdate(item, dl);
      });
      target.insertAdjacentElement('beforeend', btn);
    } else {
      target.innerText = item.update;
    }
  }
  showUpdate(item, dl) {
    const layer = document.createElement('div');
    layer.classList.add('ly-modify');
    layer.innerHTML = `
      <div class="ly-modify-wrap">
        <div class="ly-modify-title">
          <button type="button"></button>
        </div>
      </div>
    `;
    const title = layer.querySelector('.ly-modify-title');
    for (let idx = 3; idx > 0; idx--) {
      if(item[`dep${idx}`]) title.insertAdjacentHTML('afterbegin', `<em>${item[`dep${idx}`]}</em>`)
    }
    layer.querySelector('.ly-modify-wrap').insertAdjacentElement('beforeend', dl);

    title.querySelector('button').addEventListener('click', ()=>{
      layer.classList.add('modify-out');
      layer.addEventListener('animationend', ()=>{layer.remove()});
    });
    document.body.insertAdjacentElement('beforeend', layer);
  }
  setSearch() {
    const searchInput = document.querySelector('.search input');
    const btnKeywordDel = document.querySelector('.search button');

    searchInput.value = localStorage.getItem('keyword');

    searchInput.addEventListener('keyup', e=>{
      localStorage.setItem('keyword', e.target.value);
      this.searchSheet();
    });
    
    searchInput.addEventListener('keydown', e=>{
      if(e.target.value !== '') e.target.classList.remove('search-mode');
    });

    searchInput.addEventListener('blur', ()=>{
      searchInput.classList.add('search-mode');
    });

    btnKeywordDel.addEventListener('click', ()=>{
      searchInput.value = '';
      this.searchSheet();
      localStorage.setItem('keyword', searchInput.value);
    });
    
    searchInput.addEventListener('keydown', e=>{
      if(!e.ctrlKey && e.keyCode >= 48 && e.keyCode < 57 || !e.ctrlKey && e.keyCode >= 65 && e.keyCode < 90) {
        if(searchInput.classList.contains('search-mode')) searchInput.value = '';
      }
    });
    
    document.addEventListener('DOMContentLoaded', ()=>{
      this.searchSheet();
      if(!document.body.classList.contains('mo')) searchInput.focus();
      if(searchInput.value !== '') searchInput.classList.add('search-mode');
    });
  }
  searchSheet() {
    const td = document.querySelectorAll('td');
    td.forEach(el=>{
      const text = el.innerText;
      if (text.match(search.value) !== null) {
        if (text.match(search.value).input === text) {
          setTimeout(()=>{
            el.parentNode.removeAttribute('style');
            el.closest('.item').removeAttribute('style');
          });
        }
      } else {
        el.parentNode.style.display = 'none';
        el.closest('.item').style.display = 'none';
      }
    });
  }
  setNav() {
    const nav = document.querySelector('.sheet-nav');
    const selectWrap = document.querySelector('.select-wrap');
    const select = document.createElement('select');
    select.setAttribute('id', 'menuSelect');
    select.insertAdjacentHTML('afterbegin', '<option value="전체">전체보기</option>');
    for (let idx = 0; idx < this.items.length; idx++) {
      select.insertAdjacentHTML('beforeend', `<option value="${idx}">${this.items[idx].title}</option>`);
    }
    selectWrap.insertAdjacentElement('afterbegin', select);
    select.addEventListener('change', e=>{
      window.scroll({
        behavior: 'smooth',
        top: e.target.selectedIndex - 1 >= 0 ? this.titleArry[e.target.selectedIndex - 1].offsetTop - nav.offsetHeight : 0
      });
    })
  }
}