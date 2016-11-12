import { DocumentHandlerClientPage } from './app.po';

describe('document-handler-client App', function() {
  let page: DocumentHandlerClientPage;

  beforeEach(() => {
    page = new DocumentHandlerClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
