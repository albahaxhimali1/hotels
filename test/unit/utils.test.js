const {shortenName, createElement} = require('../../src/scripts/utils');

test('should shorten text', () => {
  const text = shortenName('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book');
  expect(text).toBe('Lorem Ipsum is simply dummy text of the printing a...');
});

test('should return the same text', () => {
  const text = shortenName('Lorem Ipsum is simply dummy text of the printing');
  expect(text).toBe('Lorem Ipsum is simply dummy text of the printing');
});

test('should create span element', () => {
  const el = createElement('span', 'span-test', 'Created Successfully');
  expect(el.getAttribute('class')).toBe('span-test');
  expect(el.textContent).toBe('Created Successfully');
});
