import { BluePenguinAppPage } from './app.po';

describe('blue-penguin-app App', () => {
  let page: BluePenguinAppPage;

  beforeEach(() => {
    page = new BluePenguinAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
