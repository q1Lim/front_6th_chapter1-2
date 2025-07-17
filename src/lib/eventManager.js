const eventRegistry = new WeakMap();
const rootListeners = new WeakMap();

export function setupEventListeners(root) {
  // 위임할 이벤트 리스트
  const eventTypes = ['click', 'focus', 'blur', 'mouseover', 'keydown', 'keyup', 'change'];
  if (!rootListeners.has(root)) {
    rootListeners.set(root, new Set());
  }
  const registeredTypes = rootListeners.get(root);

  // 상위에 정의한 이벤트 리스트 기반으로 리스너를 한번만 등록하기
  for (const eventType of eventTypes) {
    if (registeredTypes.has(eventType)) continue;

    root.addEventListener(eventType, (event) => {
      let target = event.target;
      // root 까지 거슬러 올라가기
      while (target && target !== root) {
        const handlers = eventRegistry.get(target)?.[eventType];
        if (handlers) {
          for (const handler of handlers) {
            handler(event);
          }
        }
        target = target.parentNode;
      }
    });

    registeredTypes.add(eventType);
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventRegistry.has(element)) {
    eventRegistry.set(element, {});
  }
  const events = eventRegistry.get(element);
  if (!events[eventType]) {
    events[eventType] = new Set();
  }
  events[eventType].add(handler);
}

export function removeEvent(element, eventType, handler) {
  const events = eventRegistry.get(element);
  if (events && events[eventType]) {
    events[eventType].delete(handler);
  }
}
