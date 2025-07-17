import { addEvent } from './eventManager.js';

export function createElement(vNode) {
  // 함수형 컴포넌트 오류 발생 에러 추가
  if (typeof vNode === 'function') {
    throw new Error('컴포넌트는 createElement로 처리할 수 없습니다.');
  }
  // null, undefined, boolean값에 빈 텍스트 노드로 반환
  if (vNode === null || vNode === undefined || vNode === true || vNode === false) {
    return document.createTextNode('');
  }
  // 숫자에 대해 텍스트 노드로 반환
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return document.createTextNode(String(vNode));
  }
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }
  const elem = document.createElement(vNode.type);

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElem = createElement(child);
      elem.appendChild(childElem);
    });
  }
  if (vNode.props) {
    updateAttributes(elem, vNode.props);
  }
  return elem;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    // boolean 속성 처리
    if (typeof value === 'boolean') {
      if (key === 'checked' || key === 'selected' || key === 'readOnly' || key === 'disabled') {
        $el[key] = true;
      } else {
        if (key in $el) {
          $el[key] = true;
        }
        $el.setAttribute(key, '');
      }
    } else if (key === 'className') {
      $el.setAttribute('class', value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        $el.style[styleKey] = styleValue;
      });
    } else if (key.startsWith('data-')) {
      // 데이터 속성 처리
      $el.setAttribute(key, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else {
      // data-와 동일한 setAttribute 를 실행하지만,, 우선 분리
      $el.setAttribute(key, value);
    }
  });
}
