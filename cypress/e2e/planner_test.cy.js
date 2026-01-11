describe('Test 2: Generate Plan (AI Planner)', () => {
    // Vì trang nào cũng cần đăng nhập, nên mình viết bước này để nó chạy trước
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      // Đăng nhập nhanh (nhớ sửa email/pass nếu ông đổi)
      cy.get('input[type="email"]').type('admin@trailsexplorer.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/login');
    });
  
    it('Tạo kế hoạch leo núi thành công', () => {
      // 1. Tìm và bấm vào menu "AI Planner" (hoặc Planner) trên thanh điều hướng
      cy.contains('Planner').click();
  
      // 2. Nhập địa điểm muốn đi (Tìm ô input đầu tiên)
      // LƯU Ý: Nếu code không chạy, ông dùng "Ống nhòm" soi lại cái ô nhập liệu nhé
      cy.get('input').first().clear().type('Da Lat');
  
      // 3. Bấm nút Generate (Tìm nút có chữ Generate)
      cy.contains('button', 'Generate').click();
  
      // 4. KIỂM TRA KẾT QUẢ
      // Vì AI chạy hơi lâu, nên bảo Robot chờ tối đa 15 giây (timeout: 15000)
      // Kiểm tra xem có hiện ra chữ "Lịch trình" hoặc "Plan" không
      cy.contains('Plan', { timeout: 15000 }).should('be.visible');
    });
  });