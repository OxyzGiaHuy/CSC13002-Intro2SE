describe('Test 2: Generate Plan (AI Planner)', () => {
    // Vì trang nào cũng cần đăng nhập, nên mình viết bước này để nó chạy trước
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      // Đăng nhập nhanh (nhớ sửa email/pass nếu ông đổi)
      cy.get('input[type="email"]').type('hktn2403@gmail.com');
      cy.get('input[type="password"]').type('kimtris123');
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
      // Thay vì tìm "Day 1", hãy tìm tiêu đề lớn "Your Itinerary"
      // (Cho nó chờ 20s luôn cho chắc ăn vì AI đôi khi lag)
      cy.contains('Your Itinerary', { timeout: 20000 }).should('be.visible');
      // Sau khi thấy tiêu đề rồi, kiểm tra xem có chữ "Day" nào xuất hiện bên dưới không
      // Tìm lỏng hơn (chỉ tìm chữ "Day") để tránh lỗi khoảng trắng
      cy.contains('Day', { timeout: 20000 }).should('be.visible');
    });
  });