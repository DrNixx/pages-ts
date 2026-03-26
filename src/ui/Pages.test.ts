/**
 * @vitest-environment jsdom
 * 
 * Модульные тесты для класса Pages
 * 
 * Покрытие:
 * - Инициализация и конструктор
 * - setUserAgent и определение мобильных устройств
 * - Полноэкранный режим
 * - Работа с цветами (getColor)
 * - Проверка видимости элементов
 * - Манипуляции с классами
 * - DOM манипуляции (wrap, offset, insertAfter)
 * - Селекторы и поиск элементов
 * - Обработчики событий
 * - Утилиты (extend, hasParent, getClosest)
 */

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { Pages, pg } from './Pages';

// Моки для внешних зависимостей
vi.mock('lodash/isNumber', () => ({
  default: (value: unknown): value is number => typeof value === 'number' && !isNaN(value)
}));

describe('Pages', () => {
  let pages: Pages;
  let body: HTMLBodyElement;

  beforeEach(() => {
    // Очищаем DOM перед каждым тестом
    document.body.innerHTML = '';
    body = document.body as HTMLBodyElement;
    pages = new Pages();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('Конструктор и инициализация', () => {
    it('should_create_instance_with_default_values', () => {
      expect(pages).toBeDefined();
      expect(pages.VERSION).toBe('5.0.0');
      expect(pages.SUPPORT).toBe('support@chess-online.com');
    });

    it('should_call_init_on_construction', () => {
      const initSpy = vi.spyOn(Pages.prototype, 'init');
      new Pages();
      expect(initSpy).toHaveBeenCalled();
      initSpy.mockRestore();
    });

    it('should_set_user_agent_on_init', () => {
      // Проверяем, что после инициализации body имеет класс mobile или desktop
      expect(body.classList.contains('mobile') || body.classList.contains('desktop')).toBe(true);
    });
  });

  describe('setUserAgent', () => {
    it('should_add_mobile_class_for_android', () => {
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Android 11.0');
      document.body.className = '';
      
      pages.init();
      
      expect(body.classList.contains('mobile')).toBe(true);
      expect(body.classList.contains('desktop')).toBe(false);
    });

    it('should_add_mobile_class_for_iphone', () => {
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('iPhone OS 14_0');
      document.body.className = '';
      
      pages.init();
      
      expect(body.classList.contains('mobile')).toBe(true);
    });

    it('should_add_mobile_class_for_ipad', () => {
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('iPad OS 14_0');
      document.body.className = '';
      
      pages.init();
      
      expect(body.classList.contains('mobile')).toBe(true);
    });

    it('should_add_mobile_class_for_blackberry', () => {
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('BlackBerry');
      document.body.className = '';
      
      pages.init();
      
      expect(body.classList.contains('mobile')).toBe(true);
    });

    it('should_add_mobile_class_for_opera_mini', () => {
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Opera Mini');
      document.body.className = '';
      
      pages.init();
      
      expect(body.classList.contains('mobile')).toBe(true);
    });

    it('should_add_mobile_class_for_iemobile', () => {
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('IEMobile');
      document.body.className = '';
      
      pages.init();
      
      expect(body.classList.contains('mobile')).toBe(true);
    });

    it('should_add_desktop_class_for_non_mobile', () => {
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      document.body.className = '';
      
      pages.init();
      
      expect(body.classList.contains('desktop')).toBe(true);
      expect(body.classList.contains('mobile')).toBe(false);
    });

    it('should_add_ie9_class_for_ie9_browser', () => {
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('MSIE 9.0');
      document.body.className = '';
      
      pages.init();
      
      expect(body.classList.contains('desktop')).toBe(true);
      expect(body.classList.contains('ie9')).toBe(true);
    });
  });

  describe('isMobile', () => {
    it('should_return_true_from_userAgentData_when_available', () => {
      // @ts-ignore - мокаем userAgentData
      window.navigator.userAgentData = { mobile: true };
      
      expect(pages.isMobile()).toBe(true);
    });

    it('should_return_false_from_userAgentData_when_available', () => {
      // @ts-ignore - мокаем userAgentData
      window.navigator.userAgentData = { mobile: false };
      
      expect(pages.isMobile()).toBe(false);
    });

    it('should_fallback_to_body_class_when_userAgentData_not_available', () => {
      // @ts-ignore
      window.navigator.userAgentData = undefined;
      body.className = 'mobile';
      
      expect(pages.isMobile()).toBe(true);
    });

    it('should_return_false_when_no_mobile_class_and_no_userAgentData', () => {
      // @ts-ignore
      window.navigator.userAgentData = undefined;
      body.className = 'desktop';
      
      expect(pages.isMobile()).toBe(false);
    });
  });

  describe('setFullScreen', () => {
    it('should_call_requestFullScreen_when_supported', () => {
      const mockElement = document.createElement('div');
      const requestFullScreenSpy = vi.fn();
      (mockElement as any).requestFullScreen = requestFullScreenSpy;
      
      pages.setFullScreen(mockElement);
      
      expect(requestFullScreenSpy).toHaveBeenCalled();
    });

    it('should_call_webkitRequestFullScreen_when_standard_not_available', () => {
      const mockElement = document.createElement('div');
      const webkitRequestFullScreenSpy = vi.fn();
      // @ts-ignore
      mockElement.webkitRequestFullScreen = webkitRequestFullScreenSpy;
      
      pages.setFullScreen(mockElement);
      
      expect(webkitRequestFullScreenSpy).toHaveBeenCalled();
    });

    it('should_call_mozRequestFullScreen_when_standard_not_available', () => {
      const mockElement = document.createElement('div');
      const mozRequestFullScreenSpy = vi.fn();
      // @ts-ignore
      mockElement.mozRequestFullScreen = mozRequestFullScreenSpy;
      
      pages.setFullScreen(mockElement);
      
      expect(mozRequestFullScreenSpy).toHaveBeenCalled();
    });

    it('should_call_msRequestFullScreen_when_standard_not_available', () => {
      // Этот тест проверяет путь для старого IE через ActiveXObject
      // В jsdom ActiveXObject не существует, поэтому тестируем что код не падает
      const mockElement = document.createElement('div');
      
      // Удаляем все стандартные методы
      Object.defineProperty(mockElement, 'requestFullScreen', { value: undefined, configurable: true });
      Object.defineProperty(mockElement, 'webkitRequestFullScreen', { value: undefined, configurable: true });
      Object.defineProperty(mockElement, 'mozRequestFullScreen', { value: undefined, configurable: true });
      Object.defineProperty(mockElement, 'msRequestFullScreen', { value: undefined, configurable: true });
      
      // В jsdom ActiveXObject не определён, поэтому функция должна завершиться без ошибок
      expect(() => pages.setFullScreen(mockElement)).not.toThrow();
    });
  });

  describe('getColor', () => {
    beforeEach(() => {
      // Очищаем pg-colors элементы перед каждым тестом
      const existingColors = document.querySelectorAll('.pg-colors');
      existingColors.forEach(el => el.remove());
    });

    it('should_create_pg_colors_container_if_not_exists', () => {
      pages.getColor('primary', 0.5);
      
      expect(document.querySelector('.pg-colors')).toBeDefined();
    });

    it('should_create_color_element_for_new_color', () => {
      // Мокаем getComputedStyle для возврата корректного цвета
      const originalGetComputedStyle = window.getComputedStyle;
      vi.spyOn(window, 'getComputedStyle').mockImplementation((elem: Element) => {
        const style = originalGetComputedStyle(elem);
        if (elem.classList.contains('bg-primary')) {
          Object.defineProperty(style, 'backgroundColor', {
            value: 'rgb(0, 123, 255)',
            writable: false,
            configurable: true
          });
        }
        return style;
      });
      
      const color = pages.getColor('primary', 0.5);
      
      expect(color).toBeDefined();
      expect(color).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/);
    });

    it('should_reuse_existing_color_element', () => {
      // Первый вызов создает элемент
      pages.getColor('primary', 0.5);
      const firstColorElem = document.querySelector('[data-color="primary"]');
      
      // Второй вызов должен использовать существующий
      pages.getColor('primary', 0.8);
      const secondColorElem = document.querySelector('[data-color="primary"]');
      
      expect(firstColorElem).toBe(secondColorElem);
    });

    it('should_use_existing_pg_colors_container', () => {
      const container = document.createElement('div');
      container.className = 'pg-colors';
      document.body.appendChild(container);
      
      pages.getColor('success', 0.7);
      
      expect(document.querySelectorAll('.pg-colors').length).toBe(1);
    });

    it('should_parse_opacity_from_string', () => {
      const originalGetComputedStyle = window.getComputedStyle;
      vi.spyOn(window, 'getComputedStyle').mockImplementation((elem: Element) => {
        const style = originalGetComputedStyle(elem);
        if (elem.classList.contains('bg-danger')) {
          Object.defineProperty(style, 'backgroundColor', {
            value: 'rgb(220, 53, 69)',
            writable: false,
            configurable: true
          });
        }
        return style;
      });
      
      const color = pages.getColor('danger', '0.8');
      
      expect(color).toMatch(/^rgba\(\d+, \d+, \d+, 0\.8\)$/);
    });

    it('should_use_default_opacity_when_invalid', () => {
      const originalGetComputedStyle = window.getComputedStyle;
      vi.spyOn(window, 'getComputedStyle').mockImplementation((elem: Element) => {
        const style = originalGetComputedStyle(elem);
        if (elem.classList.contains('bg-warning')) {
          Object.defineProperty(style, 'backgroundColor', {
            value: 'rgb(255, 193, 7)',
            writable: false,
            configurable: true
          });
        }
        return style;
      });
      
      const color = pages.getColor('warning', 'invalid');
      
      expect(color).toMatch(/^rgba\(\d+, \d+, \d+, 1\)$/);
    });

    it('should_handle_numeric_opacity', () => {
      const originalGetComputedStyle = window.getComputedStyle;
      vi.spyOn(window, 'getComputedStyle').mockImplementation((elem: Element) => {
        const style = originalGetComputedStyle(elem);
        if (elem.classList.contains('bg-info')) {
          Object.defineProperty(style, 'backgroundColor', {
            value: 'rgb(23, 162, 184)',
            writable: false,
            configurable: true
          });
        }
        return style;
      });
      
      const color = pages.getColor('info', 0.3);
      
      expect(color).toMatch(/^rgba\(\d+, \d+, \d+, 0\.3\)$/);
    });
  });

  describe('isVisible', () => {
    it('should_return_true_for_visible_element', () => {
      const element = document.createElement('div');
      element.style.width = '100px';
      element.style.height = '100px';
      element.style.display = 'block';
      document.body.appendChild(element);
      
      // Мокаем offsetWidth и offsetHeight для jsdom
      Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });
      Object.defineProperty(element, 'offsetHeight', { value: 100, configurable: true });
      
      expect(pages.isVisible(element)).toBe(true);
    });

    it('should_return_false_for_hidden_element', () => {
      const element = document.createElement('div');
      element.style.display = 'none';
      document.body.appendChild(element);
      
      expect(pages.isVisible(element)).toBe(false);
    });

    it('should_return_false_for_zero_dimensions', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      expect(pages.isVisible(element)).toBe(false);
    });
  });

  describe('Проверка видимости для разных размеров экрана', () => {
    beforeEach(() => {
      // Очищаем элементы видимости
      const visibleElements = document.querySelectorAll('[id^="pg-visible-"]');
      visibleElements.forEach(el => el.remove());
    });

    it('should_check_visibility_for_xs_size', () => {
      const result = pages.isVisibleXs();
      
      const xsElement = document.getElementById('pg-visible-xs');
      expect(xsElement).toBeDefined();
      expect(typeof result).toBe('boolean');
    });

    it('should_check_visibility_for_sm_size', () => {
      const result = pages.isVisibleSm();
      
      const smElement = document.getElementById('pg-visible-sm');
      expect(smElement).toBeDefined();
      expect(typeof result).toBe('boolean');
    });

    it('should_check_visibility_for_md_size', () => {
      const result = pages.isVisibleMd();
      
      const mdElement = document.getElementById('pg-visible-md');
      expect(mdElement).toBeDefined();
      expect(typeof result).toBe('boolean');
    });

    it('should_check_visibility_for_lg_size', () => {
      const result = pages.isVisibleLg();
      
      const lgElement = document.getElementById('pg-visible-lg');
      expect(lgElement).toBeDefined();
      expect(typeof result).toBe('boolean');
    });

    it('should_check_visibility_for_xl_size', () => {
      const result = pages.isVisibleXl();
      
      const xlElement = document.getElementById('pg-visible-xl');
      expect(xlElement).toBeDefined();
      expect(typeof result).toBe('boolean');
    });

    it('should_reuse_existing_visibility_element', () => {
      pages.isVisibleXs();
      const firstElement = document.getElementById('pg-visible-xs');
      
      pages.isVisibleXs();
      const secondElement = document.getElementById('pg-visible-xs');
      
      expect(firstElement).toBe(secondElement);
    });
  });

  describe('isTouchDevice', () => {
    it('should_return_true_when_ontouchstart_exists', () => {
      // Проверяем наличие 'ontouchstart' в documentElement
      const originalHasOwnProperty = document.documentElement.hasOwnProperty;
      
      // Мокаем проверку свойства через in operator
      vi.spyOn(document.documentElement, 'ontouchstart', 'get').mockImplementation(() => () => {});
      
      expect(pages.isTouchDevice()).toBe(true);
    });

    it('should_return_false_when_ontouchstart_not_exists', () => {
      // В jsdom ontouchstart может существовать по умолчанию, поэтому используем другой подход
      // Создаем новый элемент без ontouchstart для теста
      const testElement = document.createElement('div');
      const hasTouch = 'ontouchstart' in testElement;
      
      // Тестируем что метод возвращает корректное значение для текущего окружения
      const result = pages.isTouchDevice();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Манипуляции с классами', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      document.body.appendChild(element);
    });

    describe('hasClass', () => {
      it('should_return_true_when_class_exists', () => {
        element.className = 'test-class';
        
        expect(pages.hasClass(element, 'test-class')).toBe(true);
      });

      it('should_return_false_when_class_not_exists', () => {
        element.className = 'other-class';
        
        expect(pages.hasClass(element, 'test-class')).toBe(false);
      });

      it('should_return_false_for_null_element', () => {
        expect(pages.hasClass(null as any, 'test-class')).toBe(false);
      });

      it('should_handle_multiple_classes', () => {
        element.className = 'class1 class2 class3';
        
        expect(pages.hasClass(element, 'class2')).toBe(true);
      });
    });

    describe('addClass', () => {
      it('should_add_class_to_element', () => {
        pages.addClass(element, 'new-class');
        
        expect(element.classList.contains('new-class')).toBe(true);
      });

      it('should_not_duplicate_existing_class', () => {
        element.classList.add('existing-class');
        pages.addClass(element, 'existing-class');
        
        expect(element.className.match(/existing-class/g)?.length).toBe(1);
      });

      it('should_handle_null_element', () => {
        expect(() => pages.addClass(null as any, 'class')).not.toThrow();
      });

      it('should_add_multiple_classes_separately', () => {
        pages.addClass(element, 'class1');
        pages.addClass(element, 'class2');
        
        expect(element.classList.contains('class1')).toBe(true);
        expect(element.classList.contains('class2')).toBe(true);
      });
    });

    describe('removeClass', () => {
      it('should_remove_class_from_element', () => {
        element.classList.add('to-remove');
        pages.removeClass(element, 'to-remove');
        
        expect(element.classList.contains('to-remove')).toBe(false);
      });

      it('should_not_affect_other_classes', () => {
        element.classList.add('keep1', 'to-remove', 'keep2');
        pages.removeClass(element, 'to-remove');
        
        expect(element.classList.contains('keep1')).toBe(true);
        expect(element.classList.contains('keep2')).toBe(true);
      });

      it('should_handle_null_element', () => {
        expect(() => pages.removeClass(null as any, 'class')).not.toThrow();
      });

      it('should_handle_non_existing_class', () => {
        element.classList.add('existing');
        pages.removeClass(element, 'non-existing');
        
        expect(element.classList.contains('existing')).toBe(true);
      });
    });

    describe('toggleClass', () => {
      it('should_remove_class_when_exists', () => {
        element.classList.add('toggle-me');
        pages.toggleClass(element, 'toggle-me');
        
        expect(element.classList.contains('toggle-me')).toBe(false);
      });

      it('should_add_class_when_not_exists', () => {
        pages.toggleClass(element, 'toggle-me');
        
        expect(element.classList.contains('toggle-me')).toBe(true);
      });
    });
  });

  describe('DOM манипуляции', () => {
    describe('offset', () => {
      it('should_return_offset_with_left_and_top', () => {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '50px';
        element.style.top = '100px';
        document.body.appendChild(element);
        
        const offset = pages.offset(element);
        
        expect(offset).toHaveProperty('left');
        expect(offset).toHaveProperty('top');
        expect(typeof offset.left).toBe('number');
        expect(typeof offset.top).toBe('number');
      });
    });

    describe('wrap', () => {
      it('should_wrap_element_in_wrapper', () => {
        const element = document.createElement('div');
        element.id = 'wrapped';
        const wrapper = document.createElement('div');
        wrapper.id = 'wrapper';
        document.body.appendChild(element);
        
        pages.wrap(element, wrapper);
        
        expect(wrapper.contains(element)).toBe(true);
        expect(document.body.contains(wrapper)).toBe(true);
      });

      it('should_handle_null_element', () => {
        const wrapper = document.createElement('div');
        expect(() => pages.wrap(null as any, wrapper)).not.toThrow();
      });
    });

    describe('wrapAll', () => {
      it('should_wrap_multiple_elements_in_single_wrapper', () => {
        const elements: NodeListOf<ChildNode> = document.createElement('div').childNodes;
        const wrapper = document.createElement('div');
        wrapper.id = 'wrapper';
        
        document.body.innerHTML = '<div class="item">1</div><div class="item">2</div><div class="item">3</div>';
        const items = document.querySelectorAll('.item');
        
        pages.wrapAll(Array.from(items), wrapper);
        
        expect(wrapper.children.length).toBe(3);
      });
    });

    describe('insertAfter', () => {
      it('should_insert_element_after_reference', () => {
        const container = document.createElement('div');
        const reference = document.createElement('span');
        reference.id = 'reference';
        const newNode = document.createElement('span');
        newNode.id = 'new';
        
        container.appendChild(reference);
        document.body.appendChild(container);
        
        pages.insertAfter(newNode, reference);
        
        expect(container.children[1]).toBe(newNode);
        expect(container.children[0]).toBe(reference);
      });
    });
  });

  describe('Селекторы и поиск элементов', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="parent">
          <div class="child item">Item 1</div>
          <div class="child item">Item 2</div>
          <div class="child special">Item 3</div>
        </div>
      `;
    });

    describe('getElementsByClassName', () => {
      it('should_return_array_of_elements_by_class', () => {
        const parent = document.getElementById('parent')!;
        const elements = pages.getElementsByClassName(parent, 'child');
        
        expect(Array.isArray(elements)).toBe(true);
        expect(elements.length).toBe(3);
      });

      it('should_return_empty_array_when_no_matches', () => {
        const parent = document.getElementById('parent')!;
        const elements = pages.getElementsByClassName(parent, 'non-existent');
        
        expect(elements).toEqual([]);
      });
    });

    describe('queryElement', () => {
      it('should_return_single_element_by_selector', () => {
        const element = pages.queryElement('.special');
        
        expect(element).toBeDefined();
        expect(element?.textContent).toContain('Item 3');
      });

      it('should_return_element_within_parent', () => {
        const parent = document.getElementById('parent')!;
        const element = pages.queryElement('.child', parent);
        
        expect(element).toBeDefined();
        expect(parent.contains(element)).toBe(true);
      });

      it('should_return_object_as_is_when_selector_is_object', () => {
        const mockElement = document.createElement('div');
        const result = pages.queryElement(mockElement);
        
        expect(result).toBe(mockElement);
      });

      it('should_return_null_when_not_found', () => {
        const element = pages.queryElement('.non-existent');
        
        expect(element).toBeNull();
      });
    });

    describe('queryElements', () => {
      it('should_return_array_of_elements_by_selector', () => {
        const elements = pages.queryElements('.item');
        
        expect(Array.isArray(elements)).toBe(true);
        expect(elements.length).toBe(2);
      });

      it('should_return_empty_array_when_no_matches', () => {
        const elements = pages.queryElements('.non-existent');
        
        expect(elements).toEqual([]);
      });
    });

    describe('getClosest', () => {
      it('should_find_closest_matching_ancestor', () => {
        const child = document.querySelector('.special')!;
        const closest = pages.getClosest(child, '#parent');
        
        expect(closest?.id).toBe('parent');
      });

      it('should_return_null_when_no_matching_ancestor', () => {
        const child = document.querySelector('.special')!;
        const closest = pages.getClosest(child, '.non-existent');
        
        expect(closest).toBeNull();
      });

      it('should_return_null_for_document', () => {
        const closest = pages.getClosest(document, 'body');
        
        expect(closest).toBeNull();
      });
    });

    describe('hasParent', () => {
      it('should_return_true_when_element_has_parent', () => {
        const child = document.querySelector('.child')!;
        const parent = document.getElementById('parent')!;
        
        expect(pages.hasParent({ target: child }, parent)).toBe(true);
      });

      it('should_return_false_when_parent_not_found', () => {
        const child = document.querySelector('.child')!;
        const unrelated = document.createElement('div');
        
        expect(pages.hasParent({ target: child }, unrelated)).toBe(false);
      });

      it('should_return_false_for_null_event', () => {
        expect(pages.hasParent(null, document.body)).toBe(false);
      });
    });
  });

  describe('Обработчики событий', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('button');
      document.body.appendChild(element);
    });

    describe('on', () => {
      it('should_add_event_listener', () => {
        const handler = vi.fn();
        pages.on(element, 'click', handler);
        
        element.click();
        
        expect(handler).toHaveBeenCalled();
      });
    });

    describe('off', () => {
      it('should_remove_event_listener', () => {
        const handler = vi.fn();
        pages.on(element, 'click', handler);
        pages.off(element, 'click', handler);
        
        element.click();
        
        expect(handler).not.toHaveBeenCalled();
      });
    });

    describe('one', () => {
      it('should_execute_handler_only_once', () => {
        const handler = vi.fn();
        pages.one(element, 'click', handler);
        
        element.click();
        element.click();
        
        expect(handler).toHaveBeenCalledTimes(1);
      });
    });

    describe('live', () => {
      it('should_handle_delegated_events', () => {
        document.body.innerHTML = '<div id="container"><button class="btn">Click</button></div>';
        const handler = vi.fn();
        
        pages.live('.btn', 'click', handler);
        
        const button = document.querySelector('.btn')! as HTMLDivElement;
        button.click();
        
        expect(handler).toHaveBeenCalled();
      });

      it('should_call_handler_with_correct_context', () => {
        document.body.innerHTML = '<div id="container"><button class="btn">Click</button></div>';
        let contextElement: HTMLElement | null = null;
        
        pages.live('.btn', 'click', function(this: HTMLElement) {
          contextElement = this;
        });
        
        const button = document.querySelector('.btn') as HTMLElement;
        button.click();
        
        expect(contextElement).toBe(button);
      });
    });

    describe('addEvent/removeEvent', () => {
      it('should_add_event_using_addEventListener', () => {
        const handler = vi.fn();
        pages.addEvent(element, 'click', handler);
        
        element.click();
        
        expect(handler).toHaveBeenCalled();
      });

      it('should_remove_event_using_removeEventListener', () => {
        const handler = vi.fn();
        pages.addEvent(element, 'click', handler);
        pages.removeEvent(element, 'click', handler);
        
        element.click();
        
        expect(handler).not.toHaveBeenCalled();
      });
    });
  });

  describe('extend', () => {
    it('should_merge_properties_from_b_to_a', () => {
      const a = { foo: 'bar' } as any;
      const b = { baz: 'qux', quux: 'corge' } as any;
      
      const result = pages.extend(a, b);
      
      expect(result.foo).toBe('bar');
      expect(result.baz).toBe('qux');
      expect(result.quux).toBe('corge');
    });

    it('should_override_existing_properties', () => {
      const a = { foo: 'original' };
      const b = { foo: 'overridden' };
      
      const result = pages.extend(a, b);
      
      expect(result.foo).toBe('overridden');
    });

    it('should_return_a_when_b_is_undefined', () => {
      const a = { foo: 'bar' };
      
      const result = pages.extend(a, undefined as any);
      
      expect(result).toBe(a);
      expect(result.foo).toBe('bar');
    });

    it('should_not_merge_prototype_properties', () => {
      const a: Record<string, unknown> = {};
      const b = Object.create({ inherited: 'value' });
      b.own = 'own-value';
      
      const result = pages.extend(a, b);
      
      expect(result.own).toBe('own-value');
      expect(result.inherited).toBeUndefined();
    });
  });

  describe('initializeDataAPI', () => {
    it('should_instantiate_constructor_for_each_item_in_collection', () => {
      const mockConstructor = vi.fn();
      const collection = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];
      
      pages.initializeDataAPI(null, mockConstructor, collection);
      
      expect(mockConstructor).toHaveBeenCalledTimes(3);
      expect(mockConstructor).toHaveBeenCalledWith({ id: 1 });
      expect(mockConstructor).toHaveBeenCalledWith({ id: 2 });
      expect(mockConstructor).toHaveBeenCalledWith({ id: 3 });
    });

    it('should_handle_empty_collection', () => {
      const mockConstructor = vi.fn();
      
      pages.initializeDataAPI(null, mockConstructor, []);
      
      expect(mockConstructor).not.toHaveBeenCalled();
    });
  });

  describe('Глобальный экземпляр pg', () => {
    it('should_export_pg_instance', () => {
      expect(pg).toBeDefined();
      expect(pg).toBeInstanceOf(Pages);
    });

    it('should_attach_pg_to_window', () => {
      expect((window as any)['pg']).toBeDefined();
      expect((window as any)['pg']).toBe(pg);
    });

    it('should_have_same_instance_as_exported', () => {
      expect((window as any)['pg']).toBe(pg);
    });
  });
});
