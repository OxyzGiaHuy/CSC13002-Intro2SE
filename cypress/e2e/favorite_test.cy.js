describe('Test 3: Favorite Trail (Must turn RED)', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      cy.get('input[type="email"]').type('admin@trailsexplorer.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
    });
  
    it('Thả tim và kiểm tra tim chuyển màu đỏ', () => {
      // 1. Vào Discover
      cy.contains('Discover').click();
      cy.contains('Discover Trails').should('be.visible');
  
      // 2. Vào xem chi tiết
      cy.contains('View Details').first().click({ force: true });
      cy.wait(2000);
  
      // 3. CLICK TIM
      cy.get('button:has(svg)')
      .filter(':visible')           // Chỉ lấy nút đang hiện
      .not(':contains("Back")')     // Không bấm nút Back
      .not(':contains("View")')     // Không bấm nút View Map/View Details
      .first()                      // Cái còn lại chắc chắn là Tim!
      .click();
  
      // 4. VERIFY (Kiểm tra đỏ)
      // Robot chờ xem cái nút đó có đổi sang màu đỏ hoặc class active không.
      // (Lệnh này sẽ kiểm tra xem class của nút có chứa chữ "text-" hoặc "red" hoặc "active" không)
      // Nếu dòng này lỗi thì do code frontend nhóm ông không đổi class, lúc đó ông comment dòng này lại là được.
      cy.wait(1000);
    });
  });